// ============================================================
// NEUROSPACE — Psychological Testing Data & Scoring Functions
// ============================================================

// ─── PERSONALITY TEST (Big Five / OCEAN, 12 questions) ──────
export const PERSONALITY_TEST = {
  id: 'personality',
  title: 'Testi i Personalitetit',
  subtitle: 'Bazuar në modelin Big Five (OCEAN)',
  emoji: '🧠',
  duration: '5 min',
  questionCount: 12,
  color: '#7c3aed',
  gradient: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
  softBg: '#f5f3ff',
  questions: [
    {
      id: 1,
      trait: 'O',
      text: 'Kur ke kohë të lirë, çfarë preferon?',
      options: [
        { label: 'Qëndroj shtëpi dhe relaksohem', score: 1 },
        { label: 'Dal me miq të njohur', score: 2 },
        { label: 'Eksploroj diçka të re', score: 3 },
        { label: 'Lexoj ose krijoj diçka', score: 4 },
      ],
    },
    {
      id: 2,
      trait: 'C',
      text: 'Si e organizon punën tënde?',
      options: [
        { label: 'Pa plan — vepron sipas momentit', score: 1 },
        { label: 'Lista të shkurtra dhe të thjeshta', score: 2 },
        { label: 'Plan i qartë dhe i strukturuar', score: 3 },
        { label: 'Sistem rigoroz me prioritete dhe afate', score: 4 },
      ],
    },
    {
      id: 3,
      trait: 'E',
      text: 'Në mbledhje grupore zakonisht...',
      options: [
        { label: 'Dëgjoj dhe flas shumë pak', score: 1 },
        { label: 'Flas vetëm kur pyetem drejtpërdrejt', score: 2 },
        { label: 'Kontribuoj aktivisht në diskutim', score: 3 },
        { label: 'Marr iniciativën dhe drejtoj bisedën', score: 4 },
      ],
    },
    {
      id: 4,
      trait: 'A',
      text: 'Kur dikush ka nevojë për ndihmë...',
      options: [
        { label: 'Vë veten dhe nevojat e mia të parë', score: 1 },
        { label: 'Ndihmoj nëse kam kohë të lirë', score: 2 },
        { label: 'Gjithmonë kërkoj mënyra për të ndihmuar', score: 3 },
        { label: 'Vë nevojat e tjetrit para nevojave të mia', score: 4 },
      ],
    },
    {
      id: 5,
      trait: 'N',
      text: 'Sa shpesh ndihesh stresuar ose i/e shqetësuar?',
      options: [
        { label: 'Rrallë — jam zakonisht i/e qetë', score: 1 },
        { label: 'Ndonjëherë, në situata të vështira', score: 2 },
        { label: 'Shpesh, edhe pa arsye të qartë', score: 3 },
        { label: 'Pothuajse gjithmonë — ndihem nën presion', score: 4 },
      ],
    },
    {
      id: 6,
      trait: 'O',
      text: 'Sa të tërheq krijimtaria dhe artet?',
      options: [
        { label: 'Pak — preferoj gjërat praktike', score: 1 },
        { label: 'Mesatarisht — i/e vlerësoj por nuk praktikoi', score: 2 },
        { label: 'Shumë — kërkoj shpesh të shprehem', score: 3 },
        { label: 'Është pasioni im kryesor në jetë', score: 4 },
      ],
    },
    {
      id: 7,
      trait: 'C',
      text: 'Sa shpesh i plotëson detyrat para afatit të fundit?',
      options: [
        { label: 'Rrallë — zakonisht punoj nën presion', score: 1 },
        { label: 'Ndonjëherë — varet nga rëndësia', score: 2 },
        { label: 'Shpesh — preferoj të jem i/e para', score: 3 },
        { label: 'Gjithmonë — e planifikoj në mënyrë të saktë', score: 4 },
      ],
    },
    {
      id: 8,
      trait: 'E',
      text: 'Pas një dite sociale të gjatë si ndihesh?',
      options: [
        { label: 'I/E lodhur — dua vetmi dhe heshtje', score: 1 },
        { label: 'Neutral — nuk ndihem shumë i/e ndryshuar', score: 2 },
        { label: 'Mjaft mirë — socialiizimi më energjizon', score: 3 },
        { label: 'I/E gjallëruar — dua të vazhdoj!', score: 4 },
      ],
    },
    {
      id: 9,
      trait: 'A',
      text: 'Kur dikush nuk pajtohet me mendimin tënd...',
      options: [
        { label: 'Mbroj mendimin tim me forcë', score: 1 },
        { label: 'Dëgjoj por rrallë ndryshoj mendim', score: 2 },
        { label: 'Diskutoj hapur dhe konsideroj perspektivën e tyre', score: 3 },
        { label: 'Lëshoj pe shpesh për të shmangur konfliktin', score: 4 },
      ],
    },
    {
      id: 10,
      trait: 'N',
      text: 'Sa shpesh rikonsideron vendimet e marra?',
      options: [
        { label: 'Rrallë — pranoj vendimin dhe vazhdoj', score: 1 },
        { label: 'Ndonjëherë, për vendime të rëndësishme', score: 2 },
        { label: 'Shpesh — shqetësohem për zgjedhjet e bëra', score: 3 },
        { label: 'Vazhdimisht — kurrë nuk ndjehem plotësisht i/e sigurt', score: 4 },
      ],
    },
    {
      id: 11,
      trait: 'O',
      text: 'Sa gati je për përvoja krejtësisht të reja dhe të panjohura?',
      options: [
        { label: 'Preferoj të njohurën dhe të sigurtën', score: 1 },
        { label: 'Me kujdes — nëse rreziku është i ulët', score: 2 },
        { label: 'Shpesh kërkoj sfidat dhe risitë', score: 3 },
        { label: 'Gjithmonë me entuziazëm — dashuroj aventurën!', score: 4 },
      ],
    },
    {
      id: 12,
      trait: 'C',
      text: 'Si i menaxhon prioritetet ditore?',
      options: [
        { label: 'Spontanisht — vepro sipas asaj që ndodh', score: 1 },
        { label: 'Ndjej instinktivisht çfarë duhet bërë', score: 2 },
        { label: 'Mendoj logjikisht dhe rendit sipas rëndësisë', score: 3 },
        { label: 'Sistem i saktë me listë, orë dhe nëndetyra', score: 4 },
      ],
    },
  ],
  profiles: [
    {
      id: 'creator',
      name: 'Krijuesi Vizionar',
      emoji: '🎨',
      color: '#7c3aed',
      condition: (traits) => traits.O >= 70,
      desc: 'Ti je një mendimtar i lirë dhe origjinal me kuriozitet të pafund. Imagjinata jote është mjeti yt më i fuqishëm — e sheh botën ndryshe nga të tjerët dhe kjo është dhurata jote. Tërhiqesh nga idete e reja, vlerëson bukurinë në forma të ndryshme dhe ke aftësinë të lidh gjëra që nuk duken të lidhura. Kreativiteti nuk është thjesht çfarë bën — është mënyra si mendon.',
      strengths: ['Kreativitet i lartë', 'Kuriozitet i hapur', 'Mendim divergjent'],
      tip: 'Kanalos energjinë tënde krijuese në projekte konkrete. Vendos struktura të lehta për të kthyer idetë e mëdha në rezultate reale — kreativiteti lulëzon kur ka formë.',
    },
    {
      id: 'organizer',
      name: 'Organizatori i Saktë',
      emoji: '📋',
      color: '#0891b2',
      condition: (traits) => traits.C >= 70,
      desc: 'Ti je personi mbi të cilin të tjerët mbështeten. Koshiencuese dhe e besueshme, i qasesh çdo detyre me vëmendje dhe disiplinë. Njerëzit e ditur e dinë se kur diçka kalon nëpër duart e tua, do të bëhet saktë dhe në kohë. Ke aftësinë e rrallë të transformosh kaos në rend — dhe kjo vleri nuk ka çmim.',
      strengths: ['Disiplinë e brendshme', 'Besueshmëri e lartë', 'Menaxhim i shkëlqyer i kohës'],
      tip: 'Mos lejo perfeksionizmin të bëhet pengesë. Ndonjëherë "mjaftueshëm mirë dhe brenda afatit" ka vlerë më të madhe se "perfekt por me vonesë". Lejo veten të eksperimentosh.',
    },
    {
      id: 'connector',
      name: 'Lidhësi Shoqëror',
      emoji: '🤝',
      color: '#059669',
      condition: (traits) => traits.E >= 65 || traits.A >= 65,
      desc: 'Ti je zemra e çdo grupi. Njerëzit tërhiqen nga warmth-i yt dhe aftësia jote për t\'i bërë të gjithë të ndihen të parë dhe të vlerësuar. Ke inteligjencë emocionale të lartë dhe di instinktivisht si të ndërtosh ura mes njerëzve. Talenti yt i vërtetë qëndron në krijimin e lidhjeve që zgjasin.',
      strengths: ['Inteligjencë emocionale', 'Komunikim autentik', 'Empati e thellë'],
      tip: 'Kujdosu që të mos harrojë nevojat e tua ndërkohë që kujdesesh për të tjerët. Vendos kufij të shëndetshëm — dashuria për veten është themeli i dashurisë për të tjerët.',
    },
    {
      id: 'thinker',
      name: 'Mendimtari Analitik',
      emoji: '🔬',
      color: '#dc2626',
      condition: (traits) => traits.N >= 65,
      desc: 'Ti ndjen botën shumë thellë. Ndjeshmëria jote e lartë është edhe forca edhe sfida jote — të jep aftësinë të kuptosh nuancat emocionale që të tjerët i humbin, por edhe të ndjesh presionin e situatave me intenzitet të madh. Analizon, reflekton dhe kurrë nuk e pranon gjërat sipërfaqësisht.',
      strengths: ['Ndjeshmëri e lartë', 'Vetëdijë emocionale', 'Thellësi mendimi'],
      tip: 'Praktiko teknikat e rregullimit emocional si meditimi ose journaling. Shndërroje ndjeshmërinë tënde nga burim stresi në burim forcë duke i dhënë kuptim emocioneve.',
    },
    {
      id: 'balanced',
      name: 'Ekuilibri i Natyrshëm',
      emoji: '⚖️',
      color: '#d97706',
      condition: () => true,
      desc: 'Ti je shembulli i ekuilibrit autentik. S\'ke tipare ekstreme — dhe kjo është force e madhe, jo mungesë identiteti. Adaptohen me lehtësi në role të ndryshme, sillesh mirë si në mjedise sociale ashtu edhe në vetmi, dhe njerëzit e ndiejnë stabilitetin tuaj si diçka të rrallë dhe të çmuar.',
      strengths: ['Adaptueshmëri e lartë', 'Ekuilibër emocional', 'Versatilitet i brendshëm'],
      tip: 'Ekuilibri yt është aset i rrallë — mos e nënvlerëso. Eksploro zona specifike ku dëshiron të rritesh dhe mos ki frikë të dalësh nga zona e komfortit për të zbuluar pasione të reja.',
    },
  ],
}

