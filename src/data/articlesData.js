export const CATEGORIES = ['Të gjitha', 'Ankth', 'Depresion', 'Mindfulness', 'Gjumë', 'Vetëbesim', 'Marrëdhënie', 'CBT', 'Neuroshkencë', 'Produktivitet', 'Mësim', 'Labs', 'Blog', 'Komunitet', 'Studim Rasti', 'Burime']

const LS_KEY = 'ns_landing_articles'

export function loadArticles() {
  try {
    const v = localStorage.getItem(LS_KEY)
    if (!v) return ARTICLES
    const saved = JSON.parse(v)
    const staticMap = new Map(ARTICLES.map(a => [a.id, a]))
    const savedIds = new Set(saved.map(a => a.id))
    // Merge: saved fields win for presentation, but static fields fill any gaps
    const merged = saved.map(s => ({ ...staticMap.get(s.id), ...s }))
    return [...merged, ...ARTICLES.filter(a => !savedIds.has(a.id))]
  } catch { return ARTICLES }
}

const CAT_COLORS = {
  'Ankth':         'bg-red-100 text-red-700',
  'Depresion':     'bg-blue-100 text-blue-700',
  'Mindfulness':   'bg-emerald-100 text-emerald-700',
  'Gjumë':         'bg-indigo-100 text-indigo-700',
  'Vetëbesim':     'bg-amber-100 text-amber-700',
  'Marrëdhënie':   'bg-pink-100 text-pink-700',
  'Neuroshkencë':  'bg-violet-100 text-violet-700',
  'CBT':           'bg-cyan-100 text-cyan-700',
  'Produktivitet': 'bg-orange-100 text-orange-700',
  'Mësim':         'bg-blue-100 text-blue-800',
  'Labs':          'bg-green-100 text-green-700',
  'Burime':        'bg-indigo-100 text-indigo-800',
  'Blog':          'bg-pink-100 text-pink-700',
  'Komunitet':     'bg-cyan-100 text-cyan-800',
  'Studim Rasti':  'bg-orange-100 text-orange-800',
}
export function getCatColor(cat) {
  return CAT_COLORS[cat] || 'bg-gray-100 text-gray-700'
}

