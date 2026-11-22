import { initializeApp } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-app.js";

import {
    getAuth,
    signInAnonymously,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js";

import {
    getDatabase,
    ref,
    set,
    get,
    runTransaction,
    onValue,
    remove
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-database.js";
const gameQuestions = window.gameQuestions || [];
const firebaseConfig = {
    apiKey: "AIzaSyBAz9CIktHU7EAzfCel8luT7GcNUL2TbRU",
    authDomain: "top10s-faaf0.firebaseapp.com",
    databaseURL: "https://top10s-faaf0-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "top10s-faaf0",
    storageBucket: "top10s-faaf0.firebasestorage.app",
    messagingSenderId: "116468457958",
    appId: "1:116468457958:web:264e18938b4f2d858e7627"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);

export const authReady = new Promise((resolve, reject) => {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            resolve(user);
            return;
        }

        try {
            const result = await signInAnonymously(auth);
            resolve(result.user);
        } catch (error) {
            reject(error);
        }
    });
});

console.log("Firebase multiplayer initialized");
// عناصر واجهة اللعب الجماعي
const createRoomBtn = document.getElementById("createRoomBtn");
const joinRoomBtn = document.getElementById("joinRoomBtn");
const startMatchBtn = document.getElementById("startMatchBtn");
const nextRoundBtn = document.getElementById("nextRoundBtn");
const endMatchBtn = document.getElementById("endMatchBtn");
const exitRoomBtn = document.getElementById("exitRoomBtn");
const exitRoomGameBtn = document.getElementById("exitRoomGameBtn");
const roomCodeInput = document.getElementById("roomCodeInput");
const playerNameInput = document.getElementById("playerNameInput");
const roomMessage = document.getElementById("roomMessage");
const questionTitle = document.getElementById("question");
const gameScreen = document.getElementById("game");
const welcomeScreen = document.querySelector(".welcome");
// عناصر قائمة اللاعبين
const roomPlayers = document.getElementById("roomPlayers");
const playersCount = document.getElementById("playersCount");
const playersList = document.getElementById("playersList");

// مراقبة السؤال الحالي ومزامنته لجميع لاعبي الغرفة
function listenToCurrentQuestion() {
    if (!currentRoomCode) return;

    const questionRef = ref(
        db,
        "rooms/" + currentRoomCode + "/currentQuestionIndex"
    );

    onValue(questionRef, (snapshot) => {
        if (!snapshot.exists()) return;

        const questionIndex = Number(snapshot.val());
        if (
            !Number.isInteger(questionIndex) ||
            questionIndex < 0 ||
            questionIndex >= gameQuestions.length
        ) {
            roomMessage.textContent = "تعذّر تحميل سؤال الجولة.";
            return;
        }

        if (typeof window.loadMultiplayerQuestion === "function") {
            window.loadMultiplayerQuestion(questionIndex);
        } else {
            questionTitle.textContent = gameQuestions[questionIndex].question;
        }
        if (welcomeScreen) welcomeScreen.style.display = "none";
        if (gameScreen) gameScreen.style.display = "block";
    });
}

// بيانات اللاعب والغرفة
let currentUser = null;
let currentRoomCode = null;
let isHost = false;
let matchIsPlaying = false;
let sharedFoundAnswers = {};
let roundSummaryShown = false;
let roundHistoryCache = {};

const answerInput = document.getElementById("answerInput");
const gameMessage = document.getElementById("message");

function listenToRoundHistory() {
    if (!currentRoomCode) return;

    const historyRef = ref(db, "rooms/" + currentRoomCode + "/roundHistory");
    onValue(historyRef, (snapshot) => {
        roundHistoryCache = snapshot.val() || {};
        const rounds = Object.keys(roundHistoryCache)
            .map(Number)
            .filter(Number.isInteger)
            .sort((a, b) => a - b);

        if (rounds.length === 0) return;

        const latestRound = rounds[rounds.length - 1];
        renderMultiplayerStandings(latestRound, rounds);
    });
}

