// ================================================================
// NeuroSphera — Self-Evolution System Data
// ================================================================

// ─── XP Levels ───────────────────────────────────────────────────
export const EVOLUTION_LEVELS = [
  {
    level: 0,
    title:    'Self-Aware',
    titleSq:  'Vetëdijës',
    emoji:    '🌱',
    minXP:    0,
    maxXP:    199,
    color:    '#6b7280',
    gradient: 'linear-gradient(135deg,#6b7280,#9ca3af)',
    desc:     'Fillimi i çdo udhëtimi të madh.',
  },
  {
    level: 1,
    title:    'Pattern Observer',
    titleSq:  'Vëzhgues Modelesh',
    emoji:    '🔍',
    minXP:    200,
    maxXP:    499,
    color:    '#3b82f6',
    gradient: 'linear-gradient(135deg,#3b82f6,#6366f1)',
    desc:     'Po fillon të shohësh sistemet prapa sjelljes.',
  },
  {
    level: 2,
    title:    'Adaptive Thinker',
    titleSq:  'Mendimtar Adaptiv',
    emoji:    '⚡',
    minXP:    500,
    maxXP:    999,
    color:    '#8b5cf6',
    gradient: 'linear-gradient(135deg,#8b5cf6,#a855f7)',
    desc:     'Mendon fleksibël dhe adaptohet me vetëdije.',
  },
  {
    level: 3,
    title:    'Strategic Mind',
    titleSq:  'Mendje Strategjike',
    emoji:    '🎯',
    minXP:    1000,
    maxXP:    1999,
    color:    '#ec4899',
    gradient: 'linear-gradient(135deg,#ec4899,#f43f5e)',
    desc:     'Vendim-marrja jote ka thellësi dhe vizion.',
  },
  {
    level: 4,
    title:    'Emotional Architect',
    titleSq:  'Arkitekt Emocional',
    emoji:    '💎',
    minXP:    2000,
    maxXP:    3499,
    color:    '#f59e0b',
    gradient: 'linear-gradient(135deg,#f59e0b,#ef4444)',
    desc:     'Projekton emocionet me saktësi dhe vetëdije.',
  },
  {
    level: 5,
    title:    'Cognitive Leader',
    titleSq:  'Lider Kognitiv',
    emoji:    '🌌',
    minXP:    3500,
    maxXP:    Infinity,
    color:    '#dc2626',
    gradient: 'linear-gradient(135deg,#7c3aed,#ec4899,#f59e0b)',
    desc:     'Integrime e plotë e vetëdijes, strategjisë dhe emocionit.',
  },
]

// ─── XP Rewards ──────────────────────────────────────────────────
export const XP_REWARDS = {
  completePersonaMatrix: 150,
  dailyChallenge:        25,
  dailyCheckin:          10,
  streakDay:             10,
  streak7days:           50,
  streak30days:          200,
  retakeTest:            50,
  shareResult:           30,
}

