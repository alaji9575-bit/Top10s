import { initializeApp } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    updateProfile,
    setPersistence,
    browserLocalPersistence,
    signOut
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js";

import {
    getDatabase,
    ref,
    set,
    get,
    runTransaction,
    onValue,
    remove,
    onDisconnect
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-database.js";
const gameQuestions = window.gameQuestions || [];
// Firebase rules must permit question indexes 0 through 21.
const multiplayerQuestionLimit = Math.min(gameQuestions.length, 22);
const multiplayerMatchQuestionCount = 5;
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

let currentUser = null;

async function usernameToEmail(username) {
    const normalized = String(username).trim().normalize("NFC").toLowerCase();
    const bytes = new TextEncoder().encode(normalized);
    let binary = "";
    bytes.forEach(byte => { binary += String.fromCharCode(byte); });
    const encoded = btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
    return "u" + encoded + "@accounts.top10s.com";
}

function validateUsername(username) {
    const value = String(username || "").trim().normalize("NFC");
    if (value.length < 3 || value.length > 15) {
        return "اسم المستخدم يجب أن يتكون من 3 إلى 15 خانة.";
    }
    if (!/^[\p{L}\p{N}_]+$/u.test(value)) {
        return "استخدم الحروف العربية أو الإنجليزية أو الأرقام أو الشرطة السفلية فقط.";
    }
    return "";
}

function showAuthForm(mode) {
    document.getElementById("loginForm").style.display = mode === "login" ? "flex" : "none";
    document.getElementById("registerForm").style.display = mode === "register" ? "flex" : "none";
    document.getElementById("authMessage").textContent = "";
}

function authErrorMessage(error) {
    const code = error && error.code ? error.code : "";
    const messages = {
        "auth/invalid-credential": "اسم المستخدم أو كلمة المرور غير صحيحة.",
        "auth/user-not-found": "لا يوجد حساب بهذا الاسم.",
        "auth/wrong-password": "كلمة المرور غير صحيحة.",
        "auth/email-already-in-use": "اسم المستخدم مستخدم بالفعل. اختر اسماً آخر.",
        "auth/weak-password": "كلمة المرور ضعيفة. استخدم 6 أحرف على الأقل.",
        "auth/too-many-requests": "محاولات كثيرة. انتظر قليلاً ثم حاول مجدداً.",
        "auth/network-request-failed": "تعذّر الاتصال بالإنترنت. تحقق من اتصالك.",
        "auth/invalid-email": "تعذّر استخدام اسم المستخدم هذا. جرّب اسماً آخر."
    };
    return messages[code] || "حدث خطأ. تحقق من البيانات وحاول مجدداً.";
}

const authScreen = document.getElementById("authScreen");
const appShell = document.getElementById("appShell");
const authMessage = document.getElementById("authMessage");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const playerNameInput = document.getElementById("playerNameInput");

document.getElementById("showRegisterBtn").addEventListener("click", () => showAuthForm("register"));
document.getElementById("showLoginBtn").addEventListener("click", () => showAuthForm("login"));

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value;
    const validation = validateUsername(username);
    if (validation) { authMessage.textContent = validation; return; }

    const button = document.getElementById("loginBtn");
    button.disabled = true;
    authMessage.textContent = "جارٍ تسجيل الدخول...";
    try {
        await setPersistence(auth, browserLocalPersistence);
        await signInWithEmailAndPassword(auth, await usernameToEmail(username), password);
        authMessage.textContent = "";
    } catch (error) {
        console.error("Sign-in error:", error);
        authMessage.textContent = authErrorMessage(error);
    } finally {
        button.disabled = false;
    }
});

registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const username = document.getElementById("registerUsername").value.trim().normalize("NFC");
    const password = document.getElementById("registerPassword").value;
    const confirmation = document.getElementById("registerPasswordConfirm").value;
    const validation = validateUsername(username);
    if (validation) { authMessage.textContent = validation; return; }
    if (password.length < 6) { authMessage.textContent = "كلمة المرور يجب ألا تقل عن 6 أحرف."; return; }
    if (password !== confirmation) { authMessage.textContent = "كلمتا المرور غير متطابقتين."; return; }

    const button = document.getElementById("registerBtn");
    button.disabled = true;
    authMessage.textContent = "جارٍ إنشاء الحساب...";
    try {
        await setPersistence(auth, browserLocalPersistence);
        const credential = await createUserWithEmailAndPassword(
            auth,
            await usernameToEmail(username),
            password
        );
        await updateProfile(credential.user, { displayName: username });
        if (playerNameInput) playerNameInput.value = username;
        authMessage.textContent = "";
    } catch (error) {
        console.error("Account creation error:", error);
        authMessage.textContent = authErrorMessage(error);
    } finally {
        button.disabled = false;
    }
});

onAuthStateChanged(auth, async (user) => {
    // Old anonymous sessions are not migrated into the new account system.
    if (user && user.isAnonymous) {
        try { await signOut(auth); } catch (error) { console.error("Anonymous sign-out error:", error); }
        return;
    }

    currentUser = user || null;
    if (currentUser) {
        if (playerNameInput) {
            playerNameInput.value = currentUser.displayName || "";
            playerNameInput.readOnly = true;
        }
        authScreen.style.display = "none";
        appShell.style.display = "block";
    } else {
        appShell.style.display = "none";
        authScreen.style.display = "flex";
    }
});

const logoutButton = document.getElementById("logoutBtn");
if (logoutButton) {
    logoutButton.addEventListener("click", async () => {
        logoutButton.disabled = true;
        try {
            if (currentRoomCode && currentUser) {
                const roomPath = "rooms/" + currentRoomCode;
                if (isHost) await set(ref(db, roomPath + "/status"), "ended");
                await Promise.all([
                    remove(ref(db, roomPath + "/players/" + currentUser.uid)),
                    remove(ref(db, roomPath + "/presence/" + currentUser.uid)),
                    remove(ref(db, roomPath + "/readiness/" + currentUser.uid))
                ]);
            }
            await signOut(auth);
            currentRoomCode = null;
        } catch (error) {
            console.error("Sign-out error:", error);
            authMessage.textContent = "تعذّر تسجيل الخروج بشكل كامل. حاول مجدداً.";
        } finally {
            logoutButton.disabled = false;
        }
    });
}



// صفحة الترتيب العام للاعبين
const leaderboardScreen = document.getElementById("leaderboardScreen");
const openLeaderboardBtn = document.getElementById("openLeaderboardBtn");
const closeLeaderboardBtn = document.getElementById("closeLeaderboardBtn");

async function showGlobalLeaderboard() {
    if (!currentUser || !leaderboardScreen) return;
    const welcome = document.querySelector(".welcome");
    const game = document.getElementById("game");
    if (welcome) welcome.style.display = "none";
    if (game) game.style.display = "none";
    const personal = document.getElementById("personalStatsScreen");
    if (personal) personal.style.display = "none";
    leaderboardScreen.style.display = "block";

    const message = document.getElementById("leaderboardMessage");
    const list = document.getElementById("leaderboardList");
    message.textContent = "جارٍ تحميل الترتيب العام...";
    list.replaceChildren();

    try {
        const snapshot = await get(ref(db, "playerStats"));
        const allStats = snapshot.val() || {};
        const players = Object.entries(allStats).map(([uid, stats]) => {
            const recent = Array.isArray(stats.recentMatches) ? stats.recentMatches : [];
            const latest = recent[0] || {};
            return {
                uid,
                name: latest.playerName || "لاعب",
                matches: Number(stats.matches) || 0,
                wins: Number(stats.wins) || 0,
                points: Number(stats.totalPoints) || 0,
                correctAnswers: Number(stats.correctAnswers) || 0
            };
        }).filter(player => player.matches > 0);

        players.sort((a, b) =>
            b.points - a.points ||
            b.wins - a.wins ||
            b.correctAnswers - a.correctAnswers ||
            a.name.localeCompare(b.name, "ar")
        );

        if (!players.length) {
            message.textContent = "لا توجد إحصائيات مسجلة بعد. أكملوا مباريات جماعية لتظهروا هنا.";
            return;
        }

        players.forEach((player, index) => {
            const item = document.createElement("li");
            const rank = document.createElement("span");
            rank.className = "leaderboard-rank";
            rank.textContent = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : String(index + 1);

            const details = document.createElement("div");
            details.className = "leaderboard-player";
            const name = document.createElement("span");
            name.className = "leaderboard-player-name";
            name.textContent = player.name + (player.uid === currentUser.uid ? " (أنت)" : "");
            const sub = document.createElement("span");
            sub.className = "leaderboard-player-details";
            sub.textContent = player.matches.toLocaleString("ar") + " مباراة • " +
                player.wins.toLocaleString("ar") + " فوز • " +
                player.correctAnswers.toLocaleString("ar") + " إجابة صحيحة";
            details.append(name, sub);

            const points = document.createElement("span");
            points.className = "leaderboard-points";
            points.textContent = player.points.toLocaleString("ar") + " نقطة";
            item.append(rank, details, points);
            list.appendChild(item);
        });
        message.textContent = "عدد اللاعبين في الترتيب: " + players.length.toLocaleString("ar");
    } catch (error) {
        console.error("Global leaderboard load error:", error);
        message.textContent = "تعذّر تحميل الترتيب. تحقق من اتصالك بالإنترنت وقواعد Firebase.";
    }
}