async function renderMultiplayerStandings(latestRound, rounds) {
    const panel = document.getElementById("multiplayerResults");
    const title = document.getElementById("multiplayerResultsTitle");
    const list = document.getElementById("multiplayerStandingsList");
    if (!panel || !title || !list) return;

    const playersSnapshot = await get(ref(db, "rooms/" + currentRoomCode + "/players"));
    const players = playersSnapshot.val() || {};
    const totals = {};

    Object.keys(players).forEach(uid => {
        totals[uid] = {
            name: players[uid].name || "لاعب",
            points: 0,
            roundPoints: 0
        };
    });

    rounds.forEach(round => {
        const scores = (roundHistoryCache[round] && roundHistoryCache[round].scores) || {};
        Object.keys(scores).forEach(uid => {
            if (!totals[uid]) {
                totals[uid] = { name: scores[uid].name || "لاعب", points: 0, roundPoints: 0 };
            }
            totals[uid].points += Number(scores[uid].points) || 0;
            if (round === latestRound) {
                totals[uid].roundPoints = Number(scores[uid].points) || 0;
            }
        });
    });

    const ranking = Object.entries(totals).sort((a, b) =>
        b[1].points - a[1].points || a[1].name.localeCompare(b[1].name, "ar")
    );

    const statusSnapshot = await get(ref(db, "rooms/" + currentRoomCode + "/status"));
    const isFinal = statusSnapshot.val() === "ended";
    title.textContent = isFinal
        ? "🏆 الترتيب النهائي للمباراة"
        : "📊 نتائج الجولة " + latestRound;

    list.innerHTML = "";
    ranking.forEach(([uid, player], index) => {
        const row = document.createElement("li");
        const medal = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : (index + 1) + ".";
        row.textContent = medal + " " + player.name +
            " — نقاط الجولة: " + player.roundPoints +
            " — المجموع: " + player.points;
        list.appendChild(row);
    });

    panel.style.display = "block";
    const homeButton = document.getElementById("multiplayerHomeBtn");
    if (homeButton) homeButton.style.display = isFinal ? "block" : "none";
}

async function saveCurrentRoundResults() {
    const roundSnapshot = await get(ref(db, "rooms/" + currentRoomCode + "/roundNumber"));
    const roundNumber = Number(roundSnapshot.val()) || 1;
    const historyRef = ref(db, "rooms/" + currentRoomCode + "/roundHistory/" + roundNumber);
    const existing = await get(historyRef);
    if (existing.exists()) return roundNumber;

    const [answersSnapshot, playersSnapshot] = await Promise.all([
        get(ref(db, "rooms/" + currentRoomCode + "/currentRoundAnswers")),
        get(ref(db, "rooms/" + currentRoomCode + "/players"))
    ]);

    const answers = answersSnapshot.val() || {};
    const players = playersSnapshot.val() || {};
    const scores = {};

    Object.keys(players).forEach(uid => {
        scores[uid] = {
            name: players[uid].name || "لاعب",
            points: 0
        };
    });

    Object.values(answers).forEach(record => {
        if (record && record.uid && scores[record.uid]) {
            scores[record.uid].points += Number(record.points) || 0;
        }
    });

    await set(historyRef, {
        scores,
        completedAt: Date.now()
    });

    return roundNumber;
}

function listenToCurrentRoundAnswers() {
    if (!currentRoomCode) return;

    const answersRef = ref(db, "rooms/" + currentRoomCode + "/currentRoundAnswers");
    onValue(answersRef, (snapshot) => {
        sharedFoundAnswers = snapshot.val() || {};
        const ownPoints = Object.values(sharedFoundAnswers)
            .filter(record => record && record.uid === currentUser.uid)
            .reduce((total, record) => total + (Number(record.points) || 0), 0);

        if (typeof window.updateMultiplayerAnswers === "function") {
            window.updateMultiplayerAnswers(sharedFoundAnswers, ownPoints);
        }
    });
}

