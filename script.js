const questions = [
    {
        question: "أفضل 10 اختراعات في التاريخ",
      hints: [
    { answerIndex: 2, text: "مصدر أساسي للطاقة يشغّل كثيرًا من الأجهزة في حياتنا." },
    { answerIndex: 5, text: "وسيلة نقل مكّنت الإنسان من السفر عبر الجو." },
    { answerIndex: 8, text: "جهاز إلكتروني يُستخدم لمعالجة البيانات وتشغيل البرامج." }
],
        answers: [
            ["العجلة", ["العجله"]],
            ["الطباعة", ["المطبعة"]],
            ["الكهرباء", ["التيار الكهربائي"]],
            ["الهاتف", ["التلفون"]],
            ["الإنترنت", ["النت", "الشبكة"]],
            ["الطائرة", ["الطياره"]],
            ["السيارة", ["السياره"]],
            ["المصباح الكهربائي", ["المصباح"]],
            ["الحاسوب", ["الكمبيوتر"]],
            ["البنسلين", ["المضاد الحيوي"]]
        ]
    },
    {
        question: "أفضل 10 ألعاب بلايستيشن",hints: [
    { answerIndex: 0, text: "تدور أحداثها في مدينة خيالية مستوحاة من لوس أنجلوس." },
    { answerIndex: 4, text: "تدور أحداثها في أجواء الغرب الأمريكي القديم." },
    { answerIndex: 8, text: "تجري أحداثها في عالم خيالي يُعرف باسم الأراضي الوسطى." }
],
        answers: [
            ["GTA V", ["قراند 5", "قراند", "جراند ثفت أوتو", "Grand Theft Auto", "GTA 5"]],
            ["Minecraft", ["ماينكرافت", "ماين كرافت", "ماين كرافت"]],
["God of War", ["قود اوف وار", "جود اوف وور"]],
["The Last of Us", ["ذا لاست اوف اس", "لاست اوف اس"]],
["Red Dead Redemption 2", ["ريد ديد", "ريد ديد 2", "ريد ديد ريدمبشن"]],
["Spider-Man", ["سبايدرمان", "سبايدر مان", "سبايدرمان"]],
["FIFA", ["فيفا", "افيفا", "EA Sports FC"]],
["Fortnite", ["فورتنايت", "فورت نايت"]],
["Elden Ring", ["الدن رينغ", "إلدن رينغ"]],
["Uncharted", ["انشارتد", "أنشارتد"]]
        ]
    },
    {
        question: "أفضل 10 حيوانات معروفة",
      hints: [
    { answerIndex: 0, text: "يُلقّب بملك الغابة، ويشتهر بقوته وزئيره." },
    { answerIndex: 2, text: "حيوان ضخم يتميز بخرطوم طويل وأذنين كبيرتين." },
    { answerIndex: 5, text: "حيوان ثديي قوي، ويشتهر بحبه للعسل." }
],
        answers: [
            ["الأسد", ["اسد"]],
            ["النمر", ["نمر"]],
            ["الفيل", ["فيل"]],
            ["الزرافة", ["زرافه"]],
            ["الحصان", ["حصان"]],
            ["الدب", ["دب"]],
            ["الذئب", ["ذيب", "ذئب"]],
            ["القرد", ["قرد"]],
            ["الدلفين", ["دلفين"]],
            ["النسر", ["نسر"]]
        ]
    },
     {
        question: "أشهر 10 دول سياحية",
       hints: [
    { answerIndex: 0, text: "تشتهر ببرج إيفل وعاصمتها باريس." },
    { answerIndex: 3, text: "دولة آسيوية تشتهر بزهور الكرز والتكنولوجيا." },
    { answerIndex: 8, text: "تضم أهرامات الجيزة وأحد أطول أنهار العالم." }
],
        answers: [
            ["فرنسا", ["فرنسا"]],
            ["إسبانيا", ["اسبانيا"]],
            ["إيطاليا", ["ايطاليا"]],
            ["اليابان", ["اليابان"]],
            ["الولايات المتحدة", ["أمريكا", "امريكا", "USA"]],
            ["تركيا", ["تركيا"]],
            ["بريطانيا", ["المملكة المتحدة", "انجلترا"]],
            ["اليونان", ["اليونان"]],
            ["مصر", ["مصر"]],
            ["تايلاند", ["تايلند"]]
        ]
     },
     {
        question: "أشهر 10 شخصيات تاريخية",
       hints: [
    { answerIndex: 0, text: "قائد مسلم استعاد القدس من الصليبيين." },
    { answerIndex: 4, text: "عالم فيزيائي وضع نظرية النسبية." },
    { answerIndex: 8, text: "مؤرخ عربي يُعد من رواد علم الاجتماع." }
],
        answers: [
            ["صلاح الدين الأيوبي", ["صلاح الدين", "صلاح الدين الايوبي"]],
            ["نابليون بونابرت", ["نابليون"]],
            ["يوليوس قيصر", ["قيصر"]],
            ["كليوباترا", ["كليوبترا"]],
            ["ألبرت أينشتاين", ["اينشتاين", "البرت اينشتاين"]],
            ["إسحاق نيوتن", ["نيوتن"]],
            ["ليوناردو دافنشي", ["دافنشي"]],
            ["ابن سينا", ["أبو علي سينا"]],
            ["ابن خلدون", ["عبد الرحمن بن خلدون"]],
            ["غاندي", ["المهاتما غاندي"]]
        ]
     },
      {
        question: "أشهر 10 أطعمة عالمية",
        hints: [
    { answerIndex: 0, text: "طبق إيطالي شهير يتكون غالبًا من عجين وصلصة وجبن." },
    { answerIndex: 2, text: "طبق ياباني مشهور يُحضّر غالبًا باستخدام الأرز." },
    { answerIndex: 6, text: "طعام شائع في الشرق الأوسط يُحضّر من الحمص." }
],
        answers: [
            ["البيتزا", ["بيتزا"]],
            ["البرغر", ["همبرغر", "برجر"]],
            ["السوشي", ["سوشي"]],
            ["المعكرونة", ["باستا", "مكرونة"]],
            ["الكباب", ["كباب"]],
            ["التاكو", ["تاكو"]],
            ["الفلافل", ["طعمية"]],
            ["الباييلا", ["باييلا"]],
            ["الفطائر", ["بان كيك", "بانكيك"]],
            ["الكاري", ["كاري"]]
        ]
      },
      {
        question: "أشهر 10 شركات تقنية",
        hints: [
    { answerIndex: 2, text: "شركة تشتهر بمحرك البحث الأشهر عالميًا ونظام أندرويد." },
    { answerIndex: 3, text: "شركة كورية جنوبية تصنع الهواتف الذكية وأجهزة التلفاز." },
    { answerIndex: 8, text: "شركة أمريكية تشتهر بمعالجات الرسوميات المستخدمة في الألعاب والذكاء الاصطناعي." }
],
        answers: [
            ["Apple", ["أبل", "آبل"]],
            ["Microsoft", ["مايكروسوفت"]],
            ["Google", ["جوجل", "غوغل"]],
            ["Samsung", ["سامسونج"]],
            ["Amazon", ["أمازون"]],
            ["Meta", ["ميتا", "فيسبوك"]],
            ["Sony", ["سوني"]],
            ["Intel", ["إنتل", "انتل"]],
            ["Nvidia", ["إنفيديا", "انفيديا"]],
            ["IBM", ["آي بي إم"]]
        ]
      },
      {
        question: "أشهر 10 معالم سياحية في العالم",
        hints: [
    { answerIndex: 0, text: "معلم حديدي شهير يقع في العاصمة الفرنسية باريس." },
    { answerIndex: 2, text: "منشأة تاريخية ضخمة في آسيا بُنيت لأغراض دفاعية." },
    { answerIndex: 7, text: "مدينة أثرية أردنية منحوتة في الصخور الوردية." }
],
        answers: [
            ["برج إيفل", ["ايفل", "برج ايفل"]],
            ["الأهرامات", ["اهرامات الجيزة", "أهرامات الجيزة"]],
            ["سور الصين العظيم", ["سور الصين"]],
            ["تاج محل", ["تاجمحل"]],
            ["تمثال الحرية", ["تمثال الحريه"]],
            ["الكولوسيوم", ["كولوسيوم", "مدرج روما"]],
            ["برج خليفة", ["برج خليفه"]],
            ["البتراء", ["البتراء الأردنية", "البترا"]],
            ["ساعة بيغ بن", ["بيغ بن", "بيج بن"]],
            ["ماتشو بيتشو", ["ماتشو بيتشو"]]
        ]
      },
      {
        question: "أشهر 10 لاعبي كرة قدم",
        hints: [
    { answerIndex: 0, text: "لاعب أرجنتيني فاز بكأس العالم 2022 واشتهر بمهاراته ومراوغاته." },
    { answerIndex: 1, text: "لاعب برتغالي يُلقّب بالدون، واشتهر بقوته التهديفية." },
    { answerIndex: 4, text: "لاعب مصري يُلقّب بالملك المصري، ويلعب في مركز الهجوم." }
],
        answers: [
            ["ليونيل ميسي", ["ميسي"]],
            ["كريستيانو رونالدو", ["رونالدو", "كريستيانو"]],
            ["نيمار", ["نيمار جونيور"]],
            ["كيليان مبابي", ["مبابي"]],
            ["محمد صلاح", ["صلاح"]],
            ["بيليه", ["بيلية"]],
            ["دييغو مارادونا", ["مارادونا"]],
            ["زين الدين زيدان", ["زيدان"]],
            ["رونالدينيو", ["رونالدينيو غاوتشو"]],
            ["ديفيد بيكهام", ["بيكهام"]]
        ]
      },
      {
        question: "أشهر 10 ألعاب عالم مفتوح",
        hints: [
    { answerIndex: 0, text: "لعبة تدور أحداثها في مدينة لوس سانتوس وتضم ثلاثة أبطال." },
    { answerIndex: 1, text: "لعبة تسمح ببناء عوالم كاملة باستخدام المكعبات." },
    { answerIndex: 8, text: "لعبة خيال علمي تدور أحداثها في مدينة نايت سيتي." }
],
        answers: [
            ["GTA V", ["قراند 5", "قراند", "جراند"]],
            ["Minecraft", ["ماينكرافت", "ماين كرافت"]],
            ["Red Dead Redemption 2", ["ريد ديد", "ريد ديد 2"]],
            ["The Witcher 3", ["ذا ويتشر", "ويتشر 3"]],
            ["The Legend of Zelda", ["زيلدا"]],
            ["Skyrim", ["سكاي ريم", "سكيرم"]],
            ["Assassin's Creed", ["اساسنز كريد", "أساسنز كريد"]],
            ["Horizon", ["هورايزون"]],
            ["Cyberpunk 2077", ["سايبربانك"]],
            ["Ghost of Tsushima", ["قوست اوف تسوشيما", "غوست اوف تسوشيما"]]
        ]
      },
      {
        question: "أشهر 10 مخترعين وعلماء",
        hints: [
    { answerIndex: 0, text: "مخترع أمريكي ارتبط اسمه بتطوير المصباح الكهربائي العملي." },
    { answerIndex: 1, text: "مخترع ومهندس اشتهر بأبحاثه في التيار الكهربائي المتناوب." },
    { answerIndex: 4, text: "عالمة اكتشفت عنصرَي البولونيوم والراديوم." }
],
        answers: [
            ["توماس إديسون", ["اديسون"]],
            ["نيكولا تسلا", ["تسلا"]],
            ["ألكسندر غراهام بيل", ["غراهام بيل", "بيل"]],
            ["الأخوان رايت", ["ويلبر وأورفيل رايت"]],
            ["ماري كوري", ["ماري كوري"]],
            ["ابن الهيثم", ["الحسن بن الهيثم"]],
            ["الخوارزمي", ["محمد بن موسى الخوارزمي"]],
            ["ألبرت أينشتاين", ["اينشتاين"]],
            ["إسحاق نيوتن", ["نيوتن"]],
            ["يوهان غوتنبرغ", ["غوتنبرغ", "جوتنبرج"]]
        ]
      },
      {
        question: "أشهر 10 رياضات في العالم",
        hints: [
    { answerIndex: 0, text: "رياضة جماعية يتنافس فيها فريقان ويحاول كل منهما تسجيل الأهداف." },
    { answerIndex: 2, text: "رياضة جماعية تشتهر كثيرًا في الهند وباكستان، وتُستخدم فيها المضارب والكرة." },
    { answerIndex: 9, text: "مجموعة من المنافسات الرياضية تشمل الجري والقفز والرمي." }
],
        answers: [
            ["كرة القدم", ["القدم"]],
            ["كرة السلة", ["السلة"]],
            ["الكريكيت", ["كريكت"]],
            ["التنس", ["كرة المضرب"]],
            ["الكرة الطائرة", ["طائرة"]],
            ["البيسبول", ["بيس بول"]],
            ["الرجبي", ["رغبي"]],
            ["السباحة", ["سباحه"]],
            ["الملاكمة", ["ملاكمه", "بوكسينغ"]],
            ["ألعاب القوى", ["العاب القوي"]]
        ]
      },
      {
        question: "أشهر 10 عواصم في العالم",
        hints: [
    { answerIndex: 0, text: "مدينة أوروبية تشتهر ببرج إيفل." },
    { answerIndex: 2, text: "عاصمة آسيوية تشتهر ببرج طوكيو." },
    { answerIndex: 8, text: "عاصمة الصين، وتضم المدينة المحرمة." }
],
        answers: [
            ["باريس", ["عاصمة فرنسا"]],
            ["لندن", ["عاصمة بريطانيا"]],
            ["طوكيو", ["عاصمة اليابان"]],
            ["القاهرة", ["عاصمة مصر"]],
            ["الرياض", ["عاصمة السعودية"]],
            ["واشنطن", ["واشنطن دي سي", "عاصمة أمريكا"]],
            ["روما", ["عاصمة إيطاليا"]],
            ["مدريد", ["عاصمة إسبانيا"]],
            ["بكين", ["عاصمة الصين"]],
            ["أنقرة", ["عاصمة تركيا"]]
        ]
      },
      {
        question: "أشهر 10 لغات في العالم",
        hints: [
    { answerIndex: 0, text: "لغة عالمية تُستخدم كثيرًا في الأعمال والعلوم والإنترنت." },
    { answerIndex: 3, text: "لغة القرآن الكريم، ويتحدث بها سكان دول كثيرة." },
    { answerIndex: 9, text: "اللغة الرسمية في اليابان." }
],
        answers: [
            ["الإنجليزية", ["انجليزي", "اللغة الإنجليزية"]],
            ["الصينية", ["الصينية المندرينية", "ماندرين"]],
            ["الإسبانية", ["اسباني", "الإسبانية"]],
            ["العربية", ["اللغة العربية"]],
            ["الفرنسية", ["فرنسي", "اللغة الفرنسية"]],
            ["الهندية", ["الهندي"]],
            ["البنغالية", ["بنغالي"]],
            ["البرتغالية", ["برتغالي"]],
            ["الروسية", ["روسي"]],
            ["اليابانية", ["ياباني"]]
        ]
      },
      {
        question: "أشهر 10 حيوانات بحرية",
        hints: [
    { answerIndex: 0, text: "أكبر الحيوانات المعروفة على كوكب الأرض." },
    { answerIndex: 3, text: "حيوان بحري ذكي له ثمانية أذرع." },
    { answerIndex: 9, text: "حيوان ثديي بحري يعيش غالبًا في المناطق الباردة." }
],
        answers: [
            ["الحوت", ["حوت"]],
            ["القرش", ["سمك القرش", "القرش الأبيض"]],
            ["الدلفين", ["دولفين"]],
            ["الأخطبوط", ["اخطبوط"]],
            ["قنديل البحر", ["قنديل"]],
            ["السلحفاة البحرية", ["سلحفاة البحر"]],
            ["فرس البحر", ["حصان البحر"]],
            ["نجم البحر", ["نجمة البحر"]],
            ["الحبار", ["سبيط"]],
            ["الفقمة", ["كلب البحر"]]
        ]
      },
      {
        question: "أشهر 10 شخصيات كرتونية",
        hints: [
    { answerIndex: 0, text: "فأر كرتوني شهير يرتدي قفازات بيضاء وسروالًا أحمر." },
    { answerIndex: 3, text: "إسفنجة بحرية صفراء تعيش في قاع المحيط." },
    { answerIndex: 9, text: "فتى يمتلك ساعة تمكنه من التحول إلى كائنات فضائية." }
],
        answers: [
            ["ميكي ماوس", ["ميكي"]],
            ["توم", ["توم القط"]],
            ["جيري", ["جيري الفأر"]],
            ["سبونج بوب", ["سبونج بوب سكوير بانتس"]],
            ["توم وجيري", ["توم وجيري"]],
            ["سبايدرمان", ["الرجل العنكبوت"]],
            ["باتمان", ["الرجل الوطواط"]],
            ["سوبرمان", ["الرجل الخارق"]],
            ["دورا", ["دورا المستكشفة"]],
            ["بن تن", ["بن 10", "بين تن"]]
        ]
      },
      {
        question: "أشهر 10 أشياء موجودة في الفضاء",
        hints: [
    { answerIndex: 0, text: "نجم يمد الأرض بالضوء والحرارة." },
    { answerIndex: 3, text: "كوكب يُعرف باسم الكوكب الأحمر." },
    { answerIndex: 8, text: "منطقة في الفضاء جاذبيتها قوية جدًا لدرجة أن الضوء لا يستطيع الإفلات منها." }
],
        answers: [
            ["الشمس", ["الشمس"]],
            ["القمر", ["القمر"]],
            ["الأرض", ["كوكب الأرض"]],
            ["المريخ", ["كوكب المريخ"]],
            ["المشتري", ["كوكب المشتري"]],
            ["زحل", ["كوكب زحل"]],
            ["النجوم", ["نجمة"]],
            ["المجرات", ["مجرة"]],
            ["الثقوب السوداء", ["ثقب أسود"]],
            ["المذنبات", ["مذنب"]]
        ]
      },
      {
        question: "أشهر 10 أشياء نستخدمها يوميًا",
        hints: [
    { answerIndex: 0, text: "جهاز نحمله معنا للتواصل والتصفح والتصوير." },
    { answerIndex: 3, text: "أداة نستخدمها لتنظيف الأسنان." },
    { answerIndex: 9, text: "شيء نرتديه في أقدامنا عند المشي." }
],
        answers: [
            ["الهاتف", ["الجوال", "الموبايل"]],
            ["الحاسوب", ["الكمبيوتر", "اللابتوب"]],
            ["الساعة", ["ساعة اليد"]],
            ["الفرشاة", ["فرشاة الأسنان"]],
            ["المفتاح", ["مفاتيح"]],
            ["القلم", ["أقلام"]],
            ["الحقيبة", ["شنطة"]],
            ["الملابس", ["الثياب"]],
            ["الكوب", ["كأس"]],
            ["الحذاء", ["الأحذية"]]
        ]
      },
      {
        question: "أشهر 10 مهن في العالم",
        hints: [
    { answerIndex: 0, text: "يعالج المرضى ويشخّص الأمراض." },
    { answerIndex: 1, text: "ينقل المعرفة للطلاب ويساعدهم على التعلم." },
    { answerIndex: 7, text: "يكتب التعليمات البرمجية لإنشاء التطبيقات والمواقع." }
],
        answers: [
            ["الطبيب", ["دكتور"]],
            ["المعلم", ["مدرس", "أستاذ"]],
            ["المهندس", ["مهندس مدني"]],
            ["الطيار", ["كابتن طائرة"]],
            ["الشرطي", ["رجل الشرطة"]],
            ["المحامي", ["محام"]],
            ["المحاسب", ["محاسب مالي"]],
            ["المبرمج", ["مبرمج حاسوب"]],
            ["الطباخ", ["الشيف", "الطاهي"]],
            ["المزارع", ["فلاح"]]
        ]
      },
      {
        question: "أشهر 10 أشياء تحدث في الطبيعة",
        hints: [
    { answerIndex: 0, text: "سقوط قطرات الماء من السحب إلى الأرض." },
    { answerIndex: 3, text: "اهتزازات مفاجئة تصيب سطح الأرض." },
    { answerIndex: 9, text: "أضواء ملونة تظهر في السماء قرب القطبين." }
],
        answers: [
            ["المطر", ["هطول المطر"]],
            ["البرق", ["الصواعق"]],
            ["الرعد", ["صوت البرق"]],
            ["الزلازل", ["زلزال"]],
            ["البراكين", ["بركان"]],
            ["قوس قزح", ["قوس المطر"]],
            ["الثلوج", ["تساقط الثلج"]],
            ["الرياح", ["الهواء"]],
            ["المد والجزر", ["المد", "الجزر"]],
            ["الشفق القطبي", ["الأضواء القطبية"]]
        ]
      }
];