function closeGlobalLeaderboard() {
    if (leaderboardScreen) leaderboardScreen.style.display = "none";
    const game = document.getElementById("game");
    if (game) {
        game.style.display = "block";
        game.classList.add("multiplayer-results-active");
    }
}

if (openLeaderboardBtn) openLeaderboardBtn.addEventListener("click", showGlobalLeaderboard);
if (closeLeaderboardBtn) closeLeaderboardBtn.addEventListener("click", closeGlobalLeaderboard);

// صفحة الإحصائيات الشخصية
const openStatsBtn = document.getElementById("openStatsBtn");
const closeStatsBtn = document.getElementById("closeStatsBtn");
const personalStatsScreen = document.getElementById("personalStatsScreen");

function formatStatsDate(timestamp) {
    const date = new Date(Number(timestamp) || Date.now());
    return date.toLocaleDateString("ar-BH", { year: "numeric", month: "short", day: "numeric" });
}

async function showPersonalStats() {
    if (!currentUser || !personalStatsScreen) return;

    const welcome = document.querySelector(".welcome");
    const game = document.getElementById("game");
    if (welcome) welcome.style.display = "none";
    if (game) game.style.display = "none";
    personalStatsScreen.style.display = "block";

    const message = document.getElementById("personalStatsMessage");
    const username = document.getElementById("personalStatsUsername");
    const recentList = document.getElementById("recentMatchesList");
    const emptyMessage = document.getElementById("recentMatchesEmpty");
    message.textContent = "جارٍ تحميل إحصائياتك...";
    username.textContent = "@" + (currentUser.displayName || "لاعب");
    recentList.replaceChildren();
    emptyMessage.style.display = "none";

    try {
        const snapshot = await get(ref(db, "playerStats/" + currentUser.uid));
        const stats = snapshot.val() || {};
        const matches = Number(stats.matches) || 0;
        const wins = Number(stats.wins) || 0;
        document.getElementById("statMatches").textContent = matches.toLocaleString("ar");
        document.getElementById("statWins").textContent = wins.toLocaleString("ar");
        document.getElementById("statTotalPoints").textContent = (Number(stats.totalPoints) || 0).toLocaleString("ar");
        document.getElementById("statCorrectAnswers").textContent = (Number(stats.correctAnswers) || 0).toLocaleString("ar");
        document.getElementById("statWinRate").textContent = (matches ? Math.round((wins / matches) * 100) : 0).toLocaleString("ar") + "٪";

        const recent = Array.isArray(stats.recentMatches) ? stats.recentMatches : [];
        if (!recent.length) {
            emptyMessage.style.display = "block";
        } else {
            recent.slice(0, 10).forEach(match => {
                const item = document.createElement("li");
                const main = document.createElement("div");
                main.className = "recent-match-main";
                const title = document.createElement("span");
                title.className = "recent-match-title";
                title.textContent = "غرفة " + (match.roomCode || "—");
                const date = document.createElement("span");
                date.className = "recent-match-date";
                date.textContent = formatStatsDate(match.date) + " • " + (Number(match.correctAnswers) || 0).toLocaleString("ar") + " إجابة صحيحة";
                const result = document.createElement("span");
                result.className = "recent-match-result";
                result.textContent = (match.won ? "فوز 🏆" : "المركز " + (Number(match.rank) || "—")) + " · " + (Number(match.points) || 0).toLocaleString("ar") + " نقطة";
                main.append(title, date);
                item.append(main, result);
                recentList.appendChild(item);
            });
        }
        message.textContent = matches ? "تم تحديث إحصائياتك." : "ستظهر إحصائياتك هنا بعد إكمال أول مباراة جماعية.";
    } catch (error) {
        console.error("Personal stats load error:", error);
        message.textContent = "تعذّر تحميل الإحصائيات. تحقق من اتصالك بالإنترنت وقواعد Firebase.";
    }
}