async function submitMultiplayerAnswer(rawAnswer) {
    const answer = String(rawAnswer || "").trim();
    if (!answer || !currentRoomCode || !matchIsPlaying) return;
    if (!window.canSubmitMultiplayerAnswer()) {
        gameMessage.textContent = "انتهت محاولاتك أو اكتُشفت الإجابات العشر.";
        return;
    }

    answerInput.value = "";
    const answerIndex = window.findMultiplayerAnswerIndex(answer);

    if (answerIndex < 0) {
        window.applyMultiplayerWrongAnswer();
        return;
    }

    if (sharedFoundAnswers[answerIndex]) {
        gameMessage.textContent = "هذه الإجابة اكتشفها لاعب آخر بالفعل.";
        gameMessage.style.color = "#ffe18b";
        return;
    }

    const answerRef = ref(
        db,
        "rooms/" + currentRoomCode + "/currentRoundAnswers/" + answerIndex
    );
    const points = 100 - (answerIndex * 10);

    try {
        const result = await runTransaction(answerRef, (current) => {
            if (current !== null) return;
            return {
                uid: currentUser.uid,
                claimedAt: Date.now(),
                points
            };
        });

        if (result.committed) {
            gameMessage.textContent = "إجابة صحيحة! تم تسجيلها للجميع.";
            gameMessage.style.color = "#8fffc2";
        } else {
            gameMessage.textContent = "سبق لاعب آخر إلى هذه الإجابة.";
            gameMessage.style.color = "#ffe18b";
        }
    } catch (error) {
        console.error("Answer submission error:", error);
        gameMessage.textContent = "تعذّر تسجيل الإجابة. تحقق من الاتصال.";
        gameMessage.style.color = "#ff8290";
    }
}


// انتظار تسجيل دخول اللاعب
authReady
    .then((user) => {
        currentUser = user;
        console.log("Player connected:", user.uid);
    })
    .catch((error) => {
        console.error("Login error:", error);
        roomMessage.textContent = "تعذّر الاتصال. حاول مجددًا.";
    });
// مراقبة قائمة اللاعبين
function listenToRoomPlayers() {
    if (!currentRoomCode) return;

    const playersRef = ref(
        db,
        "rooms/" + currentRoomCode + "/players"
    );

    roomPlayers.style.display = "block";

    onValue(playersRef, (snapshot) => {
        const players = snapshot.val() || {};
        const playerIds = Object.keys(players);

        playersCount.textContent =
            "عدد اللاعبين: " + playerIds.length + " / 8";

        playersList.innerHTML = "";

        playerIds.forEach((uid, index) => {
            const li = document.createElement("li");

            const playerName = players[uid].name || "لاعب " + (index + 1);

li.textContent =
    uid === currentUser.uid
        ? playerName + " (أنت)"
        : playerName;

            playersList.appendChild(li);
        });
    });
}
// مراقبة حالة المباراة
function listenToRoomStatus() {
    if (!currentRoomCode) return;

    const statusRef = ref(db, "rooms/" + currentRoomCode + "/status");
    onValue(statusRef, (snapshot) => {
        const status = snapshot.val();

        if (status === "waiting") {
            matchIsPlaying = false;
            if (welcomeScreen) welcomeScreen.style.display = "flex";
            if (gameScreen) gameScreen.style.display = "none";
            startMatchBtn.style.display = isHost ? "block" : "none";
            nextRoundBtn.style.display = "none";
            endMatchBtn.style.display = "none";
            if (exitRoomBtn) exitRoomBtn.style.display = "block";
            if (exitRoomGameBtn) exitRoomGameBtn.style.display = "none";
        } else if (status === "playing") {
            matchIsPlaying = true;
            if (exitRoomBtn) exitRoomBtn.style.display = "none";
            if (exitRoomGameBtn) exitRoomGameBtn.style.display = "block";
            if (welcomeScreen) welcomeScreen.style.display = "none";
            if (gameScreen) gameScreen.style.display = "block";
            startMatchBtn.style.display = "none";
            nextRoundBtn.style.display = isHost ? "block" : "none";
            endMatchBtn.style.display = isHost ? "block" : "none";
        } else if (status === "ended") {
            matchIsPlaying = false;
            if (exitRoomBtn) exitRoomBtn.style.display = "block";
            if (exitRoomGameBtn) exitRoomGameBtn.style.display = "none";
            roomMessage.textContent = "انتهت المباراة! 🏁";
            startMatchBtn.style.display = "none";
            nextRoundBtn.style.display = "none";
            endMatchBtn.style.display = "none";
            const panel = document.getElementById("multiplayerResults");
            const homeButton = document.getElementById("multiplayerHomeBtn");
            const rounds = Object.keys(roundHistoryCache).map(Number).filter(Number.isInteger).sort((a, b) => a - b);
            if (rounds.length) {
                renderMultiplayerStandings(rounds[rounds.length - 1], rounds);
            } else if (panel) {
                panel.style.display = "block";
            }
            if (homeButton) homeButton.style.display = "block";
        }
    });
}
        // إنشاء رمز عشوائي للغرفة