let currentQuestion = 0;
let mistakes = 0;
let found = [];
let points = 0;
let hintedAnswers = [];
let lastCorrectAnswer = -1;
const game = document.getElementById("game");
const welcome = document.querySelector(".welcome");
const questionTitle = document.getElementById("question");
const answersBox = document.getElementById("answers");
const input = document.getElementById("answerInput");
const message = document.getElementById("message");
const mistakesBox = document.getElementById("mistakes");
const newChallengeBtn = document.getElementById("newChallengeBtn");
const scoreCount = document.getElementById("scoreCount");
const pointsCount = document.getElementById("pointsCount");
const results = document.getElementById("results");
const finalAnswers = document.getElementById("finalAnswers");
const finalPoints = document.getElementById("finalPoints");
const resultMessage = document.getElementById("resultMessage");
const homeBtn = document.getElementById("homeBtn");
const hintBtn = document.getElementById("hintBtn");
const hintsCount = document.getElementById("hintsCount");
newChallengeBtn.addEventListener("click", nextChallenge);
document.getElementById("skipBtn").addEventListener("click", nextChallenge);
document.getElementById("startBtn").addEventListener("click", startGame);
homeBtn.addEventListener("click", goHome);
hintBtn.addEventListener("click", useHint);
document.getElementById("submitBtn").addEventListener("click", submitAnswer);