function closePersonalStats() {
    if (personalStatsScreen) personalStatsScreen.style.display = "none";
    const welcome = document.querySelector(".welcome");
    if (welcome) welcome.style.display = "block";
}

if (openStatsBtn) openStatsBtn.addEventListener("click", showPersonalStats);
if (closeStatsBtn) closeStatsBtn.addEventListener("click", closePersonalStats);

console.log("Firebase multiplayer initialized");
// عناصر واجهة اللعب الجماعي
const createRoomBtn = document.getElementById("createRoomBtn");
const joinRoomBtn = document.getElementById("joinRoomBtn");
const startMatchBtn = document.getElementById("startMatchBtn");
const readyBtn = document.getElementById("readyBtn");

const exitRoomBtn = document.getElementById("exitRoomBtn");
const exitRoomGameBtn = document.getElementById("exitRoomGameBtn");
const roomCodeInput = document.getElementById("roomCodeInput");

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
    if (openLeaderboardBtn) openLeaderboardBtn.style.display = "none";
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

        // Lock answer submission for every player as soon as this round is saved.
        if (currentRoundNumber > 0 && roundHistoryCache[currentRoundNumber]) {
            roundTimeExpired = true;
        }

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
    if (homeButton) homeButton.style.display = isFinal ? "block" : "none";
    if (openLeaderboardBtn) openLeaderboardBtn.style.display = isFinal ? "block" : "none";
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
            points: 0,
            correctAnswers: 0
        };
    });

    Object.values(answers).forEach(record => {
        if (record && record.uid && scores[record.uid]) {
            scores[record.uid].points += Number(record.points) || 0;
            scores[record.uid].correctAnswers += 1;
        }
    });

    await set(historyRef, {
        scores,
        completedAt: Date.now(),
        questionIndex: Number(questionSnapshot.val())
    });

    return roundNumber;
}

