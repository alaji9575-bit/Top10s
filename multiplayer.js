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
    onValue
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
const roomCodeInput = document.getElementById("roomCodeInput");
const playerNameInput = document.getElementById("playerNameInput");
const roomMessage = document.getElementById("roomMessage");
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

        const question = gameQuestions[questionIndex];
        roomMessage.textContent = "السؤال الحالي: " + question.question;
    });
}

// بيانات اللاعب والغرفة
let currentUser = null;
let currentRoomCode = null;
let isHost = false;

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

    const statusRef = ref(
        db,
        "rooms/" + currentRoomCode + "/status"
    );

    onValue(statusRef, (snapshot) => {
        const status = snapshot.val();

        if (status === "playing") {
    startMatchBtn.style.display = "none";

    nextRoundBtn.style.display = isHost ? "block" : "none";
    endMatchBtn.style.display = isHost ? "block" : "none";
                } else if (status === "ended") {
            roomMessage.textContent = "انتهت المباراة! 🏁";
            startMatchBtn.style.display = "none";
            nextRoundBtn.style.display = "none";
            endMatchBtn.style.display = "none";
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
                listenToRoomPlayers();
                listenToRoomStatus();
                listenToCurrentQuestion();
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

    const roomRef = ref(db, "rooms/" + currentRoomCode);
const statusRef = ref(db, "rooms/" + currentRoomCode + "/status");
const statusSnapshot = await get(statusRef);

const hostRef = ref(db, "rooms/" + currentRoomCode + "/hostUid");
const hostSnapshot = await get(hostRef);

if (
    !statusSnapshot.exists() ||
    statusSnapshot.val() !== "playing" ||
    hostSnapshot.val() !== currentUser.uid
) {
    roomMessage.textContent = "تعذّر الانتقال إلى الجولة التالية.";
    return;
}

const roundNumberRef = ref(db, "rooms/" + currentRoomCode + "/roundNumber");

const result = await runTransaction(roundNumberRef, (number) => {
    return (number || 0) + 1;
});

if (result.committed) {
    await set(
        ref(db, "rooms/" + currentRoomCode + "/roundStartedAt"),
        Date.now()
    );

    const questionIndex = Math.floor(Math.random() * gameQuestions.length);
    await set(
        ref(db, "rooms/" + currentRoomCode + "/currentQuestionIndex"),
        questionIndex
    );
} else {
    roomMessage.textContent = "تعذّر الانتقال إلى الجولة التالية.";
}
    

    
}
nextRoundBtn.addEventListener("click", nextRound);
async function endMatch() {
    if (!isHost || !currentRoomCode) return;

    const roomRef = ref(db, "rooms/" + currentRoomCode);
const statusRef = ref(db, "rooms/" + currentRoomCode + "/status");
const statusSnapshot = await get(statusRef);

const hostRef = ref(db, "rooms/" + currentRoomCode + "/hostUid");
const hostSnapshot = await get(hostRef);

if (
    !statusSnapshot.exists() ||
    statusSnapshot.val() !== "playing" ||
    hostSnapshot.val() !== currentUser.uid
) {
    roomMessage.textContent = "تعذّر إنهاء المباراة.";
    return;
}

await set(statusRef, "ended");
await set(
    ref(db, "rooms/" + currentRoomCode + "/endedAt"),
    Date.now()
);

roomMessage.textContent = "انتهت المباراة! 🏁";
    

    
}
endMatchBtn.addEventListener("click", endMatch);
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
listenToRoomPlayers();
        listenToRoomStatus();
        listenToCurrentQuestion();
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
