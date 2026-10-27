import { createClient } from '@libsql/client';

const DB_URL = 'libsql://mode-knook9.aws-ap-northeast-1.turso.io';
const DB_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3OTMwOTU2ODAsImlkIjoiMDFhMTdjYjMtZTgwMS03MDNiLWE3NDMtYzI0Mzc2YjgzNTdhIiwia2lkIjoiUHFmNXBLOTFNenFGVExIbENOa2ZpenJRWXMweFNYQ2dtenh6NkZ3bTVYRSIsInJpZCI6IjYzN2NhZWE5LWVkNTgtNDVkZS1iNDE5LWU3ZGVhMDhmY2UxMSJ9.nr3uKRlNd5ZqrM0GCZpB8EmZ_JWBeNEdcRkG2aRILsS4ITOaDFy6MOkGSPvqoSGL_ThzdeXtSjtP3C0c4JH6Bg';

const db = createClient({ url: DB_URL, authToken: DB_TOKEN });

const NEW_FAMOUS_GAMES_MODS = [
  // --- Garry's Mod ---
  {
    game: "Garry's Mod",
    game_genre: "محاكاة وفيزياء وساندبوكس",
    title: "Wiremod",
    slug: "gmod-wiremod",
    category: "Tools & Utilities",
    description: "الأداة البرمجية والهندسية الأضخم في غاريز مود لإضافة دارات منطقية، بوابات إلكترونية ومتحكمات Expression 2 لصنع آلات معقدة.",
    image_url: "https://images.steamusercontent.com/ugc/597008945885476119/E3C2B1BDEB705FAEC15C49A6E941E5D5707DF88E/",
    download_url: "https://steamcommunity.com/sharedfiles/filedetails/?id=160250458",
    source_url: "https://steamcommunity.com/sharedfiles/filedetails/?id=160250458",
    author: "Wireteam",
    version: "2024.1",
    status: "approved"
  },
  {
    game: "Garry's Mod",
    game_genre: "محاكاة وفيزياء وساندبوكس",
    title: "TFA Base",
    slug: "gmod-tfa-base",
    category: "Weapons & Combat",
    description: "المحرك الأساسي الأكثر اعتماداً للأسلحة النارية مع فيزياء ارتداد حركية، تخصيص ملحقات واهتزازات واقعية.",
    image_url: "https://images.steamusercontent.com/ugc/1940506580222948816/0925920C077DAAC8EFD2FAAA7DC6155635C6203D/",
    download_url: "https://steamcommunity.com/sharedfiles/filedetails/?id=2840031720",
    source_url: "https://steamcommunity.com/sharedfiles/filedetails/?id=2840031720",
    author: "TheForgottenArchitect",
    version: "4.9.1",
    status: "approved"
  },
  {
    game: "Garry's Mod",
    game_genre: "محاكاة وفيزياء وساندبوكس",
    title: "M9K Small Arms pack",
    slug: "gmod-m9k-small-arms",
    category: "Weapons",
    description: "حزمة الأسلحة الأسطورية الأشهر لسيرفرات DarkRP وساندبوكس، تحتوي على مسدسات وأسلحة خفيفة كلاسيكية متوازنة.",
    image_url: "https://images.steamusercontent.com/ugc/900988960351397735/FC97DC25FA908D53BD898627EDEE8BE074EE0C8E/",
    download_url: "https://steamcommunity.com/sharedfiles/filedetails/?id=128093075",
    source_url: "https://steamcommunity.com/sharedfiles/filedetails/?id=128093075",
    author: "INCONCEIVABLE!",
    version: "1.0",
    status: "approved"
  },
  {
    game: "Garry's Mod",
    game_genre: "محاكاة وفيزياء وساندبوكس",
    title: "[simfphys] LUA Vehicles - Base",
    slug: "gmod-simfphys-base",
    category: "Vehicles",
    description: "محرك السيارات الفيزيائي الأكثر واقعية لغاريز مود مع ناقل حركة يدوي وتمايل عجلات ونظام ضرر تفاعلي.",
    image_url: "https://images.steamusercontent.com/ugc/2351510342302423695/2A6CBEF1BA129F496BDE2242111E7321C9CE7883/",
    download_url: "https://steamcommunity.com/sharedfiles/filedetails/?id=771487490",
    source_url: "https://steamcommunity.com/sharedfiles/filedetails/?id=771487490",
    author: "Blu-x92",
    version: "2.1",
    status: "approved"
  },
  {
    game: "Garry's Mod",
    game_genre: "محاكاة وفيزياء وساندبوكس",
    title: "ArcCW Base: Arctic's Customizable Weapons",
    slug: "gmod-arccw-base",
    category: "Weapons & Customization",
    description: "نظام أسلحة حركي فائق التطور يتيح التعديل المباشر أثناء اللعب، مناظير Picture-in-Picture وسكك ملحقات متطورة.",
    image_url: "https://images.steamusercontent.com/ugc/1188335431791554397/0DF9B9ED63E0DF301540A2CD7A48EAA83259C394/",
    download_url: "https://steamcommunity.com/sharedfiles/filedetails/?id=2131186647",
    source_url: "https://steamcommunity.com/sharedfiles/filedetails/?id=2131186647",
    author: "Arctic",
    version: "1.4",
    status: "approved"
  },

  // --- Left 4 Dead 2 ---
  {
    game: "Left 4 Dead 2",
    game_genre: "تصويب ورعب وبقاء تعاوني",
    title: "Left 4 Bots 2: Advanced Survivor AI",
    slug: "l4d2-left-4-bots-2",
    category: "AI & Gameplay",
    description: "تطوير شامل لذكاء البوتات الاصطناعي ليصبحوا مثل اللاعبين الحقيقيين: إنعاش بالصدمات الكهربائية، جمع جالونات الوقود، وقتال تكتيكي.",
    image_url: "https://images.steamusercontent.com/ugc/2036243145001980711/71C790D4D2BE6EF41B266858A9CE47596BE1CE44/",
    download_url: "https://steamcommunity.com/sharedfiles/filedetails/?id=3022416274",
    source_url: "https://steamcommunity.com/sharedfiles/filedetails/?id=3022416274",
    author: "A1m",
    version: "2.3.0",
    status: "approved"
  },
  {
    game: "Left 4 Dead 2",
    game_genre: "تصويب ورعب وبقاء تعاوني",
    title: "Urban Flight Campaign",
    slug: "l4d2-urban-flight",
    category: "Campaigns & Maps",
    description: "حملة كاملة مكونة من 4 خرائط مذهلة وسط مدينة مشتعلة مع طرق متعددة ونهاية حماسية في المطار الحربي.",
    image_url: "https://images.steamusercontent.com/ugc/595867556120396015/C498D4396098F397636DF11B898952B6A2D4ACBD/",
    download_url: "https://steamcommunity.com/sharedfiles/filedetails/?id=121086524",
    source_url: "https://steamcommunity.com/sharedfiles/filedetails/?id=121086524",
    author: "NiceGuy",
    version: "3.2",
    status: "approved"
  },
  {
    game: "Left 4 Dead 2",
    game_genre: "تصويب ورعب وبقاء تعاوني",
    title: "I Hate Mountains 2 Campaign",
    slug: "l4d2-i-hate-mountains-2",
    category: "Campaigns & Maps",
    description: "إحدى أشهر الحملات الكلاسيكية في تاريخ اللعبة عبر الغابات والكهوف الجبلية والقصور المهجورة.",
    image_url: "https://images.steamusercontent.com/ugc/1082266365186020842/72FEFEA5FEACCC4328562B28B36987BAEFA459FA/",
    download_url: "https://steamcommunity.com/sharedfiles/filedetails/?id=121069410",
    source_url: "https://steamcommunity.com/sharedfiles/filedetails/?id=121069410",
    author: "Nicolas",
    version: "1.4",
    status: "approved"
  },
  {
    game: "Left 4 Dead 2",
    game_genre: "تصويب ورعب وبقاء تعاوني",
    title: "Chernobyl: Chapter One",
    slug: "l4d2-chernobyl-chapter-one",
    category: "Campaigns & Maps",
    description: "حملة مرعبة مستوحاة من كارثة تشيرنوبل بأجواء مشعة ومؤثرات صوتية وخرائط واقعية فائقة الدقة.",
    image_url: "https://images.steamusercontent.com/ugc/945096193868619375/AA66A16B579E780E24D262F64C595CBEAE5CA068/",
    download_url: "https://steamcommunity.com/sharedfiles/filedetails/?id=1646203073",
    source_url: "https://steamcommunity.com/sharedfiles/filedetails/?id=1646203073",
    author: "Av3ris",
    version: "1.0",
    status: "approved"
  },
  {
    game: "Left 4 Dead 2",
    game_genre: "تصويب ورعب وبقاء تعاوني",
    title: "Glubtastic Custom Campaign",
    slug: "l4d2-glubtastic",
    category: "Fun & Challenges",
    description: "سلسلة الخرائط التحدي والمقالب الجماعية الأكثر شهرة وإثارة في تاريخ ورشة Left 4 Dead 2.",
    image_url: "https://images.steamusercontent.com/ugc/1009312413303514925/7F129672EF8CCAC1216B9F5D360B95FECA49CC47/",
    download_url: "https://steamcommunity.com/sharedfiles/filedetails/?id=2031028789",
    source_url: "https://steamcommunity.com/sharedfiles/filedetails/?id=2031028789",
    author: "Pyromaniac",
    version: "2.1",
    status: "approved"
  },

  // --- Project Zomboid ---
  {
    game: "Project Zomboid",
    game_genre: "بقاء ورعب واقعي وزومبي",
    title: "Brita's Weapon Pack",
    slug: "pz-britas-weapon-pack",
    category: "Weapons & Equipment",
    description: "المود الأشهر على الإطلاق للأسلحة في بروجكت زومبويد: مئات الأسلحة النارية، الملحقات، الذخائر والسكاكين الواقعية.",
    image_url: "https://images.steamusercontent.com/ugc/2029473162830587056/9B9057B362F4A0A195A85A4FFDBCE9C942007421/",
    download_url: "https://steamcommunity.com/sharedfiles/filedetails/?id=2200148440",
    source_url: "https://steamcommunity.com/sharedfiles/filedetails/?id=2200148440",
    author: "Brita",
    version: "2.0",
    status: "approved"
  },
  {
    game: "Project Zomboid",
    game_genre: "بقاء ورعب واقعي وزومبي",
    title: "Common Sense",
    slug: "pz-common-sense",
    category: "Quality of Life",
    description: "مود المنطق والبديهيات: فتح الأبواب بالقضيب الحديدي (Crowbar)، فتح علب الطعام بالسكاكين، وارتداء الحقائب المزدوجة.",
    image_url: "https://images.steamusercontent.com/ugc/13045408534925380/5C82A2E82E3A0905D6AE0B998E5E589417E49D34/",
    download_url: "https://steamcommunity.com/sharedfiles/filedetails/?id=2875848298",
    source_url: "https://steamcommunity.com/sharedfiles/filedetails/?id=2875848298",
    author: "Bravender",
    version: "1.1",
    status: "approved"
  },
  {
    game: "Project Zomboid",
    game_genre: "بقاء ورعب واقعي وزومبي",
    title: "Filibuster Rhymes' Used Cars!",
    slug: "pz-filibuster-used-cars",
    category: "Vehicles",
    description: "حزمة ضخمة من السيارات والشاحنات وسيارات الشرطة والإسعاف الكلاسيكية المتوافقة كلياً مع عالم كنتاكي.",
    image_url: "https://images.steamusercontent.com/ugc/1858302765098369302/5297C96FE4B26322C6418B51E3C8B72BD3EEDEA2/",
    download_url: "https://steamcommunity.com/sharedfiles/filedetails/?id=1510950729",
    source_url: "https://steamcommunity.com/sharedfiles/filedetails/?id=1510950729",
    author: "Filibuster Rhymes",
    version: "3.0",
    status: "approved"
  },
  {
    game: "Project Zomboid",
    game_genre: "بقاء ورعب واقعي وزومبي",
    title: "True Actions: Sitting & Lying",
    slug: "pz-true-actions",
    category: "Immersion & Roleplay",
    description: "إضافة إمكانية الجلوس الفعلي على الكراسي والأرائك والاستلقاء على الأسرة لتقليل الإجهاد والملل بواقعية.",
    image_url: "https://images.steamusercontent.com/ugc/1679269251871008294/D6740B7E17F814CE48ECFD722E4E42BFA849C7D5/",
    download_url: "https://steamcommunity.com/sharedfiles/filedetails/?id=2487022075",
    source_url: "https://steamcommunity.com/sharedfiles/filedetails/?id=2487022075",
    author: "iBrRus",
    version: "1.08",
    status: "approved"
  },

  // --- Terraria ---
  {
    game: "Terraria",
    game_genre: "مغامرات وبناء وعالم مفتوح 2D",
    title: "Calamity Mod",
    slug: "terraria-calamity-mod",
    category: "Total Overhaul",
    description: "التوسعة الأضخم والأشهر في تاريخ تيراريا: عشرات الزعماء الجدد، أسلحة أسطورية، نظام صعوبة Revengeance ومناطق حيوية كاملة.",
    image_url: "https://images.steamusercontent.com/ugc/18354810480491550448/57B18E8A375E010EF60EDCE8E05459E15291E3B8/",
    download_url: "https://steamcommunity.com/sharedfiles/filedetails/?id=2824688072",
    source_url: "https://steamcommunity.com/sharedfiles/filedetails/?id=2824688072",
    author: "Fabsol & Calamity Team",
    version: "2.0.4",
    status: "approved"
  },
  {
    game: "Terraria",
    game_genre: "مغامرات وبناء وعالم مفتوح 2D",
    title: "Calamity Mod Music",
    slug: "terraria-calamity-music",
    category: "Audio & Music",
    description: "الموسيقى التصويرية الأسطورية الملحمية لجميع زعماء ومناطق كالاميتي مود من تلحين DM DOKURO.",
    image_url: "https://images.steamusercontent.com/ugc/9766500263336741745/1C4F2231DE115CE3283ECDE0FBE25FE70EBFE430/",
    download_url: "https://steamcommunity.com/sharedfiles/filedetails/?id=2824688266",
    source_url: "https://steamcommunity.com/sharedfiles/filedetails/?id=2824688266",
    author: "DM DOKURO & Calamity Team",
    version: "2.0.4",
    status: "approved"
  },
  {
    game: "Terraria",
    game_genre: "مغامرات وبناء وعالم مفتوح 2D",
    title: "Magic Storage",
    slug: "terraria-magic-storage",
    category: "Quality of Life",
    description: "نظام التخزين السحابي الآلي الذي يربط جميع الصناديق ومحطات التصنيع في واجهة بحث موحدة ومريحة.",
    image_url: "https://images.steamusercontent.com/ugc/12174576115002990045/B7BC39C80D770E8B54D4AE10C1B03673F8E06A26/",
    download_url: "https://steamcommunity.com/sharedfiles/filedetails/?id=2563309347",
    source_url: "https://steamcommunity.com/sharedfiles/filedetails/?id=2563309347",
    author: "blushiemagic",
    version: "0.6.0.3",
    status: "approved"
  },
  {
    game: "Terraria",
    game_genre: "مغامرات وبناء وعالم مفتوح 2D",
    title: "Recipe Browser",
    slug: "terraria-recipe-browser",
    category: "Tools & Interface",
    description: "دليل تصنيع وتتبع فوري لكل المكونات والوصفات ومصادر سقوط الأسلحة من الوحوش مباشرة في شاشة اللعبة.",
    image_url: "https://images.steamusercontent.com/ugc/1853809508481651551/19816B6CFAF6626FFD879C40DB8F00B6BB7A0B3B/",
    download_url: "https://steamcommunity.com/sharedfiles/filedetails/?id=2619954303",
    source_url: "https://steamcommunity.com/sharedfiles/filedetails/?id=2619954303",
    author: "Jopojelly",
    version: "0.10.4",
    status: "approved"
  },
  {
    game: "Terraria",
    game_genre: "مغامرات وبناء وعالم مفتوح 2D",
    title: "Boss Checklist",
    slug: "terraria-boss-checklist",
    category: "Progression & Tracking",
    description: "قائمة ترتيب الزعماء ومراحل التقدم وتتبع القتلات وغنائم المعارك في اللعبة الأساسية وجميع المودات الكبرى.",
    image_url: "https://images.steamusercontent.com/ugc/2279448478986310855/94CEB80393B7D6013214E1DA1DDA934DF368A9A4/",
    download_url: "https://steamcommunity.com/sharedfiles/filedetails/?id=2669644269",
    source_url: "https://steamcommunity.com/sharedfiles/filedetails/?id=2669644269",
    author: "Jopojelly",
    version: "2.1.5",
    status: "approved"
  },
  {
    game: "Terraria",
    game_genre: "مغامرات وبناء وعالم مفتوح 2D",
    title: "Fargo's Mutant Mod",
    slug: "terraria-fargos-mutant-mod",
    category: "Quality of Life & Summons",
    description: "شخصيات NPC جديدة لبيع أدوات استدعاء الزعماء والقرى وعناصر تسهيل البناء والتنقل دون إضاعة الوقت.",
    image_url: "https://images.steamusercontent.com/ugc/16331139479663403829/F22C59F76E39B8624BBAD03A35D8ACFD6A1EB8DB/",
    download_url: "https://steamcommunity.com/sharedfiles/filedetails/?id=2570931073",
    source_url: "https://steamcommunity.com/sharedfiles/filedetails/?id=2570931073",
    author: "Fargo & Team",
    version: "3.3.3",
    status: "approved"
  },

  // --- RimWorld ---
  {
    game: "RimWorld",
    game_genre: "محاكاة مستعمرات وقصص وبقاء فضائي",
    title: "Combat Extended",
    slug: "rimworld-combat-extended",
    category: "Combat Overhaul",
    description: "إعادة بناء كاملة لفيزياء القتال: نظام ذخيرة واقعي، دروع صد رصاص متقدمة، وديناميكية اختراق وحماية واقعية.",
    image_url: "https://images.steamusercontent.com/ugc/1973168020477562094/CEBF66B2F773099C0637F7E1D8BE257529FDF754/",
    download_url: "https://steamcommunity.com/sharedfiles/filedetails/?id=2890901044",
    source_url: "https://steamcommunity.com/sharedfiles/filedetails/?id=2890901044",
    author: "Combat Extended Team",
    version: "1.5",
    status: "approved"
  },
  {
    game: "RimWorld",
    game_genre: "محاكاة مستعمرات وقصص وبقاء فضائي",
    title: "Harmony (RimWorld)",
    slug: "rimworld-harmony",
    category: "Core Library",
    description: "المكتبة التقنية الأساسية الإلزامية لتشغيل غالبية مودات ريم وورلد المتقدمة في قائمة التعديلات.",
    image_url: "https://images.steamusercontent.com/ugc/779624067826598337/74BF353D8D70F7A6A0905D2D5B215E5EBE592653/",
    download_url: "https://steamcommunity.com/sharedfiles/filedetails/?id=2009463077",
    source_url: "https://steamcommunity.com/sharedfiles/filedetails/?id=2009463077",
    author: "pardeike",
    version: "2.3.1",
    status: "approved"
  },
  {
    game: "RimWorld",
    game_genre: "محاكاة مستعمرات وقصص وبقاء فضائي",
    title: "EdB Prepare Carefully",
    slug: "rimworld-edb-prepare-carefully",
    category: "Character Customization",
    description: "أداة تخصيص المستعمرين الأشهر لاختيار صفاتهم ومهاراتهم وعلاقاتهم ومعدات الهبوط قبل بدء المستعمرة.",
    image_url: "https://images.steamusercontent.com/ugc/449616801431102182/98F296472251D5A642E61F802D9C3E1410D9A903/",
    download_url: "https://steamcommunity.com/sharedfiles/filedetails/?id=735106432",
    source_url: "https://steamcommunity.com/sharedfiles/filedetails/?id=735106432",
    author: "edbmods",
    version: "1.4",
    status: "approved"
  },
  {
    game: "RimWorld",
    game_genre: "محاكاة مستعمرات وقصص وبقاء فضائي",
    title: "Vanilla Expanded Framework",
    slug: "rimworld-vanilla-expanded-framework",
    category: "Framework",
    description: "إطار العمل المشغل لسلسلة مودات Vanilla Expanded العالمية لريم وورلد مع ميزات بناء وحيوانات ومعدات لا تحصى.",
    image_url: "https://images.steamusercontent.com/ugc/12020737992790215255/AC92F47214EE9262CBE56BFF904E01D780A15FE3/",
    download_url: "https://steamcommunity.com/sharedfiles/filedetails/?id=2023507013",
    source_url: "https://steamcommunity.com/sharedfiles/filedetails/?id=2023507013",
    author: "Oskar Potocki & VE Team",
    version: "1.5.2",
    status: "approved"
  },
  {
    game: "RimWorld",
    game_genre: "محاكاة مستعمرات وقصص وبقاء فضائي",
    title: "Vanilla Weapons Expanded",
    slug: "rimworld-vanilla-weapons-expanded",
    category: "Weapons",
    description: "توسعة متوازنة تضيف عشرات الأسلحة النارية والبيضاء من العصور الوسطى حتى عصر الفضاء والمستقبل.",
    image_url: "https://images.steamusercontent.com/ugc/788607185350720465/921D38DF84DFE8CFE9A0C3C91004C88BF1AC0745/",
    download_url: "https://steamcommunity.com/sharedfiles/filedetails/?id=1814383360",
    source_url: "https://steamcommunity.com/sharedfiles/filedetails/?id=1814383360",
    author: "Oskar Potocki",
    version: "1.5",
    status: "approved"
  },

  // --- Euro Truck Simulator 2 ---
  {
    game: "Euro Truck Simulator 2",
    game_genre: "محاكاة قيادة وشاحنات وطرق سريعة",
    title: "SiSL's Mega Pack",
    slug: "ets2-sisls-mega-pack",
    category: "Cabin Accessories",
    description: "الحزمة الضخمة لإكسسوارات كابينة القيادة: أكثر من 500 ملحق، شاشات ملاحة، ألعاب تفاعلية ومقتنيات شخصية.",
    image_url: "https://images.steamusercontent.com/ugc/286350544358825838/09930EB3314A51D145A62580556BE7BC1A36DA88/",
    download_url: "https://steamcommunity.com/sharedfiles/filedetails/?id=645553604",
    source_url: "https://steamcommunity.com/sharedfiles/filedetails/?id=645553604",
    author: "SiSL",
    version: "3.4",
    status: "approved"
  },
  {
    game: "Euro Truck Simulator 2",
    game_genre: "محاكاة قيادة وشاحنات وطرق سريعة",
    title: "Sound Fixes Pack for ETS2",
    slug: "ets2-sound-fixes-pack",
    category: "Audio & Realism",
    description: "إعادة إنتاج شاملة لأصوات المحركات والفرقعة والرياح وأصوات الطرق السريعة بمؤثرات صوتية محيطية حقيقية.",
    image_url: "https://images.steamusercontent.com/ugc/1832478546738927801/83ECBDE1F3507AE936C2BF8B5C08FF59EE7324D6/",
    download_url: "https://steamcommunity.com/sharedfiles/filedetails/?id=648591060",
    source_url: "https://steamcommunity.com/sharedfiles/filedetails/?id=648591060",
    author: "Drive Safely",
    version: "26.72",
    status: "approved"
  },
  {
    game: "Euro Truck Simulator 2",
    game_genre: "محاكاة قيادة وشاحنات وطرق سريعة",
    title: "Real Traffic Density ETS2",
    slug: "ets2-real-traffic-density",
    category: "Traffic & AI",
    description: "تعديل حركة المرور وفق أوقات الذروة وساعات الليل والنهار وأنواع الطرق السريعة لتجربة قيادة أوروبية واقعية.",
    image_url: "https://images.steamusercontent.com/ugc/11813841517608717996/F7F744E828EA764BF3BD34C199C7581E2FB97B42/",
    download_url: "https://steamcommunity.com/sharedfiles/filedetails/?id=1236032431",
    source_url: "https://steamcommunity.com/sharedfiles/filedetails/?id=1236032431",
    author: "Cip",
    version: "1.50",
    status: "approved"
  },
  {
    game: "Euro Truck Simulator 2",
    game_genre: "محاكاة قيادة وشاحنات وطرق سريعة",
    title: "Realistic Brutal Graphics And Weather",
    slug: "ets2-brutal-graphics-weather",
    category: "Graphics & Weather",
    description: "ترقية رسومية ضخمة للطقس، السحب الحقيقية بدقة 4K، العواصف الرعدية، وانعكاسات الأمطار على الزجاج والأسفلت.",
    image_url: "https://images.steamusercontent.com/ugc/2260309995543781223/A35A31DCDB3C00A891BA967A6A0EE8D924DAE03E/",
    download_url: "https://steamcommunity.com/sharedfiles/filedetails/?id=3103086032",
    source_url: "https://steamcommunity.com/sharedfiles/filedetails/?id=3103086032",
    author: "Kass",
    version: "10.1",
    status: "approved"
  },

  // --- Cities: Skylines ---
  {
    game: "Cities: Skylines",
    game_genre: "تخطيط وبناء ومحاكاة مدن",
    title: "TM:PE (Traffic Manager: President Edition)",
    slug: "cs-tmpe-traffic-manager",
    category: "Traffic Management",
    description: "المود الأكثر ضرورة في سيتيز سكايلاينز للتحكم بالإشارات الضوئية، المسارات المخصصة، أولوية الدوارات وتفادي الازدحام.",
    image_url: "https://images.steamusercontent.com/ugc/787503295900786896/FD3E678FAFC38CFACBE319F0A3F1F17FFC61E875/",
    download_url: "https://steamcommunity.com/sharedfiles/filedetails/?id=1637663252",
    source_url: "https://steamcommunity.com/sharedfiles/filedetails/?id=1637663252",
    author: "Krzychu124 & TMPE Team",
    version: "11.9.4.1",
    status: "approved"
  },
  {
    game: "Cities: Skylines",
    game_genre: "تخطيط وبناء ومحاكاة مدن",
    title: "Move It",
    slug: "cs-move-it",
    category: "Building Tools",
    description: "أداة النقل والتحريك الشاملة لتحريك المباني والطرق والأشجار والمنحدرات بدقة بكسل حرة.",
    image_url: "https://images.steamusercontent.com/ugc/1929255123714301020/EE16A8C5DECC95E8A9CBE083A8EB41F90D7DAAE5/",
    download_url: "https://steamcommunity.com/sharedfiles/filedetails/?id=1619685021",
    source_url: "https://steamcommunity.com/sharedfiles/filedetails/?id=1619685021",
    author: "Quboid",
    version: "2.10.7",
    status: "approved"
  },
  {
    game: "Cities: Skylines",
    game_genre: "تخطيط وبناء ومحاكاة مدن",
    title: "Loading Screen Mod Revisited",
    slug: "cs-loading-screen-mod-revisited",
    category: "Optimization & Performance",
    description: "تسريع تحميل المدن الضخمة وتوفير الجيجابايتات من الذاكرة العشوائية RAM عبر مشاركة المواد التكرارية.",
    image_url: "https://images.steamusercontent.com/ugc/1818913127289476399/1BFA315D39FE9C86DC20D919BC4A3A73FF212F7C/",
    download_url: "https://steamcommunity.com/sharedfiles/filedetails/?id=2858591409",
    source_url: "https://steamcommunity.com/sharedfiles/filedetails/?id=2858591409",
    author: "algernon",
    version: "1.1.14",
    status: "approved"
  },
  {
    game: "Cities: Skylines",
    game_genre: "تخطيط وبناء ومحاكاة مدن",
    title: "Network Multitool",
    slug: "cs-network-multitool",
    category: "Road Construction",
    description: "حزمة أدوات هندسية متقدمة لضبط ميلان الجسور، إنشاء منحنيات متناسقة، وتوصيل التقاطعات السريعة باحترافية.",
    image_url: "https://images.steamusercontent.com/ugc/1708538508539826273/959A6D2BE2A89F968114620B2F2A1E8CEB38A88B/",
    download_url: "https://steamcommunity.com/sharedfiles/filedetails/?id=2560782729",
    source_url: "https://steamcommunity.com/sharedfiles/filedetails/?id=2560782729",
    author: "macsergey",
    version: "1.3.9",
    status: "approved"
  },
  {
    game: "Cities: Skylines",
    game_genre: "تخطيط وبناء ومحاكاة مدن",
    title: "Node Controller Renewal",
    slug: "cs-node-controller-renewal",
    category: "Road Engineering",
    description: "توسيع العقد والتقاطعات المرورية وتعيين مسارات المشاة وممرات الانعطاف المائلة بطريقة واقعية جداً.",
    image_url: "https://images.steamusercontent.com/ugc/1790721049089795774/2103E793427E8D7F778401314C7DC227C0E4E595/",
    download_url: "https://steamcommunity.com/sharedfiles/filedetails/?id=2472062376",
    source_url: "https://steamcommunity.com/sharedfiles/filedetails/?id=2472062376",
    author: "macsergey",
    version: "3.5.4",
    status: "approved"
  }
];