// ─── Daily Challenge Pool ─────────────────────────────────────────
// Indexed by dimension tag for adaptive matching
export const CHALLENGE_POOL = [
  // ── Social Growth ─────────────────────────────────────────────
  { id: 'ch01', tag: 'social', xp: 25, duration: '5 min',
    title: 'Lidhja e Qëllimshme',
    desc:  'Dërgoja dikujt një mesazh të sinqertë — jo "si je?" por diçka specifike për ta.',
    icon: '💬', insight: 'Lidhjet e thella ndërtohen me vëmendje, jo sasinë.' },
  { id: 'ch02', tag: 'social', xp: 25, duration: '10 min',
    title: 'Biseda e Re',
    desc:  'Sot fillo një bisedë me dikë me të cilin nuk ke folur prej shumë kohësh.',
    icon: '🤝', insight: 'Rrjeti social është kapital jetësor.' },
  { id: 'ch03', tag: 'social', xp: 25, duration: '3 min',
    title: 'Dëgjo Aktivisht',
    desc:  'Në bisedën e ardhshme, dëgjoi 80% dhe foli vetëm 20%. Vëzhgo çfarë zbulon.',
    icon: '👂', insight: 'Dëgjimi aktiv është superpoweri i lidhjes njerëzore.' },
  { id: 'ch04', tag: 'social', xp: 25, duration: '15 min',
    title: 'Ekspresiviteti i Qëllimshëm',
    desc:  'Shpreh një opinion të vërtetë — diçka me të cilën jo të gjithë pajtohen.',
    icon: '🗣️', insight: 'Autenticiteti tërheq lidhje të vërteta.' },
  { id: 'ch05', tag: 'social', xp: 25, duration: '5 min',
    title: 'Lavdërimi i Sinqertë',
    desc:  'Thuaji dikujt diçka specifike dhe të vërtetë që vlerëson tek ata.',
    icon: '⭐', insight: 'Njohja e të tjerëve forcon lidhjet dhe vetëbesimin.' },

  // ── Emotional Intelligence ────────────────────────────────────
  { id: 'ch06', tag: 'emotional', xp: 25, duration: '5 min',
    title: 'Skanimi i Emocioneve',
    desc:  'Ndalo 5 minuta, mbyll sytë dhe emërto 3 emocione që ndjen tani. Pranoji pa i gjykuar.',
    icon: '💫', insight: 'Emocioni i emërtuar humbet forcën e kontrollit.' },
  { id: 'ch07', tag: 'emotional', xp: 25, duration: '10 min',
    title: 'Letra pa dërguar',
    desc:  'Shkruaj një letër dikujt me të cilin ke tension — pa e dërguar kurrë. Liro ngarkesën.',
    icon: '📝', insight: 'Shprehja pa dërgim është terapi e pastër.' },
  { id: 'ch08', tag: 'emotional', xp: 25, duration: '5 min',
    title: 'Shkas → Reagim → Zgjedhje',
    desc:  'Identifiko një situatë ku reagove fort. Analizon: shkas → mendim → emocion → veprim.',
    icon: '🔍', insight: 'Ndërgjegjja e hapësirës mes shkasit dhe reagimit është liri.' },
  { id: 'ch09', tag: 'emotional', xp: 25, duration: '3 min',
    title: 'Falënderimi i Brendshëm',
    desc:  'Shkruaj 3 gjëra specifike — jo të përgjithshme — për të cilat je mirënjohës/e sot.',
    icon: '🙏', insight: 'Falënderimi i detajuar (jo i përgjithshëm) ndryshon neuroologjinë.' },
  { id: 'ch10', tag: 'emotional', xp: 25, duration: '7 min',
    title: 'Rezistenca e Papëlqyeshme',
    desc:  'Bëj diçka që nuk dëshiron ta bësh sot por duhet. Vëzhgo rezistencën — mos e lufto, vetëm vëzhgoje.',
    icon: '⚡', insight: 'Rezistenca është busull drejt rritjes.' },

  // ── Analytical & Strategic ────────────────────────────────────
  { id: 'ch11', tag: 'analytical', xp: 25, duration: '10 min',
    title: 'Vendimi i Paspasshëm',
    desc:  'Zgjidh një vendim të vogël që ke shtypur. Vendose brenda 2 minutave — pastaj mos rishiko.',
    icon: '🎯', insight: 'Muskuli i vendimmarrjes forcohet me praktikë, jo me analizë infinite.' },
  { id: 'ch12', tag: 'analytical', xp: 25, duration: '15 min',
    title: 'Prizma e 3 Perspektivave',
    desc:  'Zgjidh një problem aktual. Shikoje nga 3 perspektiva të ndryshme: tënden, të kundërtit dhe të një vëzhguesi neutral.',
    icon: '🔺', insight: 'Multi-perspektiva është karakteristika e mendjes strategjike.' },
  { id: 'ch13', tag: 'analytical', xp: 25, duration: '5 min',
    title: 'Prioriteti i Parë',
    desc:  'Identifiko gjënë MÊ të rëndësishme të ditës (jo urgjentën, të rëndësishmen) dhe bëje të parën.',
    icon: '🥇', insight: 'Kush kontrollon 9 të mëngjezit kontrollon ditën.' },
  { id: 'ch14', tag: 'analytical', xp: 25, duration: '3 min',
    title: 'Pre-Mortem i Shpejtë',
    desc:  'Para se të fillosh projektin tënd kryesor, imagjino se ka dështuar. Pse dështoi? Elimino atë shkak tani.',
    icon: '🛡️', insight: 'Mendimi parandalues është inteligjencë strategjike.' },
  { id: 'ch15', tag: 'analytical', xp: 25, duration: '20 min',
    title: 'Deep Work Sprint',
    desc:  'Vendos 25 minuta fokus total pa asnjë distraksion. Telefoni larg. Vetëm puna dhe mendja.',
    icon: '⏱️', insight: 'Deep work është gjuha e rezultateve të vërteta.' },

  // ── Drive & Ambition ──────────────────────────────────────────
  { id: 'ch16', tag: 'drive', xp: 25, duration: '5 min',
    title: 'Vizioni 5-vjeçar',
    desc:  'Shkruaj 5 gjëra që dëshiron të arrish brenda 5 viteve. Bëji specifike, jo abstrakte.',
    icon: '🚀', insight: 'Specifika transformon ëndrrat në destinacione.' },
  { id: 'ch17', tag: 'drive', xp: 25, duration: '10 min',
    title: 'Zona e Pakëndshme',
    desc:  'Bëj diçka sot që e shtysh shpesh nga frika ose pakomodimi. Merr veprimin e parë të vogël.',
    icon: '🔥', insight: 'Zona e pakëndshme është zona e rritjes.' },
  { id: 'ch18', tag: 'drive', xp: 25, duration: '3 min',
    title: 'Identiteti i Veprimit',
    desc:  'Plotëso: "Jam personi që..." x 3. Shkruaj identitetin e personit që dëshiron të bëhesh.',
    icon: '💪', insight: 'Identiteti drejton sjelljen — jo vullneti.' },
  { id: 'ch19', tag: 'drive', xp: 25, duration: '15 min',
    title: 'Sfida e Vogël',
    desc:  'Gjen diçka të vështirë fizike ose mentale dhe bëje për 10 minuta. Kapërceje pragun e parë.',
    icon: '🏔️', insight: 'Çdo sfidë e kapërcyer prodhon dopaminë — dhe vetëbesim.' },
  { id: 'ch20', tag: 'drive', xp: 25, duration: '5 min',
    title: 'Raporti Ditore',
    desc:  'Para gjumit shkruaj: çfarë bëre sot drejt qëllimit tënd? Qoftë edhe gjëja më e vogël.',
    icon: '📊', insight: 'Llogaridhënia ndaj vetes është burimi i disiplinës.' },

  // ── Adaptability & Growth ─────────────────────────────────────
  { id: 'ch21', tag: 'adaptability', xp: 25, duration: '5 min',
    title: 'Rutinat e Ndryshuar',
    desc:  'Ndrysho diçka të vogël në rutinën e sotme: rrugën, rendin e aktiviteteve, mënyrën e ngrënies.',
    icon: '🔄', insight: 'Plasticitetit neuronal ushqehet me varietete të vogla.' },
  { id: 'ch22', tag: 'adaptability', xp: 25, duration: '10 min',
    title: 'Të Panjohurës si Mik',
    desc:  'Lexo ose mëso diçka nga një fushë krejtësisht ndryshe nga jotja. 10 minuta eksplorim i lirë.',
    icon: '🌐', insight: 'Njerëzit adaptivë mbledhin modele nga fusha të ndryshme.' },
  { id: 'ch23', tag: 'adaptability', xp: 25, duration: '3 min',
    title: 'Reframing i Shpejtë',
    desc:  'Zgjidh diçka negative nga dita e sotme. Gjej 2 mënyra si mund ta shohësh si mundësi.',
    icon: '🌈', insight: 'Reframing nuk është pozitivizëm naiv — është inteligjencë adaptive.' },
  { id: 'ch24', tag: 'adaptability', xp: 25, duration: '7 min',
    title: 'Pyetja e Kundërt',
    desc:  'Merr një mendim/vendim të fortë që ke tani dhe pyet: "Po gaboj? Çfarë do të thotë nëse e kundërt është e vërtetë?"',
    icon: '🪞', insight: 'Kundërvënia e vetes është shenjë e inteligjencës së lartë.' },

  // ── Mindfulness & Presence ────────────────────────────────────
  { id: 'ch25', tag: 'mindfulness', xp: 25, duration: '5 min',
    title: 'Frymëmarrja 4-7-8',
    desc:  'Merr frymë për 4 sekonda, mbaj 7, nxjerr 8. Bëje 4 herë. Vëzhgo ndryshimin.',
    icon: '🌬️', insight: 'Frymëmarrja e ndërgjegjshme ndryshon gjendjen nëurologjike brenda sekondave.' },
  { id: 'ch26', tag: 'mindfulness', xp: 25, duration: '10 min',
    title: 'Koha pa Ekran',
    desc:  'Kalo 30 minuta pa asnjë ekran. Vëzhgo ndjenjat, mendimet, tensionet.',
    icon: '📴', insight: 'Mendja ka nevojë për boshëllëk të prodhojë kuptim.' },
  { id: 'ch27', tag: 'mindfulness', xp: 25, duration: '5 min',
    title: 'Skanimi Trupor',
    desc:  'Mbyll sytë. Shkoni nga këmba deri te koka. Ku ndjen tension? Çliro atje.',
    icon: '🧘', insight: 'Trupi mban rezultatin emocional — liroje atë.' },
  { id: 'ch28', tag: 'mindfulness', xp: 25, duration: '3 min',
    title: 'Momenti i Vetëm Real',
    desc:  'Bëj diçka që normalisht bën automatikisht (ngrënia, ecja) dhe bëje me vëmendje totale.',
    icon: '✨', insight: 'Prania e plotë është forma më e rrallë e lirisë.' },
]