input.addEventListener("keydown", function(event) {
    if (event.key === "Enter") submitAnswer();
});
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playSound(frequency, duration, type = "sine") {
    if (audioContext.state !== "running") {
    audioContext.resume().catch(console.error);
    }

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = type;
    oscillator.frequency.value = frequency;

    gain.gain.setValueAtTime(0.7, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + duration
    );

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
}
function useHint() {
    const q = questions[currentQuestion];

    if (hintedAnswers.length >= 3) {
        message.textContent = "استخدمت التلميحات الثلاثة!";
        return;
    }

    if (!q.hints || q.hints.length === 0) {
        message.textContent = "لا توجد تلميحات لهذا التحدي حاليًا.";
        return;
    }

    const availableHints = q.hints.filter(hint =>
        !hintedAnswers.includes(hint.answerIndex) &&
        !found.includes(hint.answerIndex)
    );

    if (availableHints.length === 0) {
        message.textContent = "لا توجد تلميحات أخرى متاحة!";
        return;
    }

    const hint = availableHints[0];

    hintedAnswers.push(hint.answerIndex);
hintsCount.textContent = 3 - hintedAnswers.length;
    message.textContent = "💡 تلميح: " + hint.text;
    message.style.color = "#ffe18b";
}
function normalize(text) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[\u064B-\u065F\u0670]/g, "")
        .replace(/ـ/g, "")
        .replace(/[أإآٱ]/g, "ا")
        .replace(/ؤ/g, "و")
        .replace(/ئ/g, "ي")
        .replace(/ة/g, "ه")
        .replace(/ى/g, "ي")
        .replace(/[\s\-_.,!?،؛:()]/g, "");
}
function goHome() {
    game.style.display = "none";
    welcome.style.display = "block";

    results.style.display = "none";
    newChallengeBtn.style.display = "none";

    currentQuestion = 0;
    input.value = "";
    message.textContent = "";
}
function startGame() {
    welcome.style.display = "none";
    game.style.display = "block";
    loadQuestion();
}

