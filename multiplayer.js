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
// Firebase rules currently permit question indexes 0 through 19.
const multiplayerQuestionLimit = Math.min(gameQuestions.length, 20);
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
const roundDurationSettings = document.getElementById("roundDurationSettings");
const roundDurationSelect = document.getElementById("roundDurationSelect");
const roundDurationDisplay = document.getElementById("roundDurationDisplay");
const roundTimer = document.getElementById("roundTimer");

function showRoomView() {
    if (welcomeScreen) welcomeScreen.classList.add("room-active");
    if (roomPlayers) roomPlayers.style.display = "block";
    const soloStartBtn = document.getElementById("startBtn");
    if (soloStartBtn) soloStartBtn.style.display = "none";
    if (playerNameInput) playerNameInput.style.display = "none";
    if (createRoomBtn) createRoomBtn.style.display = "none";
    if (roomCodeInput) roomCodeInput.style.display = "none";
    if (joinRoomBtn) joinRoomBtn.style.display = "none";
}

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

        hideRoundResultsScreen();
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
let currentRoundNumber = 0;
let roundTimerInterval = null;
let latestRoundStartedAt = null;
let roundFinishInProgress = false;
let roundTimeExpired = false;


/*
 * Keep the chosen duration inside the existing numeric roundStartedAt field:
 * the timestamp is rounded to seconds and its final milliseconds store 60/90/120.
 * This reuses the already-authorized Firebase path without broadening database rules.
 */
function encodeRoundStart(timestamp, durationSeconds) {
    const duration = [60, 90, 120].includes(Number(durationSeconds))
        ? Number(durationSeconds)
        : 90;
    return Math.floor(Number(timestamp) / 1000) * 1000 + duration;
}

function getRoundDuration(encodedValue) {
    const marker = Math.round(Number(encodedValue) % 1000);
    return [60, 90, 120].includes(marker) ? marker : 90;
}

function getRoundStartTimestamp(encodedValue) {
    return Math.floor(Number(encodedValue) / 1000) * 1000;
}

function durationText(seconds) {
    if (seconds === 60) return "دقيقة واحدة";
    if (seconds === 120) return "دقيقتان";
    return "دقيقة ونصف";
}

function updateRoundDurationUI(seconds) {
    if (roundDurationSelect) {
        roundDurationSelect.value = String(seconds);
        roundDurationSelect.style.display = isHost ? "block" : "none";
    }
    if (roundDurationDisplay) {
        roundDurationDisplay.textContent = "المدة المحددة: " + durationText(seconds);
    }
}

function stopRoundTimer() {
    if (roundTimerInterval !== null) {
        clearInterval(roundTimerInterval);
        roundTimerInterval = null;
    }
}