// ─── Badges ──────────────────────────────────────────────────────
export const BADGES = [
  { id: 'first_test',    emoji: '🔮', name: 'Zbulues i Parë',    desc: 'Plotëso PersonaMatrix',            xpNeeded: null, event: 'completePersonaMatrix' },
  { id: 'streak_3',      emoji: '🔥', name: 'Zjarri Fillon',     desc: '3 ditë me radhë aktiv',            xpNeeded: null, event: 'streak3' },
  { id: 'streak_7',      emoji: '⚡', name: 'Tërmeti Javore',    desc: '7 ditë me radhë aktiv',            xpNeeded: null, event: 'streak7' },
  { id: 'streak_30',     emoji: '🌟', name: 'Muaji i Artë',      desc: '30 ditë me radhë aktiv',           xpNeeded: null, event: 'streak30' },
  { id: 'level_1',       emoji: '🔍', name: 'Vëzhgues Modelesh', desc: 'Arrij nivelin Pattern Observer',   xpNeeded: 200,  event: null },
  { id: 'level_2',       emoji: '⚡', name: 'Mendimtar Adaptiv', desc: 'Arrij nivelin Adaptive Thinker',   xpNeeded: 500,  event: null },
  { id: 'level_3',       emoji: '🎯', name: 'Mendje Strategjike',desc: 'Arrij nivelin Strategic Mind',     xpNeeded: 1000, event: null },
  { id: 'challenges_10', emoji: '🏆', name: 'Dhjetë Sfida',      desc: 'Plotëso 10 sfida ditore',          xpNeeded: null, event: 'challenges10' },
  { id: 'retake',        emoji: '🔄', name: 'Evolucioni Real',   desc: 'Bëj testin sërish pas 30 ditësh',  xpNeeded: null, event: 'retake' },
  { id: 'sharer',        emoji: '📤', name: 'Ambasador',         desc: 'Ndaj arketipën tënde',             xpNeeded: null, event: 'share' },
]