export const ARTICLES = [
  /* ─── NEURO ──────────────────────────────────────────────────────── */
  {
    id: 1, platformCat: 'neuro',
    title: 'Çfarë ndodh në tru gjatë ankthit?',
    category: 'Ankth',
    excerpt: 'Zbuloni si reagimi "lufto ose ik" ndikon në trurin tuaj dhe strategjitë efektive për ta menaxhuar çdo ditë.',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=800&q=80',
    date: '10 Prill 2026', readTime: '5 min', author: 'NeuroSphera', featured: true,
    content: [
      'Kur jemi nën ankth, truri ynë aktivizon një sistem mbrojtës primitiv të quajtur "lufto ose ik". Ky sistem, i kontrolluar nga amigdala, një rajon i vogël por shumë i fuqishëm i trurit, mundëson reagimin e menjëhershëm ndaj rreziqeve.',
      'Amigdala lëshon sinjale që aktivizojnë gjëndrat mbiveshkore, duke çliruar adrenalina dhe kortizol. Këto hormone shkaktojnë rrahje të shpejtë të zemrës, frymëmarrje të shpejtë, tensionim muskulor dhe shumë simptoma të tjera fizike.',
      'Studimet neuroshkencore tregojnë se praktika e rregullt e mindfulness-it mund të zvogëlojë reagimin e amigdalës me deri në 30%, duke forcuar lidhjet me korteksin paraballor, pjesa "logjike" e trurit.',
      'Hapi i parë është vetëdijësimi: të njohësh simptomat e ankthit pa u frikësuar prej tyre. Ankthi nuk është i rrezikshëm, por i pakëndshëm. Kjo dallim i vogël konceptual mund të ndryshojë gjithçka.',
    ],
  },
  {
    id: 2, platformCat: 'neuro',
    title: 'Mindfulness: Si të jetosh në çastin e tanishëm',
    category: 'Mindfulness',
    excerpt: 'Teknikat e mindfulness-it mund të transformojnë mënyrën si përjetojmë stresin dhe ankthin e përditshëm.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80',
    date: '14 Prill 2026', readTime: '4 min', author: 'NeuroSphera', featured: true,
    content: [
      'Mindfulness-i nuk është vetëm meditim, por mënyra si i qasemi çdo momenti të jetës. Studimet klinike konfirmojnë se 8 javë praktikë e MBSR zvogëlon ndjeshëm simptomat e ankthit dhe depresionit.',
      'Teknika bazë: gjej 5 minuta çdo mëngjes. Ulje rehat, mbyll sytë, fokusohu vetëm tek frymëmarrja. Kur mendja të endet, dhe do të endet, thuaji vetes "mendim" dhe ktheje vëmendjen te frymëmarrja.',
      'Me kohë, kjo praktikë forcon aftësinë e vëzhgimit të mendimeve pa u identifikuar me to. Mëson të shohësh mendimet si "ngjarje mentale" kalimtare, jo si të vërteta absolute.',
    ],
  },
  {
    id: 3, platformCat: 'neuro',
    title: 'Gjumi dhe shëndeti mendor: Lidhja e fshehur',
    category: 'Gjumë',
    excerpt: 'Mungesa e gjumit dhe problemet mendore kanë lidhje të thellë. Zbuloni si të prishni ciklin negativ.',
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80',
    date: '18 Prill 2026', readTime: '6 min', author: 'NeuroSphera', featured: true,
    content: [
      'Gjumi nuk është luksi, por nevoja biologjike. Gjatë gjumit, truri "pastron" veten nga produktet mbetëse metabolike, konsolidon kujtimet dhe ripariston lidhjet nervore.',
      '75% e njerëzve me depresion raportojnë probleme gjumi. Por lidhja është bidireksionale: mungesa e gjumit gjithashtu shkakton simptoma depresive. Ky cikël vicioz mund të jetë shumë i vështirë për t\'u thyer.',
      'CBT-I (Terapia Kognitive-Sjellore për Insomninë) ka efektivitet të provuar shkencërisht dhe konsiderohet trajtimi i parë i linjës për insomninë kronike, edhe para ilaçeve.',
    ],
  },
  {
    id: 7, platformCat: 'neuro',
    title: 'Frymëmarrja si mjet kundër stresit',
    category: 'Mindfulness',
    excerpt: 'Teknikat e frymëmarrjes mund të qetësojnë sistemin nervor brenda minutave. Shkencërisht provuar.',
    image: 'https://images.unsplash.com/photo-1529543544282-ea669407fca3?auto=format&fit=crop&w=800&q=80',
    date: '27 Prill 2026', readTime: '4 min', author: 'NeuroSphera', featured: false,
    content: [
      'Frymëmarrja është e vetmja funksion autonome e trupit që mund ta kontrollojmë me vetëdije. Kjo na jep akses direkt në sistemin nervor autonom.',
      'Teknika 4-7-8: Frymëmarrje nëpër hundë për 4 sekonda, mbajtja e frymës për 7 sekonda, nxjerrje nëpër gojë për 8 sekonda. Tre cikle janë zakonisht mjaft.',
      'Frymëmarrja diafragmatike aktivizon nervin vagal, i cili ka rol qendror në qetësimin e sistemit nervor. Praktikoni 10 minuta çdo ditë për rezultate të matshme.',
    ],
  },
  {
    id: 8, platformCat: 'neuro',
    title: 'Depresioni: Kuptimi i vërtetë i sëmundjes',
    category: 'Depresion',
    excerpt: 'Depresioni nuk është "trishtim" dhe nuk zgjidhset "duke u gëzuar." Çfarë thotë neuroshkenca moderne.',
    image: 'https://images.unsplash.com/photo-1527866959630-8f781e0de0ac?auto=format&fit=crop&w=800&q=80',
    date: '28 Prill 2026', readTime: '7 min', author: 'NeuroSphera', featured: false,
    content: [
      'Depresioni klinik nuk është trishtim i zakonshëm. Është gjendje komplekse neurobiologjike që ndikon në strukturën dhe funksionin e trurit.',
      'Hulumtimet neuroshkencore tregojnë ndryshime të matshme: zvogëlim i hipokampusit, ndryshime në aktivitetin e korteksit paraballor, dhe çekuilibër i neurotransmetuesve si serotonina dhe dopamina.',
      'Trajtimi i kombinuar, psikoterapia dhe ilaçet kur indikohen, ka efektivitet të lartë. Por hapi i parë, kërkimi i ndihmës, shpesh është më i vështiri.',
    ],
  },
  {
    id: 9, platformCat: 'neuro',
    title: 'Neuroplasticitet: Si truri ndryshon gjatë gjithë jetës',
    category: 'Neuroshkencë',
    excerpt: 'Truri ynë nuk është i fiksuar: ai rimodëlohet çdo ditë. Zbuloni si ta drejtoni këtë ndryshim me vetëdije.',
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    date: '1 Maj 2026', readTime: '6 min', author: 'NeuroSphera', featured: true,
    content: [
      'Neuroplasticitet, aftësia e trurit për t\'u ristrukturuar fizikisht si përgjigje ndaj përvojës, është zbulimi më revolucionar i neuroshkencës moderne. Kundër besimit të dikurshëm, truri adulte ndryshon vazhdimisht.',
      'Çdo zakon i ri që ndërtojmë, çdo aftësi që mësojmë, çdo mendim që ripërsërisim krijon dhe forcon rrugë nervore. Rrugët e papërdorura dobësohen: "use it or lose it" është ligj biologjik.',
      'Meditimi i rregullt, ushtrimet fizike, gjumi adekuat dhe mësimi i aftësive të reja janë ndër stimujt më të fuqishëm të neuroplasticitetit. Mund të filloni sot: truri juaj është gati.',
    ],
  },

  /* ─── LEARNING ───────────────────────────────────────────────────── */
  {
    id: 10, platformCat: 'learning',
    title: 'Spaced Repetition: Shkenca e memorjes afatgjatë',
    category: 'Mësim',
    excerpt: 'Pse mësojmë gjëra dhe i harrojmë brenda ditësh? Spaced repetition e zgjidh këtë problem definitivisht.',
    image: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?auto=format&fit=crop&w=800&q=80',
    date: '2 Maj 2026', readTime: '5 min', author: 'NeuroSphera', featured: true,
    content: [
      '"Kurbëza e harresës" e Ebbinghaus-it tregon se harrojmë 70% të informacionit të ri brenda 24 orësh pa përsëritje. Spaced repetition lufton pikërisht këtë, duke rishikuar informacionin pikërisht kur jemi gati ta harrojmë.',
      'Sistemi funksionon kështu: herën e parë rishikohet pas 1 dite, pastaj pas 3 ditësh, pas 1 jave, 2 javësh, 1 muaji. Çdo rishikim i suksesshëm shton intervalin. Kjo optimizon kohën ndaj efektit.',
      'Anki dhe RemNote janë aplikacione falas që automatizojnë këtë proces me kartela dixhitale. 15-20 minuta çdo ditë zëvendëson orë të tëra studimi të zakonshëm.',
    ],
  },
  {
    id: 11, platformCat: 'learning',
    title: 'Active Recall: Teknika #1 e studentëve kampionë',
    category: 'Mësim',
    excerpt: 'Rileximi është iluzion studimi. Active recall, vetë-testimi aktiv, rrit retensionin me mbi 50%.',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
    date: '4 Maj 2026', readTime: '4 min', author: 'NeuroSphera', featured: false,
    content: [
      'Shumica e studentëve studiojnë duke rilexuar shënimet, teknikë e cila jep ndjenjën e familjaritetit por mëson pak. Active recall kërkon që të gjenerosh vetë informacionin nga memoria, jo të njohësh atë.',
      'Metoda praktike: Mbyll librin. Shkruaj çfarë mban mend nga kapitulli i fundit. Hap dhe kontrollo. Ky stres i vogël kognitiv forcon gjurmët nervore shumë më shumë se leximi pasiv.',
      'Studimet tregojnë se studentët që praktikohen me active recall çdo 3 ditë performojnë mesatarisht 50% më mirë në provime krahasuar me ata që rilexojnë. Rezultati qëndron edhe 6 muaj pas studimit.',
    ],
  },
  {
    id: 12, platformCat: 'learning',
    title: 'Feynman teknika: Mëso çdo gjë duke shpjeguar',
    category: 'Mësim',
    excerpt: 'Nëse nuk mund ta shpjegosh thjeshtë, nuk e ke kuptuar vërtet. Richard Feynman e dinte këtë para të gjithëve.',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80',
    date: '6 Maj 2026', readTime: '5 min', author: 'NeuroSphera', featured: false,
    content: [
      'Richard Feynman, fizikant nobelist, kishte një sekret: ai mësonte çdo koncept duke u munduar ta shpjegonte si t\'ia shpjegonte një fëmije 12 vjeç. Kur ngelej, kuptonte saktësisht ku ishin boshllëqet e tij.',
      'Hapat: (1) Shkruaj konceptin. (2) Shpjegoje me fjalë të thjeshta sikur i flet dikujt pa njohuri. (3) Gjej pikat ku "ngec" ose bëhesh konfuz. (4) Kthehu te burimi dhe plotëso boshllëqet. (5) Simplifiko gjuhën edhe më shumë.',
      'Kjo teknikë ndahet nga rileximi sepse zbuloni gaps reale në kuptim, jo në memorizim. Është e papëlqyer por jashtëzakonisht efektive.',
    ],
  },

  /* ─── FOCUS ──────────────────────────────────────────────────────── */
  {
    id: 13, platformCat: 'focus',
    title: 'Deep Work: 4 orë fokus i plotë ndryshojnë gjithçka',
    category: 'Produktivitet',
    excerpt: 'Cal Newport argumenton: aftësia për të punuar pa distraftime është super-fuqi e shekullit 21. Ja si e ndërtoni.',
    image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80',
    date: '3 Maj 2026', readTime: '6 min', author: 'NeuroSphera', featured: true,
    content: [
      'Cal Newport definon "deep work" si aktivitet profesional kryer në gjendje të koncentrimit të lartë, pa distraftime, aktivitet që shtyj kapacitetet kognitive deri në limit dhe krijon vlerë të lartë.',
      'Truri human nuk është dizenjuar për multitasking. Çdo kalim ndërmjet detyrave (task-switching) kushton 23 minuta rikuperim mesatarisht. Katër orë deep work të vërteta prodhojnë më shumë se 8 orë punë me ndërprerje.',
      'Protokolli bazë: Bloko 2-4 orë në mëngjes. Asnjë email, telefon, njoftim. Filloje me detyren më të vështirë. Puna e thellë është muskul: ndërtohet gradualisht, duke filluar nga 90 minuta.',
    ],
  },
  {
    id: 14, platformCat: 'focus',
    title: 'Flow State: Neuroshkenca e produktivitetit maksimal',
    category: 'Produktivitet',
    excerpt: 'Çfarë ndodh në tru kur jemi "në zonë" dhe si ta aktivizojmë këtë gjendje me vetëdije çdo ditë?',
    image: 'https://images.unsplash.com/photo-1485988412941-77a8a93ab3a8?auto=format&fit=crop&w=800&q=80',
    date: '5 Maj 2026', readTime: '5 min', author: 'NeuroSphera', featured: false,
    content: [
      'Mihaly Csikszentmihalyi përshkroi "flow" si gjendjën optimale të eksperiencës: kur jemi plotësisht të zhytur në aktivitet, koha ikën, ndihemi të fuqishëm dhe punojmë në kapacitetin tonë maksimal.',
      'Neuroshkencërisht, flow-i karakterizohet nga transient hypofrontality, ulje e aktivitetit të korteksit paraballor (zëri vetëkritik), dhe lëshim masiv i dopaminës, norepinefrinës dhe serotoninës.',
      'Kushtet për flow: detyrë me sfidë të ekuilibruar (jo shumë e lehtë, jo shumë e vështirë), qëllime të qarta, dhe feedback i menjëhershëm. Eleminoni distraksionet 10 minuta para se të filloni punën e rëndë.',
    ],
  },
  {
    id: 15, platformCat: 'focus',
    title: 'Prokrastinami: Shkaqet biologjike dhe mënyra e çlirimit',
    category: 'Produktivitet',
    excerpt: 'Prokrastinami nuk është dembelësi, por rregullim emocional. Kuptimi i kësaj ndryshon gjithçka.',
    image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&w=800&q=80',
    date: '7 Maj 2026', readTime: '5 min', author: 'NeuroSphera', featured: false,
    content: [
      'Hulumtimet e Dr. Fuschia Sirois tregojnë: prokrastinami nuk ka të bëjë me menaxhimin e kohës, por me menaxhimin e emocioneve negative që lidhen me detyrën (ankth, boredom, dyshim).',
      'Truri preferon shpërblim të menjëhershëm (scrolling social media) ndaj shpërblimit afatgjatë (projekti i përfunduar). Amigdala e sheh detyrën e vështirë si "kërcënim" dhe aktivizon shmangien.',
      'Zgjidhja: Teknika 2-minutësh: nëse diçka merr më pak se 2 minuta, bëje menjëherë. "Eat the frog": bëje detyrën më të rëndë të parën çdo mëngjes. Body doubling: punoni pranë dikujt tjetër fizikisht ose virtualisht.',
    ],
  },

  /* ─── LABS ───────────────────────────────────────────────────────── */
  {
    id: 16, platformCat: 'labs',
    title: 'Sfida 30-ditore e meditimit: Çfarë ndodh me trurin',
    category: 'Labs',
    excerpt: 'Ndërmora sfidën: 10 minuta meditim çdo ditë për 30 ditë. Rezultatet me skanim MRI ishin të papritura.',
    image: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=800&q=80',
    date: '8 Maj 2026', readTime: '7 min', author: 'NeuroSphera', featured: true,
    content: [
      'Sara Lazar nga Harvard studioi trurin e medituesve me MRI dhe gjeti: pas 8 javësh praktikë ditore, korteksi paraballor u trashës me 5%, hipokampusi u rrit, dhe amigdala u bë më pak reaktive ndaj stresit.',
      'Protokolli i sfidës: Javët 1-2: 5 minuta body scan çdo mëngjes. Javët 3-4: 10 minuta focused attention (frymëmarrje). Javët 5-8: 15-20 minuta open monitoring. Vendos timer, mos kontrol telefon deri pas.',
      'Rezultatet e pritura: gjumë më cilësor pas javës 2, reagim më i qetë ndaj stresit pas javës 4, ndryshime të matshme kognitive (vëmendje, memorie pune) pas javës 8. Dokumento çdo ditë me vlerësim 1-10 të humorit.',
    ],
  },
  {
    id: 17, platformCat: 'labs',
    title: 'Biohacking i thjeshtë: 5 protokolle me prova shkencore',
    category: 'Labs',
    excerpt: 'Biohacking nuk do të thotë implante dhe suplemente ekzotike. Këtu janë 5 intervenime me bazë solide shkencore.',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80',
    date: '10 Maj 2026', readTime: '6 min', author: 'NeuroSphera', featured: false,
    content: [
      '(1) Ekspozimi ndaj dritës së mëngjesit: 10 minuta jashtë brenda 1 ore pas zgjimit. Sinton ciklin cirkadian, rrit kortizolin matinal (energji), dhe përmirëson gjumin natën.',
      '(2) Dushi i ftohtë 2 minuta: Rrit norepinefrinën me 300%, aktivizon yndyrën kafe, përmirëson disponimin. (3) Ushtrime HIIT 20 min: Rrit BDNF, "plehëror i trurit", më shumë se çdo farmakon.',
      '(4) Time-restricted eating 16:8: Jo diete, thjesht hani brenda 8 orëve. Rrit ndjeshmërinë ndaj insulinës dhe autofaginë. (5) Temperatura e dhomës 18-19°C natën: Optimizon gjumin deep dhe lëshimin e hormonit të rritjes.',
    ],
  },

  /* ─── CASES ──────────────────────────────────────────────────────── */
  {
    id: 18, platformCat: 'cases',
    title: 'Nga burnout-i te ringjallja: Historia e Arianit',
    category: 'Studim Rasti',
    excerpt: 'Pas 3 vitesh si software engineer nën presion ekstrem, Arianit u gjet me zero energji. Çfarë bëri pastaj.',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    date: '9 Maj 2026', readTime: '8 min', author: 'NeuroSphera', featured: true,
    content: [
      'Arianit, 32 vjeç, punonte 70 orë në javë si engineer seniore. Karriera shkonte shkëlqyeshëm, por brenda pak muajsh nuk mund të punonte as 4 orë pa ndjenjë shtypëse lodhje dhe indiference totale.',
      'Diagnoza: burnout-i i fazës III, jo thjesht stres, por kolaps i burimeve kognitive dhe emocionale. Mjekët i thanë: "Nëse nuk ndalen, do t\'ju duhen 2 vjet rikuperim." Arii zgjodhi të ndalet.',
      'Hapat e rikuperimit: 3 javë pushim të plotë (pa email). Terapia javore CBT. Reintroduktimi gradual i punës (4 orë/ditë). Kufijtë e ngurtë (jo takime pas orës 18:00). Sot, 18 muaj më vonë, punon 40 orë/javë dhe ka 3x prodhimtari.',
    ],
  },
  {
    id: 19, platformCat: 'cases',
    title: 'Si ndërtova zakonet e mia brenda 90 ditësh: Eksperiencë personale',
    category: 'Studim Rasti',
    excerpt: 'Nuk kisha asnjë zakon të mirë të qëndrueshëm. Pas 90 ditësh eksperimentimi me metoda shkencore, ja çfarë funksionoi.',
    image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=800&q=80',
    date: '11 Maj 2026', readTime: '7 min', author: 'NeuroSphera', featured: false,
    content: [
      'Ditën 1: fillova me 3 zakone: ushtrim 20 min, lexim 15 min, meditim 5 min. Ditën 14 ishte shumë dhe shtova vetëm ushtrimet. Mësimi i parë: mos fillo shumë gjëra njëkohësisht.',
      '"Habit stacking" u bë arma ime: ushtrimet menjëherë pas kafesë së mëngjesit (cue ekzistuese → zakoni i ri). Leximi para gjumit (cue: shtrat). Meditimi pas ushtrimeve (cue: fundja e ushtrimeve).',
      'Pas 90 ditësh: ushtrimet u bënë automatike (ndjej mungesë kur s\'i bëj), leximi arriti 22 libra në vit, meditimi u bë 10 minuta çdo ditë. Çelësi: e bëra çdo zakon aq të vogël sa nuk kishte justifikim ta anuloja.',
    ],
  },

  /* ─── RESOURCES ──────────────────────────────────────────────────── */
  {
    id: 20, platformCat: 'resources',
    title: '10 libra bazë: Neuroshkencë, psikologji & produktivitet',
    category: 'Burime',
    excerpt: 'Lista e kuruar me kujdes nga ekipi ynë: librat që kanë ndikuar më shumë mbi shkencën dhe vetë-zhvillimin.',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80',
    date: '1 Maj 2026', readTime: '4 min', author: 'NeuroSphera', featured: true,
    content: [
      '"Thinking, Fast and Slow" (Kahneman): sistemi 1 dhe 2 i mendimit. "The Brain That Changes Itself" (Doidge): histori neuroplasticiteti. "Atomic Habits" (Clear): sistemi shkencor i zakoneve. "Why We Sleep" (Walker): gjumi dhe shkenca.',
      '"Deep Work" (Newport): fokusi si super-fuqi. "The Body Keeps the Score" (van der Kolk): trauma dhe truri. "Thinking in Systems" (Meadows): të menduarit sistemik. "Flow" (Csikszentmihalyi): psikologjia e eksperiencës optimale.',
      '"Behave" (Sapolsky): biologjia e sjelljes njerëzore. "The Happiness Hypothesis" (Haidt): filozofia e lumturisë tek neuroshkenca. Të gjitha disponohen si audiobook; filloni me Kahneman ose Clear.',
    ],
  },
  {
    id: 21, platformCat: 'resources',
    title: 'Podcast-et shkencore që duhet të dëgjoni çdo javë',
    category: 'Burime',
    excerpt: 'Nga neuroshkenca te psikologjia praktike: podcast-et me cilësinë më të lartë shkencore, të kuruar nga ekspertët tanë.',
    image: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=800&q=80',
    date: '3 Maj 2026', readTime: '3 min', author: 'NeuroSphera', featured: false,
    content: [
      '"Huberman Lab" (Andrew Huberman): Protokolle praktike bazuar mbi neuroshkencë. Episodet mbi gjumin, foksin dhe stres janë referenca absolute. "The Tim Ferriss Show": Intervista me ekpertët botërorë mbi zakonet dhe metodologjitë.',
      '"Hidden Brain" (NPR): Psikologjia e sjelljes njerëzore shpjeguar në mënyrë narrative. Perfekte për vozitje. "Lex Fridman Podcast": Biseda të gjata me shkencëtarë dhe mendimtarë mbi neuroshkencë, AI dhe filozofi.',
      '"Feel Better, Live More" (Dr. Rangan Chatterjee): Neuroshkencë praktike për jetën e përditshme. Episodet më të mira: mbi gjumin, ushqimin dhe stres. Të gjitha disponohen falas në Spotify dhe Apple Podcasts.',
    ],
  },
  {
    id: 22, platformCat: 'resources',
    title: 'Aplikacione falas të verifikuara për mendjen dhe produktivitetin',
    category: 'Burime',
    excerpt: 'Nuk keni nevojë të paguani shumë: këto aplikacione falas ofrojnë veçori shkencore të provuara.',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80',
    date: '5 Maj 2026', readTime: '4 min', author: 'NeuroSphera', featured: false,
    content: [
      'Meditim: "Insight Timer" (falas, 150K+ meditacione). "Waking Up" (10 ditë falas, gjuha shkencore). Gjurmim humori: "Daylio" (falas, log i shpejtë), "Bearable" (korrelacione të avancuara).',
      'Spaced Repetition: "Anki" (falas, platforma standard). "RemNote" (integruar me shënime). Fokus: "Forest" (falas version bazë), "Freedom" (blloko website-t distrahuese). Gjumë: "Sleep Cycle" (analizë pa pagesë).',
      'Ushtrimi: "Nike Training Club" (plotësisht falas). "7 Minute Workout" (HIIT i bazuar shkencërisht). Lexim: "Libby" (libra falas nga biblioteka). "Blinkist" (15 min/libër, version falas i kufizuar).',
    ],
  },

  /* ─── BLOG ───────────────────────────────────────────────────────── */
  {
    id: 4, platformCat: 'blog',
    title: 'CBT: Si të ndryshosh mendimet negative',
    category: 'CBT',
    excerpt: 'Terapia Kognitive-Sjellore është ndër metodat më të studiuara. Mëso si ta zbatosh vetë çdo ditë.',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80',
    date: '20 Prill 2026', readTime: '7 min', author: 'NeuroSphera', featured: false,
    content: [
      'CBT bazohet në idenë se mendimet, ndjenjat dhe sjelljet janë të ndërlidhura. Nëse ndryshon mënyrën si mendon, ndryshon si ndihesh dhe si sillesh.',
      'Hapi i parë: identifikimi i "mendimeve automatike negative" (MAN). Hapi i dytë: sfidimi i këtyre mendimeve, "A ka prova kundër? Si do ta shikonte dikush tjetër?". Hapi i tretë: zëvendësimi me mendime realiste.',
      'CBT ka bazë të gjerë shkencore: mbi 2,000 studime klinike konfirmojnë efektivitetin e saj. Mund të mësohet vetë me udhëzues, por terapisti i specializuar e bën procesin shumë më të shpejtë.',
    ],
  },
  {
    id: 5, platformCat: 'blog',
    title: 'Vetëbesimi: Ku fillon dhe si ndërtohet',
    category: 'Vetëbesim',
    excerpt: 'Vetëbesimi nuk është diçka që ose e ke ose nuk e ke: është aftësi që ndërtohet me kohë dhe praktikë të vazhdueshme.',
    image: 'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?auto=format&fit=crop&w=800&q=80',
    date: '22 Prill 2026', readTime: '5 min', author: 'NeuroSphera', featured: false,
    content: [
      'Shumë njerëz besojnë se vetëbesimi vjen spontanisht. Por kjo është mit. Vetëbesimi është si muskuli: forcohet me ushtrim dhe dobësohet me mosaktivitet.',
      'Psikologu Albert Bandura identifikoi 4 burime kryesore: eksperienca e suksesit, vëzhgimi i të tjerëve, inkurajimi social, dhe gjendja fiziologjike. Ushtrimi: çdo ditë shkruaj 3 gjëra të vogla që ke bërë mirë.',
      'Vetëdhembshuria (self-compassion), trajtimi i vetes me të njëjtën mirësi si një mik, është çelësi. Vetëkritika e ashpër nuk motivon; ajo paralizon.',
    ],
  },
  {
    id: 6, platformCat: 'blog',
    title: 'Marrëdhëniet toksike: Si t\'i njohësh',
    category: 'Marrëdhënie',
    excerpt: 'Shenjat paralajmëruese të marrëdhënieve toksike dhe hapat konkretë drejt shëndetit emocional.',
    image: 'https://images.unsplash.com/photo-1474552226712-ac0f0961a954?auto=format&fit=crop&w=800&q=80',
    date: '25 Prill 2026', readTime: '6 min', author: 'NeuroSphera', featured: false,
    content: [
      'Marrëdhëniet toksike rrallë fillojnë si të tilla; zakonisht fillojnë me dashuri intensive. Çdo shenjë paralajmëruese shpjegohet: "Është shumë i/e dashur, thjesht është xheloz/e."',
      'Shenjat kryesore: izolimi nga miqtë, kritika e vazhdueshme, kontrolli i sjelljes, ndjenja se "vesh vezë" rreth partnerit. Largimi është shpesh shumë i vështirë për shkak të lidhjes traumatike.',
      'Mbështetja profesionale, ri-ndërtimi gradual i lidhjeve sociale, dhe pavarësia ekonomike janë hapat praktikë. Largimi i sigurt kërkon planifikim.',
    ],
  },
  {
    id: 23, platformCat: 'blog',
    title: 'Pse Gjenerata Z ka krizë fokusi dhe si ta adresojmë',
    category: 'Blog',
    excerpt: 'Studimi i Microsoft: kohëzgjatja mesatare e vëmendjes ra nga 12 në 8 sekonda. Por problemi nuk është gjenerata, por mjedisi.',
    image: 'https://images.unsplash.com/photo-1622396481328-9b1b78cdd9fd?auto=format&fit=crop&w=800&q=80',
    date: '12 Maj 2026', readTime: '5 min', author: 'NeuroSphera', featured: false,
    content: [
      'Shpesh dëgjojmë se gjenerata e re "nuk mund të fokusohet". Por kjo është diagnozë e gabuar: gjenerata Z ka kapacitet fokusi të plotë, ata shpenzojnë orë në videolojëra komplekse dhe projekte kreative. Problemi është mjedisi i dizenjuar për distraksion.',
      'Algoritmet e rrjeteve sociale janë ndërtuar me saktësi nga inxhinierë të sjelljes për të maksimizuar "time on platform", gjë që kërkon ndërprerje të vazhdueshme të fokusit. Çdo njoftim (notification) shkakton lëshim të dopaminës.',
      'Zgjidhjet sistemike: telefon pa aplikacione social media gjatë orëve të studimit, "phone-free zones" në shtëpi, bllokues website-sh si Freedom. Mjedisi është shumë më i rëndësishëm se vullneti.',
    ],
  },
  {
    id: 24, platformCat: 'blog',
    title: 'Gjumi dhe kreativiteti: Çfarë thotë neuroshkenca',
    category: 'Blog',
    excerpt: 'Zbuloni lidhjet shkencore midis gjumit, emosioneve dhe kapacitetit kreativ të trurit sipas hulumtimeve më të fundit.',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80',
    date: '13 Maj 2026', readTime: '6 min', author: 'NeuroSphera', featured: false,
    content: [
      '"Truri gjatë gjumit REM prozeron informacionin e ditës dhe ndërton lidhje të reja midis koncepteve. Kjo është arsyeja pse \'të flemë mbi problem\' realisht funksionon: jo metafor, por proces biologjik i dokumentuar."',
      '"Mungesa e gjumit REM, e shkaktuar nga alkooli, stresi dhe oraret e parregullta, zvogëlon ndjeshëm kapacitetin krijues. Njerëzit mendojnë se produktiviteti do të rritet duke fjetur më pak. E kundërtë është e vërteta."',
      '"Rekomandimi im praktik: prioritizoni gjumin si një takim pune, jo negociueshëm. Shtatë deri nëntë orë gjumë nuk është luks i leksë, është investim i domosdoshëm në performancën tuaj kognitive."',
    ],
  },

  /* ─── NEURO extra ───────────────────────────────────────────────────── */
  {
    id: 27, platformCat: 'neuro',
    title: 'Dopamina vs serotonina: Ndryshimi që duhet të kuptosh',
    category: 'Neuroshkencë',
    excerpt: 'Të dy quhen "hormoni i lumturisë", por funksionojnë ndryshe. Kuptimi i dallimit ndryshon mënyrën si menaxhon motivimin.',
    image: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=800&q=80',
    date: '2 Maj 2026', readTime: '6 min', author: 'NeuroSphera', featured: false,
    content: [
      'Dopamina është neurochimikali i ANTICIPIMIT: lëshohet kur presim shpërblim, jo kur e marrim. Ky është sekreti i varësisë nga social media: çdo scroll është "ndoshta ka diçka interesante", loop-i i pafund i dopaminës.',
      'Serotonina, nga ana tjetër, lidhet me kënaqësinë dhe qetësinë pas arritjes. Nivelet e saj rriten me ekspozim ndaj dritës diellore, ushtrime fizike dhe lidhje sociale cilësore. 95% e serotoninës prodhohet në zorrë: lidhja trup-mendje është literale.',
      'Studimi i Berridge dhe Robinson (Michigan, 1998) tregoi: kafshët me dopaminë të reduktuar humbasin motivimin por jo aftësinë për kënaqësi. Praktikisht: nëse ndiheni "të pamotivuar", mungon dopamina. Nëse ndiheni "bosh pas suksesit", mungon serotonina. Intervenime: për dopaminë, qëllime të vogla me feedback; për serotonin, diell, lëvizje dhe lidhje sociale.',
    ],
  },
  {
    id: 28, platformCat: 'neuro',
    title: 'Nervus Vagus: Çelësi i sistemit nervor parasimpatik',
    category: 'Neuroshkencë',
    excerpt: 'Nervi më i gjatë i trupit kontrollon zemrën, mushkëritë dhe zorrën. Aktivizimi i tij e kthen trupin nga "alarm" në "qetësi".',
    image: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=800&q=80',
    date: '3 Maj 2026', readTime: '5 min', author: 'NeuroSphera', featured: false,
    content: [
      'Nervus vagus shkon nga truri nëpër qafë, zemër, mushkëri deri në zorrën e trashë. "Toni vagal" i lartë lidhet me rezistencë ndaj stresit, rregullim emocional dhe shëndet kardiovaskular. Studimi i Thayer & Lane (2009): HRV parashikon performancën kognitive dhe emocionale.',
      'Si matet toni vagal: variabiliteti i frekuencës kardiake (HRV). HRV i lartë = sistemi nervor fleksibël. Shumë smartwatch moderne (Garmin, Polar) e matin automatikisht gjatë gjumit.',
      'Si aktivizohet vagusi: (1) Frymëmarrje e ngadaltë diafragmatike, 5-6 frymëmarrje/minutë. (2) Këndimi ose zëri i lartë, ku vibracionet stimulojnë vagus fizikisht. (3) Dushi i ftohtë 30 sekonda. (4) Meditimi loving-kindness. (5) Ushtrimet fizike moderate. Protokolli Porges (2011): 20 min çdo ditë mjaftojnë për ndryshim të matshëm HRV pas 6 javësh.',
    ],
  },
  {
    id: 29, platformCat: 'neuro',
    title: 'Psikiatria nutricionale: Si ushqimi modelon mendjen',
    category: 'Neuroshkencë',
    excerpt: 'Meta-analiza 2022 (Jacka): dieta mesdhetare zvogëlon riskun e depresionit me 33%. Ushqimi është farmakologji e përditshme.',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80',
    date: '4 Maj 2026', readTime: '6 min', author: 'NeuroSphera', featured: false,
    content: [
      'Mikrobioma e zorrës prodhon 95% të serotoninës dhe 50% të dopaminës së trupit. Kur flora intestinale është e çekuilibruar (dysbiosis), ndërgjegjja dhe disponimi preken direkt: lidhja "gut-brain axis" është sot konsensus shkencor.',
      'Ushqimet me efektin më të fortë neuroprotektiv sipas meta-analizave (Cochrane 2021): omega-3 (salmon, sardele, arre); magnez (spinaq, bajame), cofactor për 300+ reaksione enzimatike duke përfshirë sintezën e serotoninës; fermentues (kos, kimchi) që rrisin diversitetin e mikrobiomës.',
      'Studimi SMILES (2017): kalimi 12 javë në dietë të shëndetshme reduktoi simptomat e depresionit klinik me 32%, krahasueshëm me terapi psikologjike. Ushqimet me ndikim negativ të dokumentuar: sheqer i rafinuar (inflamacion cerebral) dhe yndyra trans (ndërhyjnë në funksionin e membranës neuronale).',
    ],
  },
  {
    id: 30, platformCat: 'neuro',
    title: 'Kortizoli kronik: Armiku i heshtur i trurit tuaj',
    category: 'Ankth',
    excerpt: 'Stresi i shkurtër është adaptiv. Stresi kronik dëmton fizikisht hipokampusin, qendrën e kujtesës. Çfarë tregon shkenca.',
    image: 'https://images.unsplash.com/photo-1493836512294-502baa1986e2?auto=format&fit=crop&w=800&q=80',
    date: '5 Maj 2026', readTime: '7 min', author: 'NeuroSphera', featured: false,
    content: [
      'Kortizoli, hormoni kryesor i stresit, në doza të shkurtra është vital: rrit vëmendjen dhe mobilizon energjinë. Por nivelet kronike të larta kanë efekte shkatërrimtare të dokumentuara.',
      'Neuroshkentista Bruce McEwen (Rockefeller University) dokumentoi: kortizoli kronik zvogëlon dendrikat neuronale të hipokampusit dhe pengon neurogenezën. Rezultat: kujtesa epizodike keqësohet dhe rreziku i depresionit trefishohet.',
      'Intervenime me prova shkencore: ushtrime aerobike 150 min/javë (redukton kortizolin bazal ~20%), meditim MBSR 8 javë (Kabat-Zinn, 2003), orari fiks i gjumit. Matja e kortizolit: test i pështymës (4 mostra gjatë ditës) tregon kurbën cirkadiane dhe identifikon dysregulimin.',
    ],
  },

  /* ─── LEARNING extra ─────────────────────────────────────────────── */
  {
    id: 31, platformCat: 'learning',
    title: 'Teknika Cornell: Sistemi i shënimeve që mëson Harvard-i',
    category: 'Mësim',
    excerpt: 'Zhvilluar nga Walter Pauk, 1950. Mësohet sot nga universitetet kryesore botërore si standardi i shënimeve efektive.',
    image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=800&q=80',
    date: '7 Maj 2026', readTime: '4 min', author: 'NeuroSphera', featured: false,
    content: [
      'Faqja ndahet në tre zona: kolona e majtë (2.5 cm) për fjalë kyçe dhe pyetje; zona kryesore e djathtë për shënime gjatë leksionit; zona poshtë (5 cm) për përmbledhjen me fjalët tuaja pas leksionit.',
      'Mekanika e mësimit: Gjatë leksionit shkruaj shënime normalisht. Brenda 24 orësh, mbulo zonën e djathtë dhe përdor vetëm pyetjet e kolonës majtë për të testuar veten (active recall i integruar). Shkruaj përmbledhjen poshtë me fjalët tuaja: Feynman i mini-zuar.',
      'Studimi i Mueller & Oppenheimer (2014, Princeton): studentët që shkruajnë me dorë performojnë 40% më mirë në pyetjet konceptuale krahasuar me ata që shkruajnë me laptop, sepse formulimi i shënimeve kërkon përpunim aktiv, jo transkriptim pasiv.',
    ],
  },
  {
    id: 32, platformCat: 'learning',
    title: 'Interleaving: Studimi i ndërkëmbyer rrit performancën 43%',
    category: 'Mësim',
    excerpt: 'Shumica studiojnë temën A plotësisht, pastaj B, pastaj C. Interleaving i ndërkëmben: rezultatet shkencore habiten.',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80',
    date: '9 Maj 2026', readTime: '5 min', author: 'NeuroSphera', featured: true,
    content: [
      '"Blocked practice", studimi i plotë i një teme para se të kalosh te tjetra, ndihet efektive dhe krijon iluzion kompetence. Por studimi i Kornell & Bjork (2008, UCLA) tregoi: grupi me interleaving performoi 43% më mirë në testimin 1 javë pas studimit.',
      'Pse funksionon: Interleaving detyron trurin të rikthejë informacionin nga memoria (retrieval practice) dhe të dallojë midis koncepteve të ngjashme, dy nga mekanizmat më të fuqishëm të konsolidimit të kujtesës.',
      'Si zbatohet: Matematikë: mos zgjidh 20 probleme të tipit A, pastaj 20 të tipit B. Ndërkëmbi: A, B, C, A, B, C. Gjuhë të huaj: ndërkëmbi vocabular, gramatikë, lexim. Fillimisht ndihet e vështirë: kjo "vështirësi e dëshiruar" është saktësisht ajo çfarë forcon kujtesën afatgjatë.',
    ],
  },
  {
    id: 33, platformCat: 'learning',
    title: 'Metacognitioni: Arti i të mësuarit si të mësosh',
    category: 'Mësim',
    excerpt: 'Studentët me metacognition të lartë mësojnë 2x më shpejt, jo sepse janë më të zgjuar, por sepse e dinë si funksionon mendja e tyre.',
    image: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?auto=format&fit=crop&w=800&q=80',
    date: '11 Maj 2026', readTime: '5 min', author: 'NeuroSphera', featured: false,
    content: [
      'Metacognitioni, "të menduarit mbi të menduarit", është aftësia për të vëzhguar proceset e veta kognitive: "A e kam kuptuar vërtet kjo, apo vetëm e njoh?", "Cila teknikë studimi funksionon për mua?"',
      'Dunlosky et al. (2013) vlerësuan 10 teknikat e studimit. Rezultati befasues: shumë teknika të zakonshme (nënvizimi, rileximi) kanë efektivitet të ulët. Teknikat me efektivitet të lartë, si practice testing dhe spaced repetition, janë të pakta por jashtëzakonisht superiore.',
      'Zhvillimi praktik: (1) Mbaj "ditar mësimi" me nota vetë-vlerësimi 1-10 për kuptim, jo vetëm performancë. (2) Para çdo sesioni studimi pyet: "Cila teknikë duhet të përdor sot?" (3) Pas testit, analizoni jo vetëm gabimet, por PSE i bëre. Kjo ndërgjegjësi ndryshon cilësinë e çdo sesioni të ardhshëm.',
    ],
  },
  {
    id: 34, platformCat: 'learning',
    title: 'Gjuha e dytë pas 30 vjeç: Çfarë thotë neuroshkenca',
    category: 'Mësim',
    excerpt: 'Miti "pas 18 vjeç nuk mëson dot gjuhë" është i rrezuar shkencërisht. Truri adult ka avantazhe unike nëse i shfrytëzon siç duhet.',
    image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=800&q=80',
    date: '13 Maj 2026', readTime: '6 min', author: 'NeuroSphera', featured: false,
    content: [
      'Studimi i Hartshorne et al. (2018, MIT) mbi 670,000 njerëz: periudha kritike për akzent nativ mbaron rreth 17 vjeç, por aftësia gramatikore arrin nivel shumë të lartë edhe si i rritur. Të rriturit kanë avantazhe: vocabulary transfer, strategji meta-kognitive dhe motivim intrinsik.',
      'Protokolli i optimizuar për të rritur: (1) Input i kuptueshëm: ekspozim ndaj materialit pak mbi nivelin tuaj (metoda Krashen i+1). (2) Output i hershëm: flisni nga java e parë, edhe gabimisht. (3) Spaced repetition për vocabulary (Anki). (4) Konsistencia mbi intensitetin: 30 min/ditë > 5 orë/javë një herë.',
      'Rezultate reale: në platformat si Duolingo dhe Babbel, studimet e tyre interne tregojnë se të rriturit 30-40 vjeç kanë progres konsistent sa apo edhe më të shpejtë se adoleshentët kur janë të motivuar. Çelësi: toleranca ndaj gabimeve dhe ekspozimi i rregullt.',
    ],
  },

  /* ─── FOCUS extra ────────────────────────────────────────────────── */
  {
    id: 35, platformCat: 'focus',
    title: 'Teknika Pomodoro: Shkenca pas 25 minutave',
    category: 'Produktivitet',
    excerpt: 'Francesco Cirillo e zhvilloi me një kohëmatës domate. Sot e përdorin miliona. Por pse funksionon neurologjikisht?',
    image: 'https://images.unsplash.com/photo-1508780709619-79562169bc64?auto=format&fit=crop&w=800&q=80',
    date: '8 Maj 2026', readTime: '4 min', author: 'NeuroSphera', featured: false,
    content: [
      'Ciklet ultradiane, ritmet biologjike 90-120 minutësh të vëmendjes, shpjegojnë pse pushimet e rregullta japin rezultate më të mira se maratonat e punës. Truri kalon natyrshëm nga fokus i lartë te rigjenerim çdo ~90 min. 25 minutat e Pomodoro-s janë "sprint" brenda ciklit.',
      'Efekti Zeigarnik (1927): detyrat e papërfunduara qëndrojnë në kujtesën e punës dhe krijojnë tension kognitiv. Pomodoro-ja e shfrytëzon: ndalimi pas 25 minutave (edhe nëse je në flow) krijon impuls psikologjik të rifillimit. Shumë raportojnë se rifillojnë pa hezitim.',
      'Studimet e Ariga & Lleras (Illinois, 2011): pushimet e shkurtra të rregullta mbajnë performancën kognitive konstante, ndërkohë puna e vazhdueshme zvogëlon efektivitetin me 30% pas 50 minutave. Protokolli: 25 min punë → 5 min pushim (lëvizje, ujë, jo ekran) → pas 4 ciklesh, 20-30 min pushim i gjatë.',
    ],
  },
  {
    id: 36, platformCat: 'focus',
    title: 'Kronotipi dhe pikul kognitiv: Puna në orën e duhur',
    category: 'Produktivitet',
    excerpt: '8 orë punë nuk kanë kuptim pa ditur KUJDES jeni kognitivisht në nivel maksimal. Çdonjëri ka "orën e artë" ditore.',
    image: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?auto=format&fit=crop&w=800&q=80',
    date: '10 Maj 2026', readTime: '5 min', author: 'NeuroSphera', featured: false,
    content: [
      'Chronotype, tendenca biologjike për aktivitet matinal ose mbrëmjor, është 50% gjenetike (studimi i Hu et al., 2016, mbi 90,000 njerëz). "Zogjtë e hershëm" arrijnë pikun kognitiv 2-4 orë pas zgjimit, ndërsa "buët e natës" e arrijnë 4-6 orë pas zgjimit.',
      'Daniel Pink në "When" (2018) analizoi 20 milion tweet dhe gjeti: disponimi njerëzor ndryshon në formë U gjatë ditës: lartë mëngjes, ulët mesditë, lartë pasdite vonë. Kronotipi personal ndryshon nuancat.',
      'Strategjia praktike: Për 5 ditë, vlerëso çdo orë energjinë dhe foksin 1-10. Gjej "orën e artë", 2-3 orë kur vlerësimet janë maksimale. Bloko ato orë për punën me vlerën më të lartë. Email dhe detyra rutinë la për pasdite. Detyrat mekanike le për mesditë kur energjia është natyrshëm e ulët.',
    ],
  },
  {
    id: 37, platformCat: 'focus',
    title: 'GTD (Getting Things Done): Zbraz mendjen për të menduar',
    category: 'Produktivitet',
    excerpt: '"Mendja duhet të jetë si ujë", pa barrë detyrave të paplasifikuara. GTD e zbraz mendjen për të menduar, jo për të mbajtur mend.',
    image: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=800&q=80',
    date: '12 Maj 2026', readTime: '6 min', author: 'NeuroSphera', featured: false,
    content: [
      'David Allen vëzhgoi: stresi nuk vjen nga shumë punë, por nga detyrat e paplasifikuara që zënë hapësirë mendore. "Open loops" konsumojnë kujtesën e punës vazhdimisht, duke zvogëluar kapacitetin kognitiv disponibël.',
      '5 hapat e GTD: (1) CAPTURE — çdo gjë hyn në "inbox" pa gjykim. (2) CLARIFY — a kërkon veprim? Nëse jo: fshi, arkivo ose "ndoshta". Nëse po: cila është veprimi tjetër konkret? (3) ORGANIZE — vendos në listën e duhur. (4) REVIEW — çdo javë, shfletim sistemik. (5) ENGAGE — bëje.',
      'Trafton & Monk (2005): njerëzit humbasin mesatarisht 1.5 minuta pas çdo ndërprerje vetëm për t\'u rikthyer te fokusi. GTD zvogëlon ndërprerjet e brendshme, mendimet e papritura "oh, duhet të bëj X", duke siguruar që çdo gjë është e regjistruar. Mjetet: Todoist, Notion, apo edhe notebook fizike funksionojnë po aq mirë.',
    ],
  },
  {
    id: 38, platformCat: 'focus',
    title: 'Distraksionet dixhitale: Kostoja kognitive e njoftimeve',
    category: 'Produktivitet',
    excerpt: 'Çdo njoftim i telefonit kushton 23 minuta rikuperim fokusi. Studjuesit e Microsoft e matën. Çfarë mund të bëjmë konkretisht?',
    image: 'https://images.unsplash.com/photo-1455849318743-b2233052fcff?auto=format&fit=crop&w=800&q=80',
    date: '14 Maj 2026', readTime: '5 min', author: 'NeuroSphera', featured: false,
    content: [
      'Studimi i Gloria Mark (UC Irvine, 2008): pas çdo ndërprerje, nevojiten mesatarisht 23 minuta e 15 sekonda për t\'u rikthyer plotësisht te detyra. Punonjësit ndërpriten mesatarisht çdo 11 minuta. Matematika është e tmerrshme.',
      'Njoftimet aktivizojnë sistemin dopaminergik të pritjes, të njëjtin sistem si varësia nga lojërat e fatit. Prodhuesit e aplikacioneve e dizenjojnë qëllimisht këtë. Studimi i Ward et al. (Texas, 2017): vetë prania e telefonit (edhe me fytyrë poshtë, edhe i fikur) zvogëlon kapacitetin e disponueshëm kognitiv.',
      'Intervenime të provuara: (1) "Batching": kontrollo email/mesazhe vetëm 2-3 herë/ditë në blloqe 20 min. (2) Modaliteti "Do Not Disturb" gjatë deep work, absolutisht pa përjashtim. (3) Aplikacioni "Freedom" ose "Cold Turkey" bllokojnë website-t distrahuese. (4) "Phone-free bedroom": telefoni ngarkohet jashtë dhomës. Studimi i Twenge et al. (2018): reduktimi i screen time me 1 orë/ditë rrit disponimin me efekt të matshëm pas 2 javësh.',
    ],
  },

  /* ─── LABS extra ─────────────────────────────────────────────────── */
  {
    id: 39, platformCat: 'labs',
    title: '21 ditë pa sheqer të shtuar: Protokolli dhe efektet',
    category: 'Labs',
    excerpt: 'Çfarë ndodh me energjinë, fokusin dhe disponimin kur eliminon sheqerin e shtuar për 21 ditë. Protokoll i plotë me gjurmim.',
    image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=800&q=80',
    date: '11 Maj 2026', readTime: '7 min', author: 'NeuroSphera', featured: false,
    content: [
      'Sheqeri i shtuar shkakton lëkundje të mëdha të glukozës, "spikes" pasuar nga "crashes" që manifestohen si lodhje, irritabilitet dhe dëshirë ushqimore. Knüppel et al. (UCL, 2017) mbi 23,000 njerëz: konsum i lartë sheqeri u lidh me 23% risk më të lartë të çrregullimeve mendore pas 5 vitesh.',
      'Protokolli 21-ditor: Elimino sheqerin e shtuar nga të gjitha burimet (lexo etiketat: fshihet si "sukroz", "siropin e fruktosës", "glukozë"). Lejohet: fruta të plota, mjaltë natyral në sasi të moderuara. Java 1-2: simptoma "detox" si dhimbje koke e lehtë dhe dëshira të forta janë normale. Java 3: energji më e qëndrueshme dhe fokus më i qartë.',
      'Gjurmo çdo ditë (shkalla 1-10): energji matinale, fokus 14:00-16:00, disponim 20:00. Pas sfidës, shumica vazhdojnë me reduktim permanent sepse ndryshimi i perceptuar është i qartë dhe i menjëhershëm.',
    ],
  },
  {
    id: 40, platformCat: 'labs',
    title: 'Sfida 30-ditore kognitive: Dual N-Back, meditim dhe lexim aktiv',
    category: 'Labs',
    excerpt: 'Kombinim i tre teknikave me bazë shkencore: 55 minuta/ditë për 30 ditë. Protokoll i plotë me matje para dhe pas.',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80',
    date: '13 Maj 2026', readTime: '8 min', author: 'NeuroSphera', featured: false,
    content: [
      'Kujtesa e punës parashikon performancën akademike dhe profesionale. Jaeggi et al. (2008, Michigan) treguan: Dual N-Back rrit kujtesën e punës dhe inteligjencën fluide me 40% pas 20 sesionesh.',
      'Protokolli 30-ditor: Mëngjes (15 min): 10 min focused attention meditim + 5 min journaling. Mesditë (20 min): Dual N-Back (falas në cognitivefun.net). Mbrëmje (20 min): lexim aktiv me Cornell. Gjithsej 55 min/ditë.',
      'Matësi para dhe pas: Digit Span Test (kujtesa e numrave), Trail Making Test B (shpejtësia kognitive), Stroop Color-Word Test (kontrolli inhibitor). Të gjithë janë falas online. Dokumento rezultatin fillestar, pastaj pas 15 dhe 30 ditësh. Ndryshimi mesatar i raportuar nga pjesëmarrësit tanë: +22% Digit Span, -15% kohë Trail Making.',
    ],
  },
  {
    id: 41, platformCat: 'labs',
    title: 'Journaling shkencor: 15 minuta që ristrukturojnë trurin',
    category: 'Labs',
    excerpt: 'James Pennebaker (UT Austin): shkrimi ekspresiv redukton kortizolin, forcon imunitetin dhe ndryshon strukturën e trurit. Protokoll praktik.',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80',
    date: '15 Maj 2026', readTime: '6 min', author: 'NeuroSphera', featured: true,
    content: [
      'Pennebaker (1986): studentët shkruanin 15-20 min/ditë për 4 ditë rreth ngjarjeve të vështira. Rezultati: ulje e vizitave mjekësore me 50% gjashtë muaj më vonë dhe rritje e aktivitetit të limfociteve T.',
      'Pse funksionon neurobiologjikisht: Verbalizimi i emocioneve aktivizon korteksin paraballor ventrolateral, i cili rregullon aktivitetin e amigdalës. Shkruarja e strukturuar forcon edhe rrjetin e narrativit (DMN), duke rritur efektin.',
      'Tre protokolle të provuara: (1) Expressive Writing (Pennebaker): shkruaj pa filtër për 15 min, 4 ditë. (2) Gratitude Journaling (Emmons & McCullough, 2003): 3 gjëra specifike falënderimi çdo mbrëmje; rrit disponimin 25% pas 10 javësh. (3) Implementation Intentions: "Nesër, kur [cue], do të [veprim] te [vend]", rrit ndjekjen e qëllimeve me 91% (Gollwitzer, 1999).',
    ],
  },
  {
    id: 42, platformCat: 'labs',
    title: 'Protokolli 8-javësh i gjumit optimal (CBT-I vetë-zbatim)',
    category: 'Labs',
    excerpt: 'CBT-I adaptuar si protokoll pa terapis. 8 javë, 5 strategji klinike të provuara. 76% efektivitet i raportuar pa ilaçe.',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
    date: '17 Maj 2026', readTime: '8 min', author: 'NeuroSphera', featured: false,
    content: [
      'CBT-I (Cognitive Behavioral Therapy for Insomnia), trajtimi i miratuar si linja e parë para ilaçeve, ka 80% efektivitet për insomninë kronike. Protokolli adapton parimet e tij për vetë-zbatim.',
      'Javët 1-2, Higjiena bazë: orë fikse zgjimi (edhe fundjavë), dhomë 18°C, asnjë ekran 60 min para gjumit, kofeinë 0 pas orës 14:00. Javët 3-4, Sleep Restriction: kufizon kohën në shtrat sipas eficiencës aktuale. Javët 5-6, Stimulus Control: shtrati vetëm për gjumë. Nëse nuk fle brenda 20 min, çohu dhe kthehu kur je i përgjumur. Javët 7-8, Konsolidim: relaksim progresiv muskulor (Jacobson) + vizualizim 10 min.',
      'Matësi kryesor: Sleep Efficiency = (Kohë gjumë / Kohë total në shtrat) × 100. Nën 85% = ka hapësirë. Mbi 90% = optimal. Mitchell et al. (2012): CBT-I vetë-zbatues arrin 76% efektivitet krahasuar me 80% të CBT-I me terapis.',
    ],
  },

  /* ─── CASES extra ────────────────────────────────────────────────── */
  {
    id: 43, platformCat: 'cases',
    title: 'Nga depresioni tek maratona: Historia e Valdrinit',
    category: 'Studim Rasti',
    excerpt: 'Pas diagnostikimit me depresion klinik në moshën 27, Valdrini zgjodhi lëvizjen fizike si terapinë kryesore. 18 muaj më vonë: maratona.',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80',
    date: '16 Maj 2026', readTime: '8 min', author: 'NeuroSphera', featured: true,
    content: [
      'Valdrini, 27 vjeç, u diagnostikua me depresion klinik pas humbjes së punës dhe një ndarjeje brenda të njëjtit muaj. "Mëngjesin kur nuk mund të ngrija nga shtrati edhe pas 11 orë gjumë, kuptova se kjo nuk ishte trishtim i zakonshëm."',
      'Psikiatri i propozoi: terapi CBT + ushtrime fizike të rregullta (si trajtim i barabartë me ilaçet). Filloi me 10 minuta ecje çdo mëngjes. Java e parë: 7 herë nga 10 nuk donte të dilte, por dilte gjithsesi. Pas 3 javësh, BDNF kishte filluar ndikimin e tij. Muaji i dytë: vrapim 20 min/ditë. Meta-analiza e Schuch et al. (2016): ushtrimet janë po aq efektive sa antidepresantët për depresionin e moderuar.',
      '"Çdo ditë që dalësh kur nuk dëshiron, i thua trurit: unë komandoj." Pas 18 muajsh, Valdrini kreu Maratonën e Tiranës. Koha: 4:12:34. Sot jep leksione vullnetare në shkolla rreth shëndetit mendor dhe sportit.',
    ],
  },
  {
    id: 44, platformCat: 'cases',
    title: 'Sindroma e impostorëve tek mjekësia: Historia e Floritës',
    category: 'Studim Rasti',
    excerpt: 'Pas 6 vitesh Mjekësi me nota shkëlqyeshme, Florita ende ndihej "mashtruese". Si e doli nga cikli i vetëdyshimit?',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80',
    date: '18 Maj 2026', readTime: '7 min', author: 'NeuroSphera', featured: false,
    content: [
      'Florita mbaroi Mjekësinë me mesatare 9.4. Por çdo pyetje nga profesori e bënte të mendonte: "Tani e zbulojnë që nuk di asgjë." Ky është Sindroma e Impostorëve, i dokumentuar nga Dr. Pauline Clance (1978) tek 70% e njerëzve me performancë të lartë.',
      'Mekanika kognitive: truri me impostorizëm ka "bias konfirmimi" asimetrik, kërkon prova të paaftësisë dhe injoron provat e kompetencës. Edhe sukseset interpretohen si "isha me fat". Cikli: sukses, "isha me fat", ankth reduktohet, tjetri sukses dhe cikli vazhdon pa fund.',
      'Florita punoi me psikolog CBT për 4 muaj. Teknikat: (1) "Evidence Log": ditar i provave kompetencës, rilexim çdo javë. (2) Eksternalizimi: "Impostori" trajtohet si zë i jashtëm, jo si e vërteta. (3) Ekspozimi: paraqitja në konferenca studentore. Sot Florita është rezidente kardiologjie dhe mentoron studentë rreth sindromës.',
    ],
  },
  {
    id: 45, platformCat: 'cases',
    title: 'Si një startup zbatoi neuroshkencën në kulturën e punës',
    category: 'Studim Rasti',
    excerpt: 'Eliminuan mbledhjet e mëngjesit, zbatuan deep work blocks dhe No-Meeting Fridays. Produktiviteti u rrit 28% brenda 3 muajsh.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    date: '20 Maj 2026', readTime: '7 min', author: 'NeuroSphera', featured: false,
    content: [
      'TechTiranë (emri i ndryshuar), startup me 23 punonjës, vuante nga produktiviteti i ulët pavarësisht orëve të gjata. CEO-ja, Gentian, pas leximit të "Deep Work" vendosi të testonte ndryshimet strukturore.',
      'Ndryshimet: (1) Asnjë mbledhje para orës 10:00, duke respektuar pikun kognitiv matinal. (2) "Deep Work Blocks" 09:00-12:00: asnjë Slack, email vetëm urgjencë reale. (3) "Batch communication" 10:00-10:30 dhe 15:00-15:30. (4) "No-Meeting Fridays": dita e plotë punë individuale e fokusuar.',
      'Rezultatet pas 3 muajsh: produktiviteti i vetëraportuar +28%, orët jashtë orarit -35%, koha nga detyra deri në dorëzim -22%. Mesazhi: produktiviteti nuk është çështje motivimi, por çështje e strukturës mjedisore.',
    ],
  },

  /* ─── RESOURCES extra ───────────────────────────────────────────── */
  {
    id: 46, platformCat: 'resources',
    title: '10 kurse online falas nga Harvard, MIT dhe Stanford',
    category: 'Burime',
    excerpt: 'Harvard, MIT, Stanford dhe Yale ofrojnë kurse falas mbi psikologjinë, neuroshkencën dhe produktivitetin. Lista e kuruar me kujdes.',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80',
    date: '14 Maj 2026', readTime: '4 min', author: 'NeuroSphera', featured: true,
    content: [
      '"The Science of Well-Being" (Yale/Coursera): kursi me enrollment-in më të lartë në historinë e Coursera-s (3.7M+ studentë). Mëson psikologjinë pozitive dhe praktike. "Learning How to Learn" (UCSD/Coursera), Dr. Barbara Oakley: neuroshkenca e mësimit, prokrastinimit dhe fokusit. Absolutisht i domosdoshëm.',
      '"Introduction to Psychology" (Yale/OpenYale), Prof. Paul Bloom, falas. "Mindfulness-Based Stress Reduction" (UMASS/edX). "Psychological First Aid" (Johns Hopkins/Coursera). "Neuroscience and Neuroimaging" (Johns Hopkins). Të gjitha aksesohen me "Audit" (falas, pa certifikatë) në Coursera.',
      'MIT OpenCourseWare ka 100+ kurse falas pa regjistrim. Khan Academy ofron bazat e psikologjisë dhe biologjisë shkencërisht të sakta. edX ka shumëfish kurse falas nga universitetet kryesore; filtro me "Free" dhe "Self-Paced" për akses të menjëhershëm.',
    ],
  },
  {
    id: 47, platformCat: 'resources',
    title: '7 studime themelore që riformuan psikologjinë moderne',
    category: 'Burime',
    excerpt: 'Nga eksperimenti i Milgram-it te Attachment Theory: hulumtimet që çdo person i informuar duhet t\'i njohë.',
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80',
    date: '16 Maj 2026', readTime: '7 min', author: 'NeuroSphera', featured: false,
    content: [
      '(1) Eksperimenti Milgram (1963): 65% e njerëzve "të zakonshëm" u bindën t\'u jepnin goditje elektrike letale kur urdhëroheshin. Mëson: bindja ndaj autoritetit është instinktive. (2) Stanford Prison (Zimbardo, 1971): rolet sociale ndryshojnë sjellje rrënjësisht brenda ditësh. (3) Marshmallow Test (Mischel, 1972): fëmijët që vonuan gratifikimin kishin rezultate më të mira 20 vjet më vonë.',
      '(4) Hawthorne Effect: njerëzit ndryshojnë sjellje kur vëzhgohen; bazë e menaxhimit. (5) Learned Helplessness (Seligman, 1965): model neurobiologjik i depresionit. (6) Growth Mindset (Dweck, 2006): besimi se aftësitë zhvillohen rrit performancën me 20-35%.',
      '(7) Attachment Theory (Bowlby & Ainsworth): modelet e lidhjes nga fëmijëria modelojnë marrëdhëniet adulte. 4 tipet: secure, anxious, avoidant, disorganized. Çdo studim i listuar është i aksesueshëm falas në PubMed ose Google Scholar; lexoni abstraktin origjinal, jo vetëm rezyme.',
    ],
  },
  {
    id: 48, platformCat: 'resources',
    title: 'Kanalet YouTube të verifikuara për neuroshkencë dhe psikologji',
    category: 'Burime',
    excerpt: 'Jo çdo kanal "shkencor" është i besueshëm. Lista jonë është filtruar: vetëm me referenca peer-reviewed dhe ekspertë të verifikuar.',
    image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80',
    date: '18 Maj 2026', readTime: '4 min', author: 'NeuroSphera', featured: false,
    content: [
      '"Kurzgesagt – In a Nutshell": neuroshkencë dhe psikologji me animacion cilësor. Çdo video ka lista referenca të plota. "SciShow Psych": psikologji shkencore me burime akademike. "TED-Ed": leksione 5-10 min nga ekspertë.',
      '"Huberman Lab": Prof. Andrew Huberman, Stanford. Video 2-3 orë mbi protokolle shkencore si gjumë, fokus dhe stres. Dense por me referenca të plota. "What I\'ve Learned": biohacking shkencor me burime të dokumentuara. "Two Cents": psikologji e vendimmarrjes dhe financave.',
      'Kujdes të shmangni: kanalet që promovojnë "law of attraction", "quantum consciousness" ose pseudoshkencë të paraqitur si neuroshkencë. Gjithmonë kontrolloni nëse autori ka kredenciale akademike të verifikueshme dhe nëse pretendimet kanë referenca peer-reviewed.',
    ],
  },
  {
    id: 49, platformCat: 'resources',
    title: 'Si të aksesoni hulumtimet shkencore falas: Udhëzues praktik',
    category: 'Burime',
    excerpt: 'Shumica e studimeve janë pas "paywall", por ka mënyra legale dhe falas. Udhëzuesi i plotë për aksesimin e shkencës pa pagesë.',
    image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=800&q=80',
    date: '20 Maj 2026', readTime: '4 min', author: 'NeuroSphera', featured: false,
    content: [
      'PubMed Central (PMC): mbi 7 milionë artikuj falas, financuar nga NIH. PLOS ONE, Frontiers in Psychology, BMC Psychology janë revista peer-reviewed plotësisht falas. Google Scholar: kërko titullin + "filetype:pdf" ose "preprint" për versione falas.',
      'ResearchGate: shumë autorë ngarkojnë studimet e tyre. Drejtoju autorit direkt nëpërmjet email (listuar në studim): 90% e dërgojnë me kënaqësi. PsycINFO dhe JSTOR ofrojnë akses falas nëpërmjet bibliotekave universitare.',
      'Preprint servers: bioRxiv, psyArXiv janë studime para peer-review, kujdes me interpretimin (nuk janë ende të verifikuara). Biblioteka Kombëtare e Shqipërisë dhe Kosovës kanë akses JSTOR dhe EBSCO; kontaktoni për akses online.',
    ],
  },

  /* ─── BLOG extra ─────────────────────────────────────────────────── */
  {
    id: 50, platformCat: 'blog',
    title: 'Paradoksi i zgjedhjes: Pse 40 opsione na bëjnë ngordhur',
    category: 'Blog',
    excerpt: 'Barry Schwartz tregoi: më shumë opsione = më pak lumturi. Neuroshkenca e konfirmon. Ja si ta reduktoni "decision fatigue".',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80',
    date: '15 Maj 2026', readTime: '5 min', author: 'NeuroSphera', featured: false,
    content: [
      'Iyengar & Lepper (Columbia, 2000): tavolina me 24 lloje reçeli tërhiqte 60% më shumë vëmendje, por shitja ishte 10x më e lartë nga tavolina me 6 lloje. Zgjedhja e madhe paralizoi. Ky është "Paradox of Choice".',
      'Çdo vendim konsumon glukozë dhe kapacitet kognitiv. "Decision fatigue", ku vendimet e vonshme të ditës janë cilësisht inferiore, është i dokumentuar tek gjyqtarët (Danziger et al., 2011: 65% vendime favorabile pas pauzës së drekës, 0% para saj) dhe tek mjekët kujdestarë.',
      'Zgjidhjet: (1) Reduktimi proaktiv: elimino opsionet nga fillimi (mëngjesi fiks, veshja "uniforme"). (2) Vendimmarrja rutinë: "nëse [situatë], atëherë [veprim fiks]". (3) "Good enough" vs "maximizing": Schwartz tregon se "satisficer-at" janë konsistentisht më të lumtur se "maximizer-at" që kërkojnë gjithmonë optimalen.',
    ],
  },
  {
    id: 51, platformCat: 'blog',
    title: 'Efekti Dunning-Kruger: Shkenca pas vetëbesimit të paarsyeshëm',
    category: 'Blog',
    excerpt: 'Pse ata që dinë më pak janë shpesh më konfidentë? Dhe pse ekspertët dyshojnë në veten? Shkencë dhe strategji praktike.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
    date: '17 Maj 2026', readTime: '5 min', author: 'NeuroSphera', featured: false,
    content: [
      'Dunning & Kruger (1999, Cornell): performuesit me pikë të ulëta mbivlerësonin veten me 50+ pikë percentile. Kompetenca e ulët krijon "meta-ignorancë": nuk di aq sa të dish çfarë nuk di.',
      'Rëndësi: efekti Dunning-Kruger NUK thotë "njerëzit e paditur janë gjithnjë konfidentë". Thotë: njohuri të pakta → vetëbesim i paarsyeshëm, ndërkohë ekspertët mbivlerësojnë të tjerët. Konfidenca kthehet pasi kalon pragun e parë të kompetencës.',
      'Si të mbroheni: (1) "Calibration": para vendimit të rëndësishëm kërkoni feedback nga ekspertë të vërtetë. (2) "Pre-mortem": imagjinoni se projekti dështoi. Pse? Kjo detyron kundër-argumentet. (3) Rrethohuni me njerëz me ekspertiza komplementare. (4) Studioni historikun e vendimeve të ngjashme: ku kanë dështuar të tjerët?',
    ],
  },
  {
    id: 52, platformCat: 'blog',
    title: 'Agjencia e perceptuar: Pse kontrolli imagjinar shpëton jetë',
    category: 'Blog',
    excerpt: 'Ellen Langer (Harvard) dha bimë dhome rezidentëve: grupi me "kontroll" kishte 50% vdekshmëri më të ulët. Çfarë na mëson kjo?',
    image: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=800&q=80',
    date: '19 Maj 2026', readTime: '6 min', author: 'NeuroSphera', featured: false,
    content: [
      'Langer (1976): dy grupe rezidentësh morën bimë dhome. Grupi A vendoste vetë ku t\'i vendoste dhe i ujiste vetë. Grupi B, bimët kujdesej stafi. 18 muaj më vonë: grupi A kishte 50% normë vdekshmërie më të ulët. Perceptimi i kontrollit, jo kontrolli real, ishte faktori.',
      'Mekanizmat neurobiologjikë: agjencia e perceptuar redukton kortizolin dhe rrit aktivitetin e korteksit paraballor ventromedikal. E kundërtja, learned helplessness (Seligman), tregon: organizmat pa perceptim kontrolli zhvillojnë simptoma depresive pavarësisht situatës reale.',
      'Aplikime: (1) Rikadro sfidat si zgjedhje: "Zgjedh të punoj sepse i vlerësoj efektet", jo "Duhet të punoj". (2) Brenda situatave të kufizuara, gjej micro-choices të vërteta (koha, mënyra, radhitja). (3) Locus of Control i brendshëm (Rotter, 1966): njerëzit që besojnë se rezultatet varen nga veprimet e tyre janë shëndetësorë dhe akademikisht më të suksesshëm.',
    ],
  },

  /* ─── COMMUNITY ──────────────────────────────────────────────────── */
  {
    id: 53, platformCat: 'community',
    title: 'Accountability Partners: Shkenca pas sistemit më të fuqishëm të zakoneve',
    category: 'Komunitet',
    excerpt: 'Studimi i ASTD: gjasat e përfundimit të qëllimit rriten nga 10% (vetëm ideja) në 95% (takim fiks me partner). Pse dhe si funksionon.',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80',
    date: '16 Maj 2026', readTime: '5 min', author: 'NeuroSphera', featured: true,
    content: [
      'American Society of Training and Development (ASTD): gjasat e përfundimit të qëllimit janë 10% nëse keni vetëm idenë, 25% nëse vendosni afatin, 65% nëse planifikoni si ta bëni, dhe 95% nëse keni takim fiks me partner accountability.',
      'Mekanizmat psikologjikë: (1) Social commitment: njerëzit vlerësojnë konsistencën me premtimet e tyre publike (Cialdini). (2) Identity reinforcement: deklarimi i qëllimit para dikujt tjetër forcon identitetin e ri. (3) Positive peer pressure: dëshira për të mos zhgënjyer partnerin.',
      'Si të gjeni partner: Ideali është dikush me qëllime të ngjashme por jo identike (shmang konkurrencën e panevojshme). Struktura e takimit javor: 10 min çfarë bëre javën e kaluar, 5 min çfarë dështoi dhe pse, 10 min qëllimet e javës tjetër. Platformat: komunitetin tonë të Discord, grupin e Facebook ose thjesht WhatsApp me mik.',
    ],
  },
  {
    id: 54, platformCat: 'community',
    title: 'Arti i diskutimit shkencor: Si të debatoni pa konflikte bosh',
    category: 'Komunitet',
    excerpt: 'Shumica e debateve online janë emocion, jo arsye. Kjo udhëzues praktike të mëson si të diskutoni ideat me integritet intelektual.',
    image: 'https://images.unsplash.com/photo-1507537297879-f86f8e5faffb?auto=format&fit=crop&w=800&q=80',
    date: '18 Maj 2026', readTime: '5 min', author: 'NeuroSphera', featured: false,
    content: [
      'Hierarkia e argumenteve (Paul Graham): (1) Ad hominem (sulm personi), niveli më i ulët. (2) Kundërvënie ton-i. (3) Kundërvënie pa argumente. (4) Kundërvënie me argumente. (5) Refutim. (6) Refutim i pikës qendrore, niveli më i lartë. Shumica e debateve online qëndrojnë në nivelet 1-3.',
      '"Steel-manning" vs "Straw-manning": para se të kundërshtosh, formuloje argumentin e kundërt sa më fortë mundesh. Nëse nuk mund ta bësh këtë, nuk e ke kuptuar plotësisht pozicionin tjetër dhe nuk je gati të debatosh.',
      'Rregullat e komunitetit tonë: (1) Sulmoni idetë, jo personat. (2) Citoni burime kur bëni pretendime faktike. (3) Pranoni gabimin publikisht kur ka prova kundër: kjo është shenjë force, jo dobësie. (4) "I agree with parts of X, but I think Y because Z" është struktura produktive e diskutimit.',
    ],
  },
  {
    id: 55, platformCat: 'community',
    title: 'Mentor Connect: Si të gjeni mentorin e duhur në çdo fushë',
    category: 'Komunitet',
    excerpt: 'Mentori i duhur mund të zvogëlojë kurbën e mësimit me vite. Por shumica e njerëzve nuk dinë si t\'i qasen. Udhëzues praktik.',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    date: '20 Maj 2026', readTime: '6 min', author: 'NeuroSphera', featured: false,
    content: [
      'Studimi i Sun Microsystems: punonjësit me mentor kishin 5x ngritje në karrierë krahasuar me ata pa mentor. Por "mentorim" sot nënkupton shumë gjëra: nga njohuritë procedurale ("si bëhet X") te wisdom-i strategjik ("si të mendosh rreth X").',
      'Si të gjeni mentor: (1) Identifikoni 3-5 persona që admironi dhe janë 5-10 vjet para jush në rrugën tuaj. (2) Studioni punën e tyre: lexoni shkrimet, ndiqni projektet. (3) Kontaktoni me email specifik: "Kam lexuar [punën specifike]. Kam [pyetje specifike]. A keni 20 minuta?" Jo: "Amund të jeni mentori im?" (4) Vlerësoni kohën e tyre: vini të përgatitur, kini pyetje specifike, ndani progres.',
      'Platforma jonë Mentor Connect ofron lidhje mes anëtarëve të komunitetit me ekspertizë specifike dhe kërkues në faza fillestare. Apliko nëpërmjet profilit tënd dhe specifiko fushën, nivelin dhe çfarë lloji mentorimi kërkon.',
    ],
  },

  {
    id: 25, platformCat: 'community',
    title: 'Si të ndërtosh grup studimi efektiv në 5 hapa',
    category: 'Komunitet',
    excerpt: 'Grupe studimi funksionojnë ose nuk funksionojnë varësisht nga struktura. Këtu janë 5 kushtet e suksesit.',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
    date: '6 Maj 2026', readTime: '5 min', author: 'NeuroSphera', featured: true,
    content: [
      '(1) Madhësia: 3-5 persona. Me 6+ grupet bëhen ineffective (social loafing). (2) Frekuenca: takime javore të rregullta, jo "kur kemi kohë". Konsistenca ndërton momentum.',
      '(3) Struktura e takimit: 10 min recap individual, 30 min diskutim aktiv, 10 min plan për javën tjetër. Pa strukturë, takimet bëhen bisedë sociale. (4) Accountability: çdo anëtar deklaron qëllimin e javës dhe jep llogari.',
      '(5) Rotacioni i roleve: lehtësuesi, kronometri, note-taker, ku rolet rrotullohen çdo javë. Kjo siguron angazhim aktiv nga të gjithë. Platformat: Discord për komunitet online, Notion për shënime të përbashkëta.',
    ],
  },
  {
    id: 26, platformCat: 'community',
    title: 'Sfida kolektive: 21 ditë pa ekran pas darkës',
    category: 'Komunitet',
    excerpt: '847 anëtarë pranuan sfidën. Pas 21 ditësh pa telefon/TV pas orës 21:00, ja çfarë raportuan.',
    image: 'https://images.unsplash.com/photo-1516912481808-3406841bd33c?auto=format&fit=crop&w=800&q=80',
    date: '14 Maj 2026', readTime: '5 min', author: 'NeuroSphera', featured: false,
    content: [
      'Drita blu nga ekranet pengon prodhimin e melatoninës me 2-3 orë, duke shtypur ciklin cirkadian. 847 anëtarë të komunitetit tonë pranuan sfidën: asnjë ekran pas orës 21:00 për 21 ditë.',
      'Rezultatet pas 21 ditësh: 78% raportuan gjumë cilësor brenda javës së parë. 65% raportuan rritje energjie matinale. 82% zbuluan kohë të lirë që e shpenzuan me lexim, bisedë ose hobby.',
      'Anëtarja Drita H.: "Ditët e para ishin shumë të vështira: arrija telefonin automatikisht. Por pas javës 2, trupi im nuk kishte nevojë për atë stimul. Sot nuk kthehem kurrë." Bashkohuni sfidës sonë të radhës. Fillimi: 1 Qershor.',
    ],
  },
]