function loadQuestion() {
    const q = questions[currentQuestion];
results.style.display = "none";
    questionTitle.textContent = q.question;
    found = [];
  lastCorrectAnswer = -1;
  hintedAnswers = [];
  hintsCount.textContent = 3;
mistakes = 0;
points = 0;

scoreCount.textContent = "0 / 10";
pointsCount.textContent = "0";

message.textContent = "";
input.value = "";

    renderAnswers();
    renderMistakes();
}

function renderAnswers() {
    const q = questions[currentQuestion];

    answersBox.innerHTML = "";

    q.answers.forEach((answer, index) => {
        const slot = document.createElement("div");
        slot.className = "answer-slot";

        if (found.includes(index)) {
    slot.textContent = `${index + 1}. ${answer[0]}`;
    slot.style.background = "#174c38";
    slot.style.color = "#8fffc2";

    if (index === lastCorrectAnswer) {
        slot.classList.add("correct-animation");
    
        }
        } else if (mistakes >= 5) {
            slot.textContent = `${index + 1}. ${answer[0]}`;
            slot.style.background = "#51471d";
            slot.style.color = "#ffe18b";
        } else {
            slot.textContent = `${index + 1}. ـــــــــــــــ`;
        }

        answersBox.appendChild(slot);
    });
}