function startRoundTimer(encodedValue) {
    if (!matchIsPlaying || !roundTimer || !Number.isFinite(Number(encodedValue))) return;

    stopRoundTimer();
    roundTimeExpired = false;
    const duration = getRoundDuration(encodedValue);
    const deadline = getRoundStartTimestamp(encodedValue) + duration * 1000;
    roundTimer.style.display = "inline-block";

    const tick = () => {
        const remaining = Math.max(0, deadline - Date.now());
        const totalSeconds = Math.ceil(remaining / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        roundTimer.textContent =
            String(minutes).padStart(2, "0") + ":" +
            String(seconds).padStart(2, "0");

        if (remaining <= 0) {
            stopRoundTimer();
            roundTimeExpired = true;
            if (isHost) finishRound(false);
        }
    };

    tick();
    if (!roundTimeExpired) roundTimerInterval = setInterval(tick, 250);
}

function listenToRoundTimer() {
    if (!currentRoomCode) return;

    const startedAtRef = ref(db, "rooms/" + currentRoomCode + "/roundStartedAt");
    onValue(startedAtRef, (snapshot) => {
        if (!snapshot.exists()) {
            const defaultValue = encodeRoundStart(Date.now(), 90);
            latestRoundStartedAt = defaultValue;
            updateRoundDurationUI(90);
            if (isHost) {
                set(startedAtRef, defaultValue).catch(error =>
                    console.error("Default round duration save error:", error)
                );
            }
            return;
        }

        latestRoundStartedAt = Number(snapshot.val());
        updateRoundDurationUI(getRoundDuration(latestRoundStartedAt));
        if (matchIsPlaying) startRoundTimer(latestRoundStartedAt);
    });
}

if (roundDurationSelect) {
    roundDurationSelect.addEventListener("change", async () => {
        if (!isHost || !currentRoomCode || matchIsPlaying) return;
        const duration = Number(roundDurationSelect.value);
        if (![60, 90, 120].includes(duration)) return;

        try {
            const statusSnapshot = await get(ref(db, "rooms/" + currentRoomCode + "/status"));
            if (statusSnapshot.val() !== "waiting") return;
            await set(
                ref(db, "rooms/" + currentRoomCode + "/roundStartedAt"),
                encodeRoundStart(Date.now(), duration)
            );
        } catch (error) {
            console.error("Round duration update error:", error);
            roomMessage.textContent = "تعذّر حفظ مدة الجولة.";
        }
    });
}

async function getUsedQuestionIndexes() {
    const [historySnapshot, currentQuestionSnapshot] = await Promise.all([
        get(ref(db, "rooms/" + currentRoomCode + "/roundHistory")),
        get(ref(db, "rooms/" + currentRoomCode + "/currentQuestionIndex"))
    ]);

    const used = new Set();
    const history = historySnapshot.val() || {};
    Object.values(history).forEach(round => {
        const index = Number(round && round.questionIndex);
        if (Number.isInteger(index) && index >= 0 && index < multiplayerQuestionLimit) {
            used.add(index);
        }
    });

    const currentIndex = Number(currentQuestionSnapshot.val());
    if (Number.isInteger(currentIndex) && currentIndex >= 0 && currentIndex < multiplayerQuestionLimit) {
        used.add(currentIndex);
    }

    return used;
}

function chooseUnusedQuestionIndex(usedIndexes) {
    const available = [];
    for (let index = 0; index < multiplayerQuestionLimit; index++) {
        if (!usedIndexes.has(index)) available.push(index);
    }
    if (available.length === 0) return -1;
    return available[Math.floor(Math.random() * available.length)];
}

function hideRoundResultsScreen() {
    const panel = document.getElementById("multiplayerResults");
    if (panel) panel.style.display = "none";
    if (gameScreen) gameScreen.classList.remove("multiplayer-results-active");
}

const answerInput = document.getElementById("answerInput");
const gameMessage = document.getElementById("message");

function listenToRoundNumber() {
    if (!currentRoomCode) return;
    const roundRef = ref(db, "rooms/" + currentRoomCode + "/roundNumber");
    onValue(roundRef, (snapshot) => {
        currentRoundNumber = Number(snapshot.val()) || 0;
        const completed = roundHistoryCache[currentRoundNumber];
        if (!completed) hideRoundResultsScreen();
    });
}

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
    const continueButton = document.getElementById("continueRoundBtn");
    const homeButton = document.getElementById("multiplayerHomeBtn");
    if (!panel || !title || !list) return;

    const [playersSnapshot, statusSnapshot] = await Promise.all([
        get(ref(db, "rooms/" + currentRoomCode + "/players")),
        get(ref(db, "rooms/" + currentRoomCode + "/status"))
    ]);
    const status = statusSnapshot.val();
    if (latestRound < currentRoundNumber && status !== "ended") return;

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

    const isFinal = status === "ended";
    title.textContent = isFinal
        ? "🏆 الترتيب النهائي للمباراة"
        : "📊 نتائج الجولة " + latestRound;

    list.innerHTML = "";
    ranking.forEach(([uid, player], index) => {
        const row = document.createElement("li");
        const medal = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : (index + 1) + ".";
        row.textContent = medal + " " + player.name +
            " — نقاط الجولة: " + player.roundPoints +
            " — المجموع الكلي: " + player.points;
        list.appendChild(row);
    });

    panel.style.display = "block";
    if (gameScreen) gameScreen.classList.add("multiplayer-results-active");
    if (continueButton) continueButton.style.display = !isFinal && isHost ? "block" : "none";
    if (homeButton) homeButton.style.display = isFinal ? "block" : "none";
}