// حفظ إحصائيات اللاعب مرة واحدة فقط عند اكتمال المباراة.
async function saveCompletedMatchStats() {
    if (!currentUser || !currentRoomCode) return;

    const [historySnapshot, playersSnapshot, endedAtSnapshot] = await Promise.all([
        get(ref(db, "rooms/" + currentRoomCode + "/roundHistory")),
        get(ref(db, "rooms/" + currentRoomCode + "/players")),
        get(ref(db, "rooms/" + currentRoomCode + "/endedAt"))
    ]);

    const history = historySnapshot.val() || {};
    const players = playersSnapshot.val() || {};
    const totals = {};

    Object.keys(players).forEach(uid => {
        totals[uid] = {
            name: players[uid].name || "لاعب",
            points: 0,
            correctAnswers: 0
        };
    });

    Object.values(history).forEach(round => {
        const scores = round && round.scores ? round.scores : {};
        Object.keys(scores).forEach(uid => {
            if (!totals[uid]) {
                totals[uid] = {
                    name: scores[uid].name || "لاعب",
                    points: 0,
                    correctAnswers: 0
                };
            }
            totals[uid].points += Number(scores[uid].points) || 0;
            totals[uid].correctAnswers += Number(scores[uid].correctAnswers) || 0;
        });
    });

    const ranking = Object.entries(totals).sort((a, b) =>
        b[1].points - a[1].points || a[1].name.localeCompare(b[1].name, "ar")
    );
    const rank = ranking.findIndex(([uid]) => uid === currentUser.uid) + 1;
    const player = totals[currentUser.uid];
    if (!player || rank < 1) return;

    const matchRecord = {
        roomCode: currentRoomCode,
        date: Number(endedAtSnapshot.val()) || Date.now(),
        playerName: player.name,
        points: player.points,
        correctAnswers: player.correctAnswers,
        rank,
        playerCount: ranking.length,
        won: rank === 1
    };

    const statsRef = ref(db, "playerStats/" + currentUser.uid);
    await runTransaction(statsRef, current => {
        const stats = current || {
            matches: 0,
            wins: 0,
            totalPoints: 0,
            correctAnswers: 0,
            processedMatches: {},
            recentMatches: []
        };

        const matchId = currentRoomCode + "_" + (Number(history[1] && history[1].completedAt) || Number(endedAtSnapshot.val()) || Date.now());
        if (stats.processedMatches && stats.processedMatches[matchId]) {
            return;
        }

        const processedMatches = {
            ...(stats.processedMatches || {}),
            [matchId]: true
        };
        const recentMatches = Array.isArray(stats.recentMatches)
            ? stats.recentMatches.slice()
            : [];

        recentMatches.unshift(matchRecord);

        return {
            matches: (Number(stats.matches) || 0) + 1,
            wins: (Number(stats.wins) || 0) + (matchRecord.won ? 1 : 0),
            totalPoints: (Number(stats.totalPoints) || 0) + matchRecord.points,
            correctAnswers: (Number(stats.correctAnswers) || 0) + matchRecord.correctAnswers,
            processedMatches,
            recentMatches: recentMatches.slice(0, 10)
        };
    });
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
            const latestAnswerSnapshot = await get(answerRef);
            const latestAnswer = latestAnswerSnapshot.val();
            gameMessage.textContent = latestAnswer && latestAnswer.uid === currentUser.uid
                ? "لقد سجلت هذه الإجابة بالفعل."
                : "سبق لاعب آخر إلى هذه الإجابة.";
            gameMessage.style.color = "#ffe18b";
        }
    } catch (error) {
        console.error("Answer submission error:", error);
        gameMessage.textContent = "تعذّر تسجيل الإجابة. تحقق من الاتصال.";
        gameMessage.style.color = "#ff8290";
    }
}


// ينتظر إنشاء جلسة مصادق عليها من شاشة تسجيل الدخول.
console.log("Firebase multiplayer initialized");
// حالة اتصال اللاعبين
let roomPlayersCache = {};
let roomPresenceCache = {};
let roomReadinessCache = {};

function renderRoomPlayers() {
    const playerIds = Object.keys(roomPlayersCache);

    playersCount.textContent =
        "عدد اللاعبين: " + playerIds.length + " / 8";

    playersList.innerHTML = "";

    const allReady = playerIds.length >= 2 &&
        playerIds.every(uid => roomReadinessCache[uid] === true);

    if (startMatchBtn && isHost) {
        startMatchBtn.disabled = !allReady;
        startMatchBtn.textContent = playerIds.length < 2
            ? "بانتظار لاعب آخر..."
            : allReady ? "بدء المباراة 🚀" : "بانتظار استعداد اللاعبين...";
    }

    if (readyBtn && currentUser) {
        const isReady = roomReadinessCache[currentUser.uid] === true;
        readyBtn.textContent = isReady ? "إلغاء الاستعداد ↩" : "أنا جاهز ✓";
        readyBtn.classList.toggle("is-ready", isReady);
        readyBtn.disabled = !currentRoomCode || matchIsPlaying;
    }

    playerIds.forEach((uid, index) => {
        const li = document.createElement("li");
        const playerName = roomPlayersCache[uid].name || "لاعب " + (index + 1);
        const name = document.createElement("span");
        name.className = "player-name";
        name.textContent = uid === currentUser.uid
            ? playerName + " (أنت)"
            : playerName;

        const status = document.createElement("span");
        const connected = roomPresenceCache[uid]?.connected === true;
        status.className = "player-connection-status " +
            (connected ? "is-connected" : "is-disconnected");
        status.textContent = connected ? "متصل" : "غير متصل";

        const readiness = document.createElement("span");
        const isReady = roomReadinessCache[uid] === true;
        readiness.className = "player-readiness-status " +
            (isReady ? "is-ready" : "is-not-ready");
        readiness.textContent = isReady ? "جاهز" : "غير جاهز";

        li.appendChild(name);
        li.appendChild(status);
        li.appendChild(readiness);
        playersList.appendChild(li);
    });
}