function generateRoomCode() {
    const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";

    for (let i = 0; i < 6; i++) {
        code += characters.charAt(
            Math.floor(Math.random() * characters.length)
        );
    }

    return code;
}
// إنشاء غرفة جديدة
async function createRoom() {
    try {
        roomMessage.textContent = "جارٍ إنشاء الغرفة...";

        await authReady;

        let created = false;

        for (let i = 0; i < 5; i++) {
            const code = generateRoomCode();
            const roomRef = ref(db, "rooms/" + code);

            const result = await runTransaction(roomRef, (room) => {
                if (room !== null) {
                    return;
                }

                return {
                    hostUid: currentUser.uid,
                    status: "waiting",
                    createdAt: Date.now(),
                    players: {
    [currentUser.uid]: {
        uid: currentUser.uid,
        name: playerNameInput.value.trim() || "لاعب",
        score: 0,
        mistakes: 0,
        hintsUsed: 0
    }
                    }
                };
            });

            if (result.committed) {
                currentRoomCode = code;
                isHost = true;
                startMatchBtn.style.display = "block";
                if (exitRoomBtn) exitRoomBtn.style.display = "block";
                listenToRoomPlayers();
                listenToRoomStatus();
                listenToCurrentQuestion();
                listenToCurrentRoundAnswers();
                listenToRoundHistory();
                window.setMultiplayerMode(true);
                window.setMultiplayerAnswerHandler(submitMultiplayerAnswer);
                roomMessage.textContent =
                    "رمز غرفتك: " + code;
                created = true;
                break;
            }
        }

        if (!created) {
            roomMessage.textContent =
                "تعذّر إنشاء الغرفة. حاول مجددًا.";
        }

    } catch (error) {
        console.error(error);
        roomMessage.textContent =
            "تعذّر إنشاء الغرفة حاليًا.";
    }
}
// تشغيل إنشاء الغرفة عند الضغط على الزر
createRoomBtn.addEventListener("click", createRoom);
// بدء المباراة
async function startMatch() {
    if (!isHost || !currentRoomCode) return;

    roomMessage.textContent = "جارٍ بدء المباراة...";

    try {
        const roomRef = ref(db, "rooms/" + currentRoomCode);
const statusRef = ref(db, "rooms/" + currentRoomCode + "/status");
const statusSnapshot = await get(statusRef);

const hostRef = ref(db, "rooms/" + currentRoomCode + "/hostUid");
const hostSnapshot = await get(hostRef);

if (
    !statusSnapshot.exists() ||
    statusSnapshot.val() !== "waiting" ||
    hostSnapshot.val() !== currentUser.uid
) {
    roomMessage.textContent = "تعذّر بدء المباراة.";
    return;
}

const now = Date.now();

await set(ref(db, "rooms/" + currentRoomCode + "/startedAt"), now);
await set(ref(db, "rooms/" + currentRoomCode + "/roundNumber"), 1);
await set(ref(db, "rooms/" + currentRoomCode + "/roundStartedAt"), now);

if (gameQuestions.length === 0) {
    roomMessage.textContent = "لا توجد أسئلة متاحة.";
    return;
}

const questionIndex = Math.floor(Math.random() * gameQuestions.length);
await set(
    ref(db, "rooms/" + currentRoomCode + "/currentQuestionIndex"),
    questionIndex
);

await set(statusRef, "playing");

roomMessage.textContent = "بدأت المباراة!";
        

        
    } catch (error) {
        console.error(error);
        roomMessage.textContent = "حدث خطأ أثناء بدء المباراة.";
    }
}