function renderMistakes() {
    mistakesBox.innerHTML = "";

    for (let i = 0; i < 5; i++) {
        const circle = document.createElement("span");
        circle.textContent = i < mistakes ? "✖" : "○";
        mistakesBox.appendChild(circle);
    }
}

function submitAnswer() {
    const userAnswer = normalize(input.value);

    if (!userAnswer || mistakes >= 5 || found.length === 10) return;

    const q = questions[currentQuestion];

    const answerIndex = q.answers.findIndex((answer, index) => {
        if (found.includes(index)) return false;

        return [answer[0], ...answer[1]]
            .some(item => normalize(item) === userAnswer);
    });

    if (answerIndex !== -1) {
        found.push(answerIndex);
      playSound(880, 0.15);
lastCorrectAnswer = answerIndex;
        const basePoints = 100 - (answerIndex * 10);
const earnedPoints = hintedAnswers.includes(answerIndex) ? basePoints / 2 : basePoints;
points += earnedPoints;

        scoreCount.textContent = `${found.length} / 10`;
        pointsCount.textContent = points;

        message.textContent = "إجابة صحيحة! أحسنت.";
        message.style.color = "#8fffc2";

        if (found.length === 10) {
            message.textContent = "مذهل! اكتشفت الإجابات العشر!";

            finalAnswers.textContent = `${found.length} / 10`;
            finalPoints.textContent = points;
            resultMessage.textContent = "أداء مثالي! لقد اكتشفت جميع الإجابات!";

            results.style.display = "block";
            newChallengeBtn.style.display = "inline-block";
        }
    } else {
        mistakes++;
      playSound(220, 0.25, "triangle");
        message.textContent = "إجابة غير صحيحة، حاول مجدداً.";
        message.style.color = "#ff8290";
    }

    input.value = "";
    renderAnswers();
    renderMistakes();

    if (mistakes >= 5) {
        message.textContent = "انتهت المحاولات! هذه هي الإجابات الصحيحة.";
        message.style.color = "#ffe18b";

        finalAnswers.textContent = `${found.length} / 10`;
        finalPoints.textContent = points;
        resultMessage.textContent = "انتهت المحاولات! حاول مرة أخرى لتحسين نتيجتك.";

        results.style.display = "block";
        newChallengeBtn.style.display = "inline-block";
    }
}
function nextChallenge() {
    currentQuestion = (currentQuestion + 1) % questions.length;
    newChallengeBtn.style.display = "none";
    loadQuestion();
}