function setupPlayerPresence() {
    if (!currentRoomCode || !currentUser) return;

    const connectedRef = ref(db, ".info/connected");
    const presenceRef = ref(
        db,
        "rooms/" + currentRoomCode + "/presence/" + currentUser.uid
    );

    onValue(connectedRef, async (snapshot) => {
        if (snapshot.val() !== true) return;

        try {
            await onDisconnect(presenceRef).set({
                connected: false,
                lastChanged: Date.now()
            });

            await set(presenceRef, {
                connected: true,
                lastChanged: Date.now()
            });
        } catch (error) {
            console.error("Presence update error:", error);
            roomMessage.textContent = "تعذّر تحديث حالة الاتصال.";
        }
    });
}

// مراقبة قائمة اللاعبين وحالات اتصالهم
function listenToRoomPlayers() {
    if (!currentRoomCode) return;

    const playersRef = ref(db, "rooms/" + currentRoomCode + "/players");
    const presenceRef = ref(db, "rooms/" + currentRoomCode + "/presence");
    const readinessRef = ref(db, "rooms/" + currentRoomCode + "/readiness");

    roomPlayers.style.display = "block";
    setupPlayerPresence();

    onValue(playersRef, (snapshot) => {
        roomPlayersCache = snapshot.val() || {};
        renderRoomPlayers();
    });

    onValue(
        presenceRef,
        (snapshot) => {
            roomPresenceCache = snapshot.val() || {};
            renderRoomPlayers();
        },
        (error) => {
            console.error("Room presence listener error:", error);
            roomMessage.textContent = "تعذّر استقبال حالات اتصال اللاعبين: " + error.message;
        }
    );

    onValue(readinessRef, (snapshot) => {
        roomReadinessCache = snapshot.val() || {};
        renderRoomPlayers();
    }, (error) => {
        console.error("Room readiness listener error:", error);
        roomMessage.textContent = "تعذّر تحميل حالات الاستعداد: " + error.message;
    });
}

async function togglePlayerReady() {
    if (!currentRoomCode || !currentUser || matchIsPlaying) return;
    const readyRef = ref(db, "rooms/" + currentRoomCode + "/readiness/" + currentUser.uid);
    const nextReady = roomReadinessCache[currentUser.uid] !== true;
    try {
        await set(readyRef, nextReady);
        roomMessage.textContent = "رمز الغرفة: " + currentRoomCode + " — " + (nextReady ? "تم تسجيل استعدادك." : "تم إلغاء استعدادك.");
    } catch (error) {
        console.error("Readiness update error:", error);
        roomMessage.textContent = "تعذّر تحديث الاستعداد. تحقق من قواعد Firebase.";
    }
}