async function insertMods() {
  console.log(`📦 Ingesting ${NEW_FAMOUS_GAMES_MODS.length} iconic mods for famous games...`);
  let added = 0;
  for (const m of NEW_FAMOUS_GAMES_MODS) {
    const existing = await db.execute({
      sql: 'SELECT id FROM mods WHERE slug = ?',
      args: [m.slug]
    });
    if (existing.rows.length === 0) {
      await db.execute({
        sql: `INSERT INTO mods (
          title, slug, game, game_genre, category, description,
          image_url, download_url, source_url, author, version, status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
        args: [
          m.title, m.slug, m.game, m.game_genre, m.category, m.description,
          m.image_url, m.download_url, m.source_url, m.author, m.version, m.status
        ]
      });
      console.log(`✅ Added [${m.game}] ${m.title}`);
      added++;
    } else {
      await db.execute({
        sql: `UPDATE mods SET 
          title = ?, game = ?, game_genre = ?, category = ?, description = ?,
          image_url = ?, download_url = ?, source_url = ?, author = ?, version = ?, status = ?
          WHERE slug = ?`,
        args: [
          m.title, m.game, m.game_genre, m.category, m.description,
          m.image_url, m.download_url, m.source_url, m.author, m.version, m.status,
          m.slug
        ]
      });
      console.log(`🔄 Updated [${m.game}] ${m.title}`);
    }
  }

  const total = await db.execute('SELECT COUNT(*) as c FROM mods');
  console.log(`\n🎉 Total mods now in DB: ${total.rows[0].c}`);
}

insertMods().catch(console.error);