export const QA_LIST = [
  {
    id: 1, name: 'Anonim', category: 'Ankth',
    question: 'Si mund ta kontrolloj ankthin para prezantimeve publike? Tremb shumë dhe harroj gjithçka.',
    answer: 'Ankthi para prezantimeve është shumë i zakonshëm: 75% e njerëzve e raportojnë si frikën e tyre kryesore. Disa strategji: (1) Riinterpretimi: "jam i aktivizuar dhe gati", jo "jam i frikuar"; (2) Praktika e ekspozimit gradual; (3) Box breathing 5 minuta para hyrjes; (4) Fokusimi te mesazhi, jo te vetja.',
    date: '15 Prill 2026', likes: 47,
  },
  {
    id: 2, name: 'Anonim', category: 'Gjumë',
    question: 'Nuk fle mirë prej muajsh. Çfarë mund të bëj pa ilaçe?',
    answer: 'CBT-I ka 80% efektivitet: (1) Kufizimi i gjumit: qëndro zgjuar deri në orën e caktuar; (2) Kontrolli i stimulusit: shtrati vetëm për gjumë; (3) Higjiena e gjumit: orari fiks, dhomë 18-20°C, pa ekrane 1 orë para; (4) Relaksimi progresiv muskulor çdo mbrëmje.',
    date: '18 Prill 2026', likes: 38,
  },
  {
    id: 3, name: 'Anonim', category: 'Marrëdhënie',
    question: 'Si ta di nëse jam në marrëdhënie toksike apo kemi mosmarrëveshje normale?',
    answer: 'Dallimi kryesor: mosmarrëveshjet normale zgjidhen dhe dy persona respektojnë njëri-tjetrin. Shenjat e toksicitetit: poshtërimi i vazhdueshëm, izolimi nga miqtë, ndjenja e frikës, kontrolli. Pyete veten: "A ndihem i/e lirë të jem vetja?"',
    date: '20 Prill 2026', likes: 52,
  },
  {
    id: 4, name: 'Anonim', category: 'Vetëbesim',
    question: 'Ndihem i/e pavlerë në punë edhe pse kolegët thonë se bëj mirë. Pse?',
    answer: 'Kjo quhet "Sindroma e Impostorëve", fenomen shumë i zakonshëm. Truri selektivisht vëren gabimet dhe injoron sukseset. Strategjia: (1) Mbaj ditar suksesesh; (2) Kur merr kompliment, thuaj "faleminderit" pa e minimizuar; (3) Kupto se pasiguria nuk do të thotë paaftësi.',
    date: '22 Prill 2026', likes: 61,
  },
]