// ─── MOOD TEST (PANAS-inspired, 8 items) ────────────────────
export const MOOD_TEST = {
  id: 'mood',
  title: 'Gjendja Emocionale',
  subtitle: 'Bazuar në shkencën afektive (PANAS)',
  emoji: '💛',
  duration: '2 min',
  questionCount: 8,
  color: '#f59e0b',
  gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)',
  softBg: '#fffbeb',
  items: [
    { id: 'excited',   label: 'I/E gëzuar',     type: 'positive', emoji: '😊' },
    { id: 'energetic', label: 'Energjik/e',      type: 'positive', emoji: '⚡' },
    { id: 'inspired',  label: 'I/E frymëzuar',   type: 'positive', emoji: '✨' },
    { id: 'confident', label: 'I/E sigurt',       type: 'positive', emoji: '💪' },
    { id: 'stressed',  label: 'I/E stresuar',    type: 'negative', emoji: '😰' },
    { id: 'anxious',   label: 'I/E shqetësuar',  type: 'negative', emoji: '😟' },
    { id: 'tired',     label: 'I/E lodhur',       type: 'negative', emoji: '😴' },
    { id: 'irritated', label: 'I/E irrituar',    type: 'negative', emoji: '😤' },
  ],
  scaleLabels: ['Aspak', 'Pak', 'Mesatarisht', 'Shumë', 'Jashtëzakonisht'],
  profiles: [
    {
      id: 'thriving',
      name: 'Lulëzim Emocional',
      emoji: '🌟',
      color: '#059669',
      condition: (pa, na) => pa >= 3.5 && na < 2.5,
      desc: 'Ti je në gjendjen tënde të lulëzimit! Energjia pozitive mbizotëron dhe emocionet negative janë nën kontroll. Ky moment është i çmuar — je i/e lidhur me veten, me njerëzit përreth teje dhe me qëllimet tuaja. Vazhdo të ushqesh gjërat që të sjellin këtë ndjesi dhe mos e merr si të mirëqenë.',
    },
    {
      id: 'calm',
      name: 'Qetësi e Ekuilibruar',
      emoji: '🌿',
      color: '#0891b2',
      condition: (pa, na) => pa >= 2.5 && na < 2.5,
      desc: 'Ndihesh qetë dhe i/e ekuilibruar. Nuk je në kulmin e emocioneve pozitive, por as negativet nuk të mbizotërojnë. Kjo gjendje qetësie është shumë e shëndetshme — të lejon të mendosh qartë, të marrësh vendime të mira dhe të kujdesesh për veten me pjekuri.',
    },
    {
      id: 'ambivalent',
      name: 'Ambivalencë Emocionale',
      emoji: '🌊',
      color: '#7c3aed',
      condition: (pa, na) => pa >= 3 && na >= 3,
      desc: 'Po përjeton njëkohësisht emocione pozitive dhe negative të forta — kjo quhet ambivalencë emocionale. Ndodh shpesh në momente tranzicioni, vendimesh të rëndësishme ose ndryshimesh të mëdha. Nuk është diçka e keqe — tregon thellësi emocionale. Lejo veten të procesosh të dyja palët pa u gjykuar.',
    },
    {
      id: 'tense',
      name: 'Tension Emocional',
      emoji: '⛈️',
      color: '#dc2626',
      condition: (pa, na) => na >= 3.5,
      desc: 'Emocionet negative janë të pranishme me intensitet të lartë tani. Kjo mund të jetë e rëndë, por kujto se emocionet janë kalimtare — nuk janë identiteti yt. Merr frymë thellë, kërko mbështetje nga të dashurit dhe kujdesu për nevojat bazë: gjumë, ushqim, lëvizje. Nëse ndjesia vazhdon, fol me dikë të besuar.',
    },
    {
      id: 'low',
      name: 'Energji e Ulët',
      emoji: '🌙',
      color: '#6b7280',
      condition: () => true,
      desc: 'Energjia jote është e ulët sot — si emocionalisht ashtu edhe fizikisht. Kjo nuk është dështim; trupi dhe mendja kanë nevojë për periudha pushimi dhe reflektimi. Trajtoje veten me butësi, bëj gjëra të vogla që të sjellin pak kënaqësi dhe mos vendo pritshmëri të larta për veten tani.',
    },
  ],
}