// ─── AI Coach Messages by Archetype ──────────────────────────────
// Keys are archetype code (e.g. 'ESAB', 'IRNG', etc.)
export const COACH_MESSAGES = {
  VEGA: [
    "Ti je një forcë natyrore — por edhe forcat natyrore kanë nevojë për drejtim. Sot cakto 1 fushë specifike ku dëshiron të ndikosh. Jo gjithçka — 1 gjë.",
    "Liderët më të mirë nuk mbajnë gjithçka vetë. Sot identifiko një detyrim dhe çliroje duke ia besuar dikujt tjetër.",
    "Pasioni yt është karburanti — por cili është destinacioni? Shkruaj 3 fjali mbi vizionin tënd afatgjatë.",
  ],
  AURA: [
    "Ke dhënë shumë sot. Para se të flësh, pyetu: çfarë more ti sot? Nëse asgjë — kjo është informatë e rëndësishme.",
    "Kujdesi për të tjerët fillon nga kujdesi i vetes. Bëj diçka sot ekskluzivisht për veten tënde — pa faj.",
    "Aftësia jote analitike + zemra e ngrohtë = kombinim i rrallë. Ku mund ta aplikosh sot në mënyrën më efektive?",
  ],
  NOVA: [
    "Ke idetë — por sa i ke kthyer në realitet muajin e kaluar? Zgjidh 1 ide dhe bëj 1 hap konkret sot.",
    "Energjia jote tjetërkujt duket si magjike. Por magjia bëhet kuptimplotë kur ka forma. Çfarë forme po i jep ideve sot?",
    "Kureshtëria jote është aset — por kureshtëria pa thellësi mbetet sipërfaqesore. Mëso diçka në thellësi sot.",
  ],
  EMBER: [
    "Historitë e tua kanë fuqi — por cilën do ta tregosh sot? Lidhja njerëzore fillon me guximin për t'u hapur.",
    "Ndjeshmëria jote është dhuratë — por kujdes: absorbimi i emocioneve të të gjithëve të konsumon. Sot vendos 1 kufi me dashuri.",
    "Çfarë do thoshin miqtë yt e vjetër për personin që je sot? Kjo perspektivë tregon shumë.",
  ],
  ORION: [
    "Kontrolli yt nën presion është legjendë. Por çfarë mendon kur nuk ka presion? Ai moment tregon kush je me të vërtetë.",
    "Ke aftësinë e rrallë të qendrohet kur të tjerët panikosen. Sot gjej dikë që ka nevojë për atë qetësi — dhe ofroje.",
    "Logjika jote është çelës — por njerëzit nuk ndiqen vetëm me argumente. Çfarë ndjen ekipi yt sot?",
  ],
  FORGE: [
    "Besueshmëria jote është aset i rrallë. Por çdoherë kur premton, po investon reputacionin tënd. Sot premto vetëm aq sa mund të mbash.",
    "Ndërtoi gjëra të qëndrueshme — por kontrollo: a po ndërtoi gjënë e duhur, apo vetëm po ndërtoi mirë?",
    "Eficienca pa kuptim është lodhje e bukur. Pse e bën punën që bën? Lidhja me arsyen rrit performancën.",
  ],
  BLAZE: [
    "Sfidon sisteme — por cili sistem brenda teje po të pendon? Ky është sfida reale.",
    "Guximi yt është reale — por guximi i drejtuar me strategji ndryshon botën. Çfarë po lufton sot — dhe pse?",
    "Impulsiviteti yt prodhon inovacion — por edhe gjurmë. Sot para çdo veprimi të madh, prit 5 minuta. Pastaj vepro.",
  ],
  RIVER: [
    "Harmonia jote është fuqi — por a ka diçka të rëndësishme që nuk e thua nga frika e konfliktit? Thuaje sot, me qetësi.",
    "Aftësia jote për t'u adaptuar te çdo ambient është rare. Por cili ambient të bën TY të lulëzosh? Kërko atë.",
    "Di sa njerëz mbështeten tek ti? Sot numëro — pastaj vlerëso: a ke mbështetje të mjaftueshme edhe ti?",
  ],
  PRISM: [
    "Sistemet e tua janë të bukura — por kush tjetër i sheh? Mos fshih mendjen tënde. Nda 1 ide sot.",
    "Analizon gjithçka — por a po analizon edhe ndjenjat e tua me të njëjtën kujdes? Provo sot.",
    "Perfeksionizmi yt vonon botën nga idetë e tua. Çfarë mund të lëshosh 80% të gatshëm sot — dhe ta ndasë?",
  ],
  HAVEN: [
    "Ti krijon hapësira sigurie për të tjerët. Kur e ke krijuar atë hapësirë vetë për veten tënde sot?",
    "Urtësia jote e heshtur ka vlerë — por heshjta shumë e gjatë privon botën. Fol sot për diçka të rëndësishme.",
    "Empatia jote + analiza jote = kombinim i jashtëzakonshëm. Ku mund ta zbatosh sot me ndikimin më të madh?",
  ],
  LUMEN: [
    "Bota e brendshme jote është e pasur — por ajo ka nevojë të ekspozet. Çfarë krijonave sot që nuk e ke ndarë kurrë?",
    "Krijimtaria jote lind nga ndjeshmëria. Por ndjeshmëria pa kufij konsumon. Caktoi hapësirë krijuese me afat sot.",
    "Ëndrrat e tua meritojnë realitet. Cila ëndërr e vogël mund të bëhet hap konkret sot?",
  ],
  BLOOM: [
    "Shëron të tjerët natyrshëm — por trupi dhe shpirti yt kanë nevojë për shërim po ashtu. Çfarë do të bëje sot nëse bëje gjithçka për veten?",
    "Altruizmi yt është bujar — por altruizmi i qëndrueshëm buron nga bollëku, jo nga boshëllëku. Sot mbush rezervat e tua.",
    "Prania jote shëron — por di vlerën e asaj pranie? Pyetu: sa vlerëson veten sot?",
  ],
  STONE: [
    "Pavarësia jote është forta — por forca e vërtetë pranon kur ka nevojë për ndihmë. A ka diçka sot ku mund të kërkosh mbështetje?",
    "Ti sheh qartë kur të tjerët panikosen. Sot shpjegoji dikujt si i percepton situatën — do të habitesh nga ndikimi.",
    "Izolimi yt të mbron — por gjithashtu të kufizuon. Sot bëj 1 lëvizje drejt 1 personi. Vetëm 1.",
  ],
  KEEL: [
    "Cilësia e punës tënde flet vetë — por ke dy dhëna: edhe unë duhet të flas. Sot promovohu pak.",
    "Durim dhe qëndrueshmëri — aftësi të rralla. Por a je duke ndërtuar gjënë e duhur me ato aftësi? Kontrollo drejtimin.",
    "Specializimi yt i thellë është aset — por bota ndryshon shpejt. Çfarë aftësie të re po ndërtoni sot, qoftë dhe 10 minuta?",
  ],
  APEX: [
    "Inovacioni jot kërkon vëmendjen e të tjerëve — jo leje, por komunikim. Sot gjej 1 mënyrë për ta shprehur vizionin tënd qartë.",
    "Mendon 5 hapa para të tjerëve — kjo është dhuratë dhe e ngërmëse. Sot gjej dikë të afërt me mendjemprehtësi të ngjashme dhe lidhuni.",
    "Pavarësia jote është forcë — por bashkëpunimi me njerëzit e duhur shumëzon fuqinë. Kë do të zgjidhje si partner ideal?",
  ],
  ECHO: [
    "Vëzhgimet e tua janë të thella — por mbeten brenda. Sot shprehë 1 vëzhgim me dikë të besuar.",
    "Heshtja jote flet — por jo gjithkush e dëgjon. Gjej formën (shkrim, art, bisedë) dhe nda diçka nga bota jote e brendshme.",
    "Ekuilibri jot i brendshëm është ndërtuar me vite — dhe është aset i rrallë. Si mund ta ndash atë ekuilibër me dikë tjetër sot?",
  ],
}