async function saveCurrentRoundResults() {
    const roundSnapshot = await get(ref(db, "rooms/" + currentRoomCode + "/roundNumber"));
    const roundNumber = Number(roundSnapshot.val()) || 1;
    const historyRef = ref(db, "rooms/" + currentRoomCode + "/roundHistory/" + roundNumber);
    const existing = await get(historyRef);
    if (existing.exists()) return roundNumber;

    const [answersSnapshot, playersSnapshot, questionSnapshot] = await Promise.all([
        get(ref(db, "rooms/" + currentRoomCode + "/currentRoundAnswers")),
        get(ref(db, "rooms/" + currentRoomCode + "/players")),
        get(ref(db, "rooms/" + currentRoomCode + "/currentQuestionIndex"))
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
        completedAt: Date.now(),
        questionIndex: Number(questionSnapshot.val())
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
    if (roundTimeExpired) {
        gameMessage.textContent = "انتهى وقت الجولة. انتظر لوحة النتائج.";
        return;
    }
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
            roundTimeExpired = false;
            stopRoundTimer();
            if (roundTimer) roundTimer.style.display = "none";
            if (roundDurationSettings) roundDurationSettings.style.display = "block";
            updateRoundDurationUI(getRoundDuration(latestRoundStartedAt || 90));
            if (welcomeScreen) welcomeScreen.style.display = "block";
            if (gameScreen) gameScreen.style.display = "none";
            hideRoundResultsScreen();
            startMatchBtn.style.display = isHost ? "block" : "none";
            nextRoundBtn.style.display = "none";
            endMatchBtn.style.display = "none";
            if (exitRoomBtn) exitRoomBtn.style.display = "block";
            if (exitRoomGameBtn) exitRoomGameBtn.style.display = "none";
        } else if (status === "playing") {
            matchIsPlaying = true;
            if (roundDurationSettings) roundDurationSettings.style.display = "none";
            if (latestRoundStartedAt !== null) startRoundTimer(latestRoundStartedAt);
            if (exitRoomBtn) exitRoomBtn.style.display = "none";
            if (exitRoomGameBtn) exitRoomGameBtn.style.display = "block";
            if (welcomeScreen) welcomeScreen.style.display = "none";
            if (gameScreen) gameScreen.style.display = "block";
            startMatchBtn.style.display = "none";
            nextRoundBtn.style.display = isHost ? "block" : "none";
            endMatchBtn.style.display = isHost ? "block" : "none";
        } else if (status === "ended") {
            matchIsPlaying = false;
            stopRoundTimer();
            roundTimeExpired = true;
            if (exitRoomBtn) exitRoomBtn.style.display = "none";
            if (exitRoomGameBtn) exitRoomGameBtn.style.display = "block";
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
                    roundStartedAt: encodeRoundStart(Date.now(), 90),
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
                showRoomView();
                isHost = true;
                startMatchBtn.style.display = "block";
                if (exitRoomBtn) exitRoomBtn.style.display = "block";
                listenToRoomPlayers();
                listenToRoomStatus();
                listenToCurrentQuestion();
                listenToCurrentRoundAnswers();
                listenToRoundNumber();
                listenToRoundHistory();
                listenToRoundTimer();
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

if (multiplayerQuestionLimit === 0) {
    roomMessage.textContent = "لا توجد أسئلة متاحة للعب الجماعي.";
    return;
}

const startedAtRef = ref(db, "rooms/" + currentRoomCode + "/startedAt");
const startedAtSnapshot = await get(startedAtRef);
if (!startedAtSnapshot.exists()) {
    await set(startedAtRef, now);
}
const durationSnapshot = await get(ref(db, "rooms/" + currentRoomCode + "/roundStartedAt"));
const duration = durationSnapshot.exists()
    ? getRoundDuration(durationSnapshot.val())
    : 90;

await set(ref(db, "rooms/" + currentRoomCode + "/roundNumber"), 1);
const questionIndex = chooseUnusedQuestionIndex(new Set());
if (questionIndex < 0) {
    roomMessage.textContent = "لا توجد أسئلة جديدة متاحة.";
    return;
}
await set(ref(db, "rooms/" + currentRoomCode + "/currentQuestionIndex"), questionIndex);
await set(ref(db, "rooms/" + currentRoomCode + "/roundStartedAt"), encodeRoundStart(now, duration));

await set(statusRef, "playing");

roomMessage.textContent = "بدأت المباراة!";
        

        
    } catch (error) {
        console.error(error);
        roomMessage.textContent = "حدث خطأ أثناء بدء المباراة.";
    }
}

startMatchBtn.addEventListener("click", startMatch);
async function finishRound(forceEndMatch = false) {
    if (!isHost || !currentRoomCode || roundFinishInProgress) return;

    roundFinishInProgress = true;
    stopRoundTimer();
    if (nextRoundBtn) nextRoundBtn.disabled = true;
    if (endMatchBtn) endMatchBtn.disabled = true;

    try {
        const statusSnapshot = await get(ref(db, "rooms/" + currentRoomCode + "/status"));
        const hostSnapshot = await get(ref(db, "rooms/" + currentRoomCode + "/hostUid"));

        if (statusSnapshot.val() !== "playing" || hostSnapshot.val() !== currentUser.uid) {
            roomMessage.textContent = "تعذّر إنهاء الجولة.";
            roundFinishInProgress = false;
            return;
        }

        await saveCurrentRoundResults();
        const usedIndexes = await getUsedQuestionIndexes();
        const allQuestionsUsed = usedIndexes.size >= multiplayerQuestionLimit;

        if (forceEndMatch || allQuestionsUsed) {
            await set(ref(db, "rooms/" + currentRoomCode + "/status"), "ended");
            await set(ref(db, "rooms/" + currentRoomCode + "/endedAt"), Date.now());
            roomMessage.textContent = "انتهت المباراة! 🏁";
        }
    } catch (error) {
        console.error("Round completion error:", error);
        roomMessage.textContent = "تعذّر حفظ نتائج الجولة.";
        roundFinishInProgress = false;
        if (matchIsPlaying && latestRoundStartedAt !== null && !roundTimeExpired) {
            startRoundTimer(latestRoundStartedAt);
        }
    } finally {
        if (nextRoundBtn) nextRoundBtn.disabled = false;
        if (endMatchBtn) endMatchBtn.disabled = false;
    }
}

async function nextRound() {
    await finishRound(false);
}
nextRoundBtn.addEventListener("click", nextRound);

async function continueToNextRound() {
    if (!isHost || !currentRoomCode) return;

    const continueButton = document.getElementById("continueRoundBtn");
    if (continueButton) continueButton.disabled = true;

    try {
        const statusSnapshot = await get(ref(db, "rooms/" + currentRoomCode + "/status"));
        const hostSnapshot = await get(ref(db, "rooms/" + currentRoomCode + "/hostUid"));

        if (statusSnapshot.val() !== "playing" || hostSnapshot.val() !== currentUser.uid) {
            roomMessage.textContent = "المضيف وحده يستطيع بدء الجولة التالية.";
            return;
        }

        const usedIndexes = await getUsedQuestionIndexes();
        const questionIndex = chooseUnusedQuestionIndex(usedIndexes);
        if (questionIndex < 0) {
            await set(ref(db, "rooms/" + currentRoomCode + "/status"), "ended");
            await set(ref(db, "rooms/" + currentRoomCode + "/endedAt"), Date.now());
            return;
        }

        const oldAnswersSnapshot = await get(ref(db, "rooms/" + currentRoomCode + "/currentRoundAnswers"));
        const oldAnswers = oldAnswersSnapshot.val() || {};
        await Promise.all(Object.keys(oldAnswers).map(answerIndex =>
            remove(ref(db, "rooms/" + currentRoomCode + "/currentRoundAnswers/" + answerIndex))
        ));

        const duration = getRoundDuration(latestRoundStartedAt || 90);
        const roundNumberRef = ref(db, "rooms/" + currentRoomCode + "/roundNumber");
        const result = await runTransaction(roundNumberRef, number => (Number(number) || 0) + 1);
        if (!result.committed) throw new Error("تعذّر تحديث رقم الجولة");

        await set(ref(db, "rooms/" + currentRoomCode + "/currentQuestionIndex"), questionIndex);
        roundFinishInProgress = false;
        roundTimeExpired = false;
        await set(ref(db, "rooms/" + currentRoomCode + "/roundStartedAt"), encodeRoundStart(Date.now(), duration));
        hideRoundResultsScreen();
    } catch (error) {
        console.error("Continue round error:", error);
        roomMessage.textContent = "تعذّر بدء الجولة التالية.";
    } finally {
        if (continueButton) continueButton.disabled = false;
    }
}

const continueRoundBtn = document.getElementById("continueRoundBtn");
if (continueRoundBtn) continueRoundBtn.addEventListener("click", continueToNextRound);

async function endMatch() {
    await finishRound(true);
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
            const answersSnapshot = await get(ref(db, roomPath + "/currentRoundAnswers"));
            const answers = answersSnapshot.val() || {};
            await Promise.all(Object.keys(answers).map(index =>
                remove(ref(db, roomPath + "/currentRoundAnswers/" + index))
            ));
            await remove(ref(db, roomPath + "/endedAt"));
            await set(ref(db, roomPath + "/roundNumber"), 1);
            await set(ref(db, roomPath + "/status"), "waiting");
            roundHistoryCache = {};
            roundSummaryShown = false;
            roundFinishInProgress = false;
            roundTimeExpired = false;
            stopRoundTimer();
            nextRoundBtn.textContent = "إنهاء الجولة وعرض النتائج 📊";
            roomMessage.textContent = "الغرفة جاهزة لمباراة جديدة.";
        } catch (error) {
            console.error("Return to room error:", error);
            roomMessage.textContent = "تعذّر تجهيز الغرفة لمباراة جديدة.";
            return;
        }
    } else {
        roomMessage.textContent = "عدت إلى الغرفة. بانتظار المضيف لبدء مباراة جديدة.";
        if (welcomeScreen) welcomeScreen.style.display = "block";
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
        listenToRoundNumber();
        listenToRoundHistory();
        listenToRoundTimer();
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