// ─── COGNITIVE TEST (5 logic/sequence/analogy questions) ─────
export const COGNITIVE_TEST = {
  id: 'cognitive',
  title: 'Kapaciteti Kognitiv',
  subtitle: 'Logjikë, kujtesë & njohje modelesh',
  emoji: '⚡',
  duration: '3 min',
  questionCount: 5,
  color: '#0891b2',
  gradient: 'linear-gradient(135deg, #0891b2, #0284c7)',
  softBg: '#ecfeff',
  questions: [
    {
      id: 1,
      type: 'sequence',
      text: 'Cili numër vjen tjetër në këtë varg?',
      display: '2 → 4 → 8 → 16 → ?',
      options: ['24', '32', '28', '20'],
      correct: '32',
      explanation: 'Çdo numër shumëzohet me 2. Prandaj 16 × 2 = 32.',
    },
    {
      id: 2,
      type: 'logic',
      text: 'Nëse të gjithë studentët janë njerëz, dhe disa njerëz janë artistë, atëherë...',
      display: null,
      options: [
        'Të gjithë studentët janë artistë',
        'Disa studentë mund të jenë artistë',
        'Asnjë student nuk është artist',
        'Të gjithë artistët janë studentë',
      ],
      correct: 'Disa studentë mund të jenë artistë',
      explanation: 'Silogjizëm klasik: mundësia ekziston (disa studentë mund të jenë artistë) por nuk është e detyrueshme. Kategoritë pjesërisht mund të mbivendosen.',
    },
    {
      id: 3,
      type: 'sequence',
      text: 'Cili numër mungon në këtë varg të famshëm?',
      display: '1 → 1 → 2 → 3 → 5 → 8 → ?',
      options: ['10', '11', '12', '13'],
      correct: '13',
      explanation: 'Vargu Fibonacci: çdo numër është shuma e dy të mëparshmëve. 5 + 8 = 13.',
    },
    {
      id: 4,
      type: 'analogy',
      text: 'Libri është për lexim, ashtu si lapsi është për...',
      display: null,
      options: ['Vizatim', 'Prerje', 'Ngjyrosje', 'Shkrim'],
      correct: 'Shkrim',
      explanation: 'Analogji funksionale: funksioni primar i lapsit është shkrimi, ashtu si funksioni primar i librit është leximi.',
    },
    {
      id: 5,
      type: 'logic',
      text: 'Nëse A > B dhe B > C, atëherë...',
      display: null,
      options: ['C > A', 'A = C', 'A > C', 'Nuk mund të konkludohet'],
      correct: 'A > C',
      explanation: 'Tranzitiviteti i pabarazive: nëse A > B dhe B > C, atëherë domosdoshmërisht A > C.',
    },
  ],
  profiles: [
    {
      id: 'analytical',
      name: 'Mendja Analitike',
      emoji: '🔬',
      color: '#0891b2',
      minScore: 4,
      desc: 'Ke aftësi të shkëlqyera analitike dhe logjike. Mund të ndjekësh modele komplekse, të arsyetosh me saktësi dhe të zgjidhësh probleme në mënyrë sistematike. Kjo mënyrë mendimi është aftësi e rrallë dhe e vlefshme — trajtoje si pasuri.',
    },
    {
      id: 'balanced',
      name: 'Mendja Ekuilibruar',
      emoji: '⚖️',
      color: '#7c3aed',
      minScore: 3,
      desc: 'Ke ekuilibër të mirë mes mendimit logjik dhe intuitiv. Arrin të ndjekësh arsyetimin formal kur të nevojitet, por edhe të besosh gjykimit të brendshëm. Ky kombinim të bën efektiv në situata të ndryshme.',
    },
    {
      id: 'intuitive',
      name: 'Mendja Intuitive',
      emoji: '💡',
      color: '#f59e0b',
      minScore: 2,
      desc: 'Mendja jote funksionon më mirë nëpërmjet intuitës dhe njohjes së modeleve holistike. Ndonjëherë arsyetimi formal mund të duket i kufizuar — por intuita e mirë edukuar është fuqi e jashtëzakonshme. Vazhdimi i praktikës logjike do të forcojë edhe më tej mendimin tënd.',
    },
    {
      id: 'developing',
      name: 'Potencial në Zhvillim',
      emoji: '🌱',
      color: '#059669',
      minScore: 0,
      desc: 'Çdo mendje e madhe ka filluar nga zero. Ky test është vetëm një moment — jo një gjykim i aftësisë tënde. Aftësitë logjike zhvillohen me ushtrim dhe durim. Fillo me sfida të vogla çdo ditë: enigma, logjikë, matematik. Ndryshimi do të vijë me kohë.',
    },
  ],
}