startMatchBtn.addEventListener("click", startMatch);
async function nextRound() {
    if (!isHost || !currentRoomCode) return;

    try {
        const statusSnapshot = await get(ref(db, "rooms/" + currentRoomCode + "/status"));
        const hostSnapshot = await get(ref(db, "rooms/" + currentRoomCode + "/hostUid"));

        if (statusSnapshot.val() !== "playing" || hostSnapshot.val() !== currentUser.uid) {
            roomMessage.textContent = "تعذّر الانتقال إلى الجولة التالية.";
            return;
        }

        if (!roundSummaryShown) {
            nextRoundBtn.disabled = true;
            await saveCurrentRoundResults();
            roundSummaryShown = true;
            nextRoundBtn.textContent = "بدء الجولة التالية ⏭️";
            nextRoundBtn.disabled = false;
            return;
        }

        nextRoundBtn.disabled = true;
        const roundNumberRef = ref(db, "rooms/" + currentRoomCode + "/roundNumber");
        const result = await runTransaction(roundNumberRef, number => (number || 0) + 1);

        if (!result.committed) {
            throw new Error("تعذّر تحديث رقم الجولة");
        }

        const oldAnswersSnapshot = await get(ref(db, "rooms/" + currentRoomCode + "/currentRoundAnswers"));
        const oldAnswers = oldAnswersSnapshot.val() || {};
        await Promise.all(Object.keys(oldAnswers).map(answerIndex =>
            remove(ref(db, "rooms/" + currentRoomCode + "/currentRoundAnswers/" + answerIndex))
        ));
        await set(ref(db, "rooms/" + currentRoomCode + "/roundStartedAt"), Date.now());

        const questionIndex = Math.floor(Math.random() * gameQuestions.length);
        await set(ref(db, "rooms/" + currentRoomCode + "/currentQuestionIndex"), questionIndex);

        roundSummaryShown = false;
        nextRoundBtn.textContent = "عرض نتائج الجولة 📊";
        const panel = document.getElementById("multiplayerResults");
        if (panel) panel.style.display = "none";
        nextRoundBtn.disabled = false;
    } catch (error) {
        console.error("Next round error:", error);
        roomMessage.textContent = "تعذّر حفظ النتائج أو بدء الجولة التالية.";
        nextRoundBtn.disabled = false;
    }
}
nextRoundBtn.addEventListener("click", nextRound);
async function endMatch() {
    if (!isHost || !currentRoomCode) return;

    try {
        const statusSnapshot = await get(ref(db, "rooms/" + currentRoomCode + "/status"));
        const hostSnapshot = await get(ref(db, "rooms/" + currentRoomCode + "/hostUid"));

        if (statusSnapshot.val() !== "playing" || hostSnapshot.val() !== currentUser.uid) {
            roomMessage.textContent = "تعذّر إنهاء المباراة.";
            return;
        }

        endMatchBtn.disabled = true;
        await saveCurrentRoundResults();
        await set(ref(db, "rooms/" + currentRoomCode + "/status"), "ended");
        await set(ref(db, "rooms/" + currentRoomCode + "/endedAt"), Date.now());
        roomMessage.textContent = "انتهت المباراة! 🏁";
    } catch (error) {
        console.error("End match error:", error);
        roomMessage.textContent = "تعذّر حفظ النتائج النهائية.";
        endMatchBtn.disabled = false;
    }
}
endMatchBtn.addEventListener("click", endMatch);

async function returnToRoom() {
    if (!currentRoomCode) return;

    if (isHost) {
        try {
            const roomPath = "rooms/" + currentRoomCode;
            const historySnapshot = await get(ref(db, roomPath + "/roundHistory"));
            const history = historySnapshot.val() || {};
            await Promise.all(Object.keys(history).map(round =>
                remove(ref(db, roomPath + "/roundHistory/" + round))
            ));
            await remove(ref(db, roomPath + "/currentRoundAnswers"));
            await set(ref(db, roomPath + "/roundNumber"), 1);
            await set(ref(db, roomPath + "/status"), "waiting");
            roundHistoryCache = {};
            roundSummaryShown = false;
            nextRoundBtn.textContent = "عرض نتائج الجولة 📊";
            roomMessage.textContent = "الغرفة جاهزة لمباراة جديدة.";
        } catch (error) {
            console.error("Return to room error:", error);
            roomMessage.textContent = "تعذّر تجهيز الغرفة لمباراة جديدة.";
            return;
        }
    } else {
        roomMessage.textContent = "عدت إلى الغرفة. بانتظار المضيف لبدء مباراة جديدة.";
        if (welcomeScreen) welcomeScreen.style.display = "flex";
        if (gameScreen) gameScreen.style.display = "none";
        if (exitRoomBtn) exitRoomBtn.style.display = "block";
        if (startMatchBtn) startMatchBtn.style.display = "none";
    }

    const panel = document.getElementById("multiplayerResults");
    if (panel) panel.style.display = "none";
}