if (readyBtn) readyBtn.addEventListener("click", togglePlayerReady);
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
        } else if (status === "ended") {
            matchIsPlaying = false;
            saveCompletedMatchStats().catch(error => {
                console.error("Player statistics save error:", error);
            });
            stopRoundTimer();
            roundTimeExpired = true;
            if (exitRoomBtn) exitRoomBtn.style.display = "none";
            if (exitRoomGameBtn) exitRoomGameBtn.style.display = "block";
            roomMessage.textContent = "انتهت المباراة! 🏁";
            startMatchBtn.style.display = "none";
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

        if (!currentUser) throw new Error("يجب تسجيل الدخول أولاً.");

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
        name: currentUser.displayName || "لاعب",
        score: 0,
        mistakes: 0,
        hintsUsed: 0
    }
                    }
                };
            });

            if (result.committed) {
                currentRoomCode = code;
                sharedFoundAnswers = {};
                await set(ref(db, "rooms/" + code + "/readiness/" + currentUser.uid), false);
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
const playersSnapshot = await get(ref(db, "rooms/" + currentRoomCode + "/players"));
const players = playersSnapshot.val() || {};
if (Object.keys(players).length < 2) {
    roomMessage.textContent = "لا يمكن بدء المباراة قبل انضمام لاعب آخر على الأقل.";
    return;
}
const readinessSnapshot = await get(ref(db, "rooms/" + currentRoomCode + "/readiness"));
const readiness = readinessSnapshot.val() || {};
if (!Object.keys(players).every(uid => readiness[uid] === true)) {
    roomMessage.textContent = "لا يمكن بدء المباراة حتى يصبح جميع اللاعبين جاهزين.";
    return;
}

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

if (multiplayerQuestionLimit < multiplayerMatchQuestionCount) {
    roomMessage.textContent = "يجب توفر خمسة أسئلة على الأقل لبدء المباراة.";
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

const existingRoundNumber = await get(ref(db, "rooms/" + currentRoomCode + "/roundNumber"));
if (!existingRoundNumber.exists()) {
    await set(ref(db, "rooms/" + currentRoomCode + "/roundNumber"), 1);
} else if (Number(existingRoundNumber.val()) !== 1) {
    roomMessage.textContent = "تعذّر تهيئة رقم الجولة. أعد الغرفة إلى وضع الانتظار.";
    return;
}
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
async function finishRound() {
    if (!isHost || !currentRoomCode || roundFinishInProgress) return;

    const wasTimeExpired = roundTimeExpired;
    roundFinishInProgress = true;
    roundTimeExpired = true;
    stopRoundTimer();

    try {
        const statusSnapshot = await get(ref(db, "rooms/" + currentRoomCode + "/status"));
        const hostSnapshot = await get(ref(db, "rooms/" + currentRoomCode + "/hostUid"));

        if (statusSnapshot.val() !== "playing" || hostSnapshot.val() !== currentUser.uid) {
            roomMessage.textContent = "تعذّر إنهاء الجولة.";
            roundTimeExpired = wasTimeExpired;
            roundFinishInProgress = false;
            return;
        }

        await saveCurrentRoundResults();
        const roundSnapshot = await get(ref(db, "rooms/" + currentRoomCode + "/roundNumber"));
        const completedRound = Number(roundSnapshot.val()) || 1;
        roomMessage.textContent = "انتهى السؤال. عرض النتائج لمدة خمس ثوانٍ...";
        await new Promise(resolve => setTimeout(resolve, 5000));

        if (completedRound >= multiplayerMatchQuestionCount) {
            await set(ref(db, "rooms/" + currentRoomCode + "/status"), "ended");
            await set(ref(db, "rooms/" + currentRoomCode + "/endedAt"), Date.now());
            roomMessage.textContent = "انتهت المباراة! 🏁";
        } else {
            await continueToNextRound();
        }
    } catch (error) {
        console.error("Round completion error:", error);
        roomMessage.textContent = "تعذّر حفظ نتائج الجولة.";
        roundFinishInProgress = false;
        roundTimeExpired = wasTimeExpired;
        if (matchIsPlaying && latestRoundStartedAt !== null && !wasTimeExpired) {
            startRoundTimer(latestRoundStartedAt);
        }
    } finally {
    }
}

async function continueToNextRound() {
    if (!isHost || !currentRoomCode) return;

    try {
        const statusSnapshot = await get(ref(db, "rooms/" + currentRoomCode + "/status"));
        const hostSnapshot = await get(ref(db, "rooms/" + currentRoomCode + "/hostUid"));

        if (statusSnapshot.val() !== "playing" || hostSnapshot.val() !== currentUser.uid) {
            roomMessage.textContent = "تعذّر الانتقال إلى السؤال التالي.";
            roundFinishInProgress = false;
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
        roomMessage.textContent = "تعذّر بدء السؤال التالي.";
        roundFinishInProgress = false;
    }
}

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

        if (!currentUser) throw new Error("يجب تسجيل الدخول أولاً.");
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
    name: currentUser.displayName || "لاعب",
    score: 0,
    mistakes: 0,
    hintsUsed: 0
});
await set(ref(db, "rooms/" + code + "/readiness/" + currentUser.uid), false);
        

        

        currentRoomCode = code;
        sharedFoundAnswers = {};
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
