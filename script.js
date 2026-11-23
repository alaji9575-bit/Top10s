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
            ["Google", ["جوجل", "غوغل", "قوقل"]],
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
      },
    {
        question: "أشهر 10 مسلسلات تلفزيونية",
        hints: [
            { answerIndex: 0, text: "مسلسل فانتازيا شهير تدور أحداثه حول صراع عائلات على العرش." },
            { answerIndex: 1, text: "مسلسل جريمة ودراما عن مدرس كيمياء يدخل عالم تصنيع المخدرات." },
            { answerIndex: 2, text: "مسلسل كوميدي أمريكي يتابع حياة ستة أصدقاء في نيويورك." }
        ],
        answers: [
            ["Game of Thrones", ["قيم اوف ثرونز", "غيم اوف ثرونز", "جيم اوف ثرونز", "غيم أوف ثرونز", "قيم أوف ثرونز"]],
            ["Breaking Bad", ["بريكنغ باد", "بريكينغ باد", "بريكنج باد", "بريكنق باد"]],
            ["Friends", ["فريندز", "فريندس", "الأصدقاء"]],
            ["Money Heist", ["ماني هايست", "لا كاسا دي بابيل", "لاكاسا دي بابيل"]],
            ["The Walking Dead", ["ذا ووكينغ ديد", "ووكينغ ديد", "الموتى السائرون"]],
            ["Stranger Things", ["سترينجر ثينقز", "سترينجر ثينغز", "أشياء غريبة"]],
            ["Prison Break", ["بريزون بريك", "بريزن بريك", "الهروب من السجن"]],
            ["Sherlock", ["شيرلوك", "شرلوك"]],
            ["Squid Game", ["سكواد غيم", "سكويد غيم", "لعبة الحبار"]],
            ["The Big Bang Theory", ["بيغ بانغ ثيوري", "بيج بانج ثيوري", "نظرية الانفجار العظيم"]]
        ]
    },
    {
        question: "أشهر 10 شركات سيارات",
        hints: [
            { answerIndex: 0, text: "شركة يابانية تشتهر بسيارات مثل كورولا وكامري." },
            { answerIndex: 1, text: "شركة ألمانية فاخرة يرتبط شعارها بنجمة ثلاثية." },
            { answerIndex: 5, text: "شركة إيطالية تشتهر بالسيارات الرياضية ذات الحصان الجامح." }
        ],
        answers: [
            ["Toyota", ["تويوتا"]],
            ["Mercedes-Benz", ["مرسيدس", "مرسيدس بنز", "مرسيدس بينز"]],
            ["BMW", ["بي ام دبليو", "بي إم دبليو", "بي ام"]],
            ["Ford", ["فورد"]],
            ["Honda", ["هوندا"]],
            ["Ferrari", ["فيراري", "فراري"]],
            ["Tesla", ["تسلا"]],
            ["Volkswagen", ["فولكس فاجن", "فولكس واجن", "فولكسفاغن"]],
            ["Hyundai", ["هيونداي", "هونداي"]],
            ["Nissan", ["نيسان"]]
        ]
    },
    {
        question: "أكبر 10 دول من حيث المساحة",
        hints: [
            { answerIndex: 0, text: "أكبر دولة في العالم، وتمتد أراضيها عبر قارتي أوروبا وآسيا." },
            { answerIndex: 1, text: "دولة في أمريكا الشمالية تشتهر بمساحتها الشاسعة وبحيراتها الكثيرة." },
            { answerIndex: 9, text: "أكبر دولة في قارة أفريقيا من حيث المساحة." }
        ],
        answers: [
            ["روسيا", ["روسيه"]],
            ["كندا", ["كنـدا"]],
            ["الصين", ["جمهورية الصين"]],
            ["الولايات المتحدة", ["أمريكا", "امريكا", "الولايات المتحده", "USA", "United States"]],
            ["البرازيل", ["برازيل"]],
            ["أستراليا", ["استراليا", "اوستراليا"]],
            ["الهند", ["هند"]],
            ["الأرجنتين", ["ارجنتين"]],
            ["كازاخستان", ["كازخستان"]],
            ["الجزائر", ["جزاير"]]
        ]
    },
    {
        question: "من هم العشرة المبشرون بالجنة؟",
        hints: [
            { answerIndex: 0, text: "أول الخلفاء الراشدين، وصاحب النبي ﷺ في الهجرة." },
            { answerIndex: 1, text: "ثاني الخلفاء الراشدين، لُقّب بالفاروق." },
            { answerIndex: 9, text: "صحابي لُقّب بأمين هذه الأمة." }
        ],
        answers: [
            ["أبو بكر الصديق", ["أبو بكر", "ابو بكر", "الصديق", "أبو بكر عبد الله بن أبي قحافة"]],
            ["عمر بن الخطاب", ["عمر", "الفاروق", "عمر الفاروق"]],
            ["عثمان بن عفان", ["عثمان", "ذو النورين"]],
            ["علي بن أبي طالب", ["علي", "علي بن ابي طالب", "أبو الحسن"]],
            ["طلحة بن عبيد الله", ["طلحة", "طلحه"]],
            ["الزبير بن العوام", ["الزبير", "زبير بن العوام"]],
            ["عبد الرحمن بن عوف", ["عبدالرحمن بن عوف", "عبد الرحمن", "ابن عوف"]],
            ["سعد بن أبي وقاص", ["سعد", "سعد بن ابي وقاص", "سعد بن مالك"]],
            ["سعيد بن زيد", ["سعيد", "سعيد بن زيد بن عمرو"]],
            ["أبو عبيدة عامر بن الجراح", ["أبو عبيدة", "ابو عبيدة", "عامر بن الجراح", "أمين الأمة", "أمين هذه الأمة"]]
        ]
    },
    {
        question: "أكثر 10 دول سكانًا",
        hints: [
            { answerIndex: 0, text: "دولة آسيوية تجاوز عدد سكانها الصين في السنوات الأخيرة." },
            { answerIndex: 1, text: "دولة آسيوية كانت الأكبر سكانًا في العالم قبل الهند." },
            { answerIndex: 2, text: "دولة في أمريكا الشمالية تأتي في المرتبة الثالثة من حيث عدد السكان." }
        ],
        answers: [
            ["الهند", ["الهند"]],
            ["الصين", ["الصين"]],
            ["الولايات المتحدة", ["أمريكا", "امريكا", "الولايات المتحده", "USA", "United States"]],
            ["إندونيسيا", ["اندونيسيا"]],
            ["باكستان", ["باكستان"]],
            ["نيجيريا", ["نيجيريا"]],
            ["البرازيل", ["البرازيل"]],
            ["بنغلاديش", ["بنجلاديش", "بنغلاديش"]],
            ["روسيا", ["روسيا"]],
            ["إثيوبيا", ["اثيوبيا"]]
        ]
    },
    {
        question: "أشهر 10 تطبيقات يستخدمها الناس",
        hints: [
            { answerIndex: 0, text: "تطبيق مراسلة شهير يحمل أيقونة هاتف داخل فقاعة خضراء." },
            { answerIndex: 1, text: "تطبيق لمشاركة الصور ومقاطع الفيديو ويشتهر بالقصص." },
            { answerIndex: 3, text: "منصة شهيرة لمشاهدة ومشاركة مقاطع الفيديو." }
        ],
        answers: [
            ["WhatsApp", ["واتساب", "واتس اب", "واتسآب", "واتس"]],
            ["Instagram", ["انستغرام", "إنستغرام", "انستجرام", "إنستجرام"]],
            ["TikTok", ["تيك توك", "تيكتوك"]],
            ["YouTube", ["يوتيوب"]],
            ["Facebook", ["فيسبوك", "فيس بوك"]],
            ["Snapchat", ["سناب شات", "سناب"]],
            ["Telegram", ["تيليجرام", "تلغرام", "تليجرام"]],
            ["Google Maps", ["خرائط جوجل", "قوقل ماب", "غوغل مابس", "جوجل مابس", "قوقل مابس"]],
            ["Gmail", ["جيميل", "جي ميل", "قوقل ميل", "غوغل ميل"]],
            ["Spotify", ["سبوتيفاي", "سبوتفاي"]]
        ]
    },

];
window.gameQuestions = questions;
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
    return String(text || "")
        .toLowerCase()
        .trim()
        .replace(/[\u064B-\u065F\u0670]/g, "")
        .replace(/ـ/g, "")
        .replace(/[أإآٱ]/g, "ا")
        .replace(/ؤ/g, "و")
        .replace(/ئ/g, "ي")
        .replace(/ة/g, "ه")
        .replace(/ى/g, "ي")
        .replace(/[\s\-_.,!?،؛:()'’]/g, "");
}

function editDistance(a, b) {
    let previous = Array.from({ length: b.length + 1 }, (_, i) => i);
    for (let i = 1; i <= a.length; i++) {
        const current = [i];
        for (let j = 1; j <= b.length; j++) {
            current[j] = Math.min(current[j - 1] + 1, previous[j] + 1,
                previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
        }
        previous = current;
    }
    return previous[b.length];
}

function answerMatches(rawAnswer, acceptedAnswers) {
    const inputAnswer = normalize(rawAnswer);
    if (!inputAnswer) return false;
    const aliases = acceptedAnswers.map(normalize).filter(Boolean);
    if (aliases.includes(inputAnswer)) return true;

    const variants = new Set([inputAnswer]);
    for (const [from, to] of [["ج", "غ"], ["ج", "ق"], ["غ", "ق"], ["ب", "پ"], ["ف", "ڤ"]]) {
        for (const value of [...variants]) {
            if (value.includes(from)) variants.add(value.replaceAll(from, to));
            if (value.includes(to)) variants.add(value.replaceAll(to, from));
        }
    }
    if (aliases.some(alias => variants.has(alias))) return true;

    return aliases.some(alias => {
        const sameScript = /[a-z]/i.test(alias) === /[a-z]/i.test(inputAnswer);
        const longest = Math.max(alias.length, inputAnswer.length);
        if (!sameScript || longest < 5) return false;
        const limit = longest >= 10 ? 2 : 1;
        return Math.abs(alias.length - inputAnswer.length) <= limit &&
            editDistance(alias, inputAnswer) <= limit;
    });
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

// إتاحة تحميل السؤال وإجاباته المختارة من الغرفة لجميع اللاعبين
window.loadMultiplayerQuestion = function(index) {
    if (!Number.isInteger(index) || index < 0 || index >= questions.length) {
        return;
    }

    currentQuestion = index;
    loadQuestion();
};

// واجهة الربط مع اللعب الجماعي
window.isMultiplayerMode = false;
window.multiplayerAnswerHandler = null;

window.setMultiplayerMode = function(enabled) {
    window.isMultiplayerMode = Boolean(enabled);
    document.getElementById("skipBtn").style.display = enabled ? "none" : "inline-block";
    newChallengeBtn.style.display = "none";
    hintBtn.style.display = enabled ? "none" : "inline-block";
};

window.setMultiplayerAnswerHandler = function(handler) {
    window.multiplayerAnswerHandler = handler;
};

window.findMultiplayerAnswerIndex = function(rawAnswer) {
    if (!normalize(rawAnswer)) return -1;
    return questions[currentQuestion].answers.findIndex(item =>
        answerMatches(rawAnswer, [item[0], ...item[1]])
    );
};

window.updateMultiplayerAnswers = function(records, ownPoints) {
    const shared = records || {};
    found = Object.keys(shared)
        .map(Number)
        .filter(index => Number.isInteger(index) && index >= 0 && index < 10);
    scoreCount.textContent = found.length + " / 10";
    pointsCount.textContent = Number(ownPoints) || 0;
    renderAnswers();

    if (found.length === 10) {
        message.textContent = "اكتُشفت الإجابات العشر!";
        message.style.color = "#8fffc2";
    }
};

window.canSubmitMultiplayerAnswer = function() {
    return mistakes < 5 && found.length < 10;
};

window.applyMultiplayerWrongAnswer = function() {
    mistakes++;
    playSound(220, 0.25, "triangle");
    message.textContent = "إجابة غير صحيحة، حاول مجدداً.";
    message.style.color = "#ff8290";
    renderMistakes();

    if (mistakes >= 5) {
        message.textContent = "انتهت محاولاتك في هذه الجولة.";
        message.style.color = "#ffe18b";
    }
};


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
    if (window.isMultiplayerMode && typeof window.multiplayerAnswerHandler === "function") {
        window.multiplayerAnswerHandler(input.value);
        return;
    }

    const userAnswer = normalize(input.value);

    if (!userAnswer || mistakes >= 5 || found.length === 10) return;

    const q = questions[currentQuestion];

    const answerIndex = q.answers.findIndex((answer, index) => {
        if (found.includes(index)) return false;

        return answerMatches(userAnswer, [answer[0], ...answer[1]]);
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