async function leaveRoom() {
    if (!currentRoomCode || !currentUser) return;
    const code = currentRoomCode;
    try {
        if (isHost) {
            const statusRef = ref(db, "rooms/" + code + "/status");
            const statusSnapshot = await get(statusRef);
            if (statusSnapshot.val() !== "ended") {
                await set(statusRef, "ended");
            }
        }

        await remove(ref(db, "rooms/" + code + "/players/" + currentUser.uid));
        window.location.reload();
    } catch (error) {
        console.error("Leave room error:", error);
        roomMessage.textContent = "تعذّر الخروج من الغرفة. تحقق من اتصالك.";
    }
}

const multiplayerHomeBtn = document.getElementById("multiplayerHomeBtn");
if (multiplayerHomeBtn) {
    multiplayerHomeBtn.addEventListener("click", returnToRoom);
}
if (exitRoomBtn) exitRoomBtn.addEventListener("click", leaveRoom);
if (exitRoomGameBtn) exitRoomGameBtn.addEventListener("click", leaveRoom);
// الانضمام إلى غرفة موجودة
async function joinRoom() {
    try {
        const code = roomCodeInput.value.trim().toUpperCase();

        if (!code) {
            roomMessage.textContent = "أدخل رمز الغرفة أولًا.";
            return;
        }

        if (code.length !== 6) {
            roomMessage.textContent = "رمز الغرفة يجب أن يتكون من 6 خانات.";
            return;
        }

        roomMessage.textContent = "جارٍ البحث عن الغرفة...";

        await authReady;
const statusRef = ref(db, "rooms/" + code + "/status");
const statusSnapshot = await get(statusRef);

if (!statusSnapshot.exists() || statusSnapshot.val() !== "waiting") {
    roomMessage.textContent = "الغرفة غير موجودة أو بدأت اللعبة.";
    return;
}

const playerRef = ref(db, "rooms/" + code + "/players/" + currentUser.uid);
const playerSnapshot = await get(playerRef);

if (playerSnapshot.exists()) {
    roomMessage.textContent = "أنت منضم إلى هذه الغرفة بالفعل.";
    return;
}

const hostRef = ref(db, "rooms/" + code + "/hostUid");
const hostSnapshot = await get(hostRef);

if (!hostSnapshot.exists()) {
    roomMessage.textContent = "الغرفة غير موجودة.";
    return;
}

await set(playerRef, {
    uid: currentUser.uid,
    name: playerNameInput.value.trim() || "لاعب",
    score: 0,
    mistakes: 0,
    hintsUsed: 0
});
        

        

        currentRoomCode = code;
        isHost = hostSnapshot.val() === currentUser.uid;
        startMatchBtn.style.display = isHost ? "block" : "none";
        if (exitRoomBtn) exitRoomBtn.style.display = "block";
listenToRoomPlayers();
        listenToRoomStatus();
        listenToCurrentQuestion();
        listenToCurrentRoundAnswers();
        listenToRoundHistory();
        window.setMultiplayerMode(true);
        window.setMultiplayerAnswerHandler(submitMultiplayerAnswer);
        roomMessage.textContent =
            "انضممت إلى الغرفة بنجاح: " + code;

    } catch (error) {
        console.error(error);
        roomMessage.textContent =
            "تعذّر الانضمام إلى الغرفة.";
    }
}

// ربط زر الانضمام بالوظيفة
joinRoomBtn.addEventListener("click", joinRoom);