// ─── Weekly Insight Templates ─────────────────────────────────────
export const WEEKLY_INSIGHTS = [
  "Tipi yt tregon forcë të veçantë ndaj emocioneve komplekse — ke menaxhuar shumë mirë tensionin këtë javë.",
  "Sfida jote kryesore kjo javë ishte konsistenca. Gjëja e vogël e bërë çdo ditë ndryshon gjithçka.",
  "Komunikimi jot është duke u zhvilluar — njerëzit ndihen gjithnjë e më shumë të kuptuar prej teje.",
  "Energjia jote sociale shpenzoi shumë gjatë kësaj jave — planifiko kohë vetie javën e ardhshme.",
  "Vendimmarrja jote u bë 23% më e shpejtë bazuar në sfidën ditore. Muskuli analitik po forcohet.",
  "Pattern i ri i zbuluar: reagoni intensivisht kur planifikimi prishet. Kjo është informacion, jo defekt.",
  "Kreativiteti yt preku kulmin javën e kaluar — identifikuam 3 momente kur mendes jashtë kufijve.",
  "Rezistenca jote ndaj stresit po rritet — kjo tregon të dhënat e check-in-it ditor.",
]

// Helper: get challenges for today (deterministic by date + archetype)
export function getDailyChallenges(archetypeCode, count = 3) {
  const dayNumber = Math.floor(Date.now() / 86400000)
  // Simple deterministic shuffle using day number as seed
  const seed = dayNumber * 2654435761
  const shuffled = [...CHALLENGE_POOL].sort((a, b) => {
    const ha = Math.imul(seed, a.id.charCodeAt(2) + 1) >>> 0
    const hb = Math.imul(seed, b.id.charCodeAt(2) + 1) >>> 0
    return ha - hb
  })
  return shuffled.slice(0, count)
}

// Helper: compute level from XP
export function getLevelFromXP(xp) {
  for (let i = EVOLUTION_LEVELS.length - 1; i >= 0; i--) {
    if (xp >= EVOLUTION_LEVELS[i].minXP) return EVOLUTION_LEVELS[i]
  }
  return EVOLUTION_LEVELS[0]
}

// Helper: next level XP thresholds
export function getXPProgress(xp) {
  const current = getLevelFromXP(xp)
  const nextLevel = EVOLUTION_LEVELS[current.level + 1]
  if (!nextLevel) return { current, pct: 100, xpInLevel: xp - current.minXP, needed: 0 }
  const xpInLevel = xp - current.minXP
  const needed    = nextLevel.minXP - current.minXP
  return { current, nextLevel, pct: Math.round((xpInLevel / needed) * 100), xpInLevel, needed }
}