// ─── SCORING FUNCTIONS ────────────────────────────────────────

/**
 * Score the personality test.
 * @param {Object} answers - { questionId: score (1-4) }
 * @returns {{ scores: {O,C,E,A,N}, profile: Object, testId: string }}
 */
export function scorePersonality(answers) {
  const traits = { O: [], C: [], E: [], A: [], N: [] }

  PERSONALITY_TEST.questions.forEach((q) => {
    const s = answers[q.id]
    if (s !== undefined) traits[q.trait].push(s)
  })

  const avg = (arr) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 2)

  const scores = {}
  Object.entries(traits).forEach(([t, arr]) => {
    scores[t] = Math.round(((avg(arr) - 1) / 3) * 100)
  })

  const profile =
    PERSONALITY_TEST.profiles.find((p) => p.condition(scores)) ||
    PERSONALITY_TEST.profiles[4]

  return { scores, profile, testId: 'personality' }
}

/**
 * Score the mood test.
 * @param {Object} ratings - { itemId: 1-5 }
 * @returns {{ pa, na, paRaw, naRaw, profile, testId }}
 */
export function scoreMood(ratings) {
  const pos = MOOD_TEST.items
    .filter((i) => i.type === 'positive')
    .map((i) => ratings[i.id] || 1)
  const neg = MOOD_TEST.items
    .filter((i) => i.type === 'negative')
    .map((i) => ratings[i.id] || 1)

  const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length
  const pa = avg(pos)
  const na = avg(neg)

  const profile =
    MOOD_TEST.profiles.find((p) => p.condition(pa, na)) ||
    MOOD_TEST.profiles[4]

  return {
    pa: Math.round(pa * 20),
    na: Math.round(na * 20),
    paRaw: pa,
    naRaw: na,
    profile,
    testId: 'mood',
  }
}

