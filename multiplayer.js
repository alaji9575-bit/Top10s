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
const roomCodeInput = document.getElementById("roomCodeInput");
const roomMessage = document.getElementById("roomMessage");
// عناصر قائمة اللاعبين
const roomPlayers = document.getElementById("roomPlayers");
const playersCount = document.getElementById("playersCount");
const playersList = document.getElementById("playersList");
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

            li.textContent =
                uid === currentUser.uid
                    ? "أنت (اللاعب " + (index + 1) + ")"
                    : "اللاعب " + (index + 1);

            playersList.appendChild(li);
        });
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
                listenToRoomPlayers();
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

        const roomRef = ref(db, "rooms/" + code);
        const result = await runTransaction(roomRef, (room) => {
            if (!room || room.status !== "waiting") {
                return;
            }

            room.players = room.players || {};

            if (room.players[currentUser.uid]) {
                return room;
            }

            if (Object.keys(room.players).length >= 8) {
                return;
            }

            room.players[currentUser.uid] = {
                uid: currentUser.uid,
                score: 0,
                mistakes: 0,
                hintsUsed: 0
            };

            return room;
        });

        if (!result.committed) {
            roomMessage.textContent =
                "الغرفة غير موجودة أو ممتلئة أو بدأت اللعبة.";
            return;
        }

        currentRoomCode = code;
        isHost = result.snapshot.val().hostUid === currentUser.uid;
listenToRoomPlayers();
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