/**
 * Score the cognitive test.
 * @param {Object} answers - { questionId: selectedOption }
 * @returns {{ correct, total, profile, testId }}
 */
export function scoreCognitive(answers) {
  let correct = 0
  COGNITIVE_TEST.questions.forEach((q) => {
    if (answers[q.id] === q.correct) correct++
  })

  const profile = [...COGNITIVE_TEST.profiles]
    .sort((a, b) => b.minScore - a.minScore)
    .find((p) => correct >= p.minScore)

  return {
    correct,
    total: COGNITIVE_TEST.questions.length,
    profile,
    testId: 'cognitive',
  }
}

// ─── LOCAL STORAGE HELPERS ────────────────────────────────────

const LS_KEY = 'ns_test_history'

/**
 * Persist a test result to localStorage (max 200 entries, newest first).
 * @param {Object} result
 */
export function saveTestResult(result) {
  try {
    const prev = JSON.parse(localStorage.getItem(LS_KEY) || '[]')
    prev.unshift({ ...result, completedAt: new Date().toISOString() })
    localStorage.setItem(LS_KEY, JSON.stringify(prev.slice(0, 200)))
  } catch {
    // Silently fail if localStorage is unavailable
  }
}

/**
 * Retrieve test history from localStorage.
 * @param {string} [testId] - Optional filter by test type
 * @returns {Array}
 */
export function getTestHistory(testId) {
  try {
    const all = JSON.parse(localStorage.getItem(LS_KEY) || '[]')
    return testId ? all.filter((r) => r.testId === testId) : all
  } catch {
    return []
  }
}
