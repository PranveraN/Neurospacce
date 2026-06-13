import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = dirname(__filename)

// Article metadata for OG tags (id, title, excerpt, image)
const ARTICLES = [
  { id: 1, title: 'Çfarë ndodh në tru gjatë ankthit?', excerpt: 'Zbuloni si reagimi "lufto ose ik" ndikon në trurin tuaj dhe strategjitë efektive për ta menaxhuar çdo ditë.', image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=1200&q=80' },
  { id: 2, title: 'Mindfulness: Si të jetosh në çastin e tanishëm', excerpt: 'Teknikat e mindfulness-it mund të transformojnë mënyrën si përjetojmë stresin dhe ankthin e përditshëm.', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80' },
  { id: 3, title: 'Gjumi dhe shëndeti mendor: Lidhja e fshehur', excerpt: 'Mungesa e gjumit dhe problemet mendore kanë lidhje të thellë. Zbuloni si të prishni ciklin negativ.', image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=1200&q=80' },
  { id: 4, title: 'CBT: Si të ndryshosh mendimet negative', excerpt: 'Terapia Kognitive-Sjellore është ndër metodat më të studiuara. Mëso si ta zbatosh vetë çdo ditë.', image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1200&q=80' },
  { id: 5, title: 'Vetëbesimi: Ku fillon dhe si ndërtohet', excerpt: 'Vetëbesimi nuk është diçka që ose e ke ose nuk e ke: është aftësi që ndërtohet me kohë dhe praktikë të vazhdueshme.', image: 'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?auto=format&fit=crop&w=1200&q=80' },
  { id: 6, title: 'Marrëdhëniet toksike: Si t\'i njohësh dhe largohesh', excerpt: 'Shenjat paralajmëruese të marrëdhënieve toksike dhe hapat konkretë drejt shëndetit emocional.', image: 'https://images.unsplash.com/photo-1474552226712-ac0f0961a954?auto=format&fit=crop&w=1200&q=80' },
  { id: 7, title: 'Frymëmarrja si mjet kundër stresit', excerpt: 'Teknikat e frymëmarrjes mund të qetësojnë sistemin nervor brenda minutave. Shkencërisht provuar.', image: 'https://images.unsplash.com/photo-1529543544282-ea669407fca3?auto=format&fit=crop&w=1200&q=80' },
  { id: 8, title: 'Depresioni: Kuptimi i vërtetë i sëmundjes', excerpt: 'Depresioni nuk është "trishtim" dhe nuk zgjidhset "duke u gëzuar." Çfarë thotë neuroshkenca moderne.', image: 'https://images.unsplash.com/photo-1527866959630-8f781e0de0ac?auto=format&fit=crop&w=1200&q=80' },
  { id: 9, title: 'Neuroplasticitet: Si truri ndryshon gjatë gjithë jetës', excerpt: 'Truri ynë nuk është i fiksuar: ai rimodëlohet çdo ditë. Zbuloni si ta drejtoni këtë ndryshim me vetëdije.', image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80' },
  { id: 10, title: 'Spaced Repetition: Shkenca e memorjes afatgjatë', excerpt: 'Pse mësojmë gjëra dhe i harrojmë brenda ditësh? Spaced repetition e zgjidh këtë problem definitivisht.', image: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?auto=format&fit=crop&w=1200&q=80' },
  { id: 11, title: 'Active Recall: Teknika #1 e studentëve kampionë', excerpt: 'Rileximi është iluzion studimi. Active recall, vetë-testimi aktiv, rrit retensionin me mbi 50%.', image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80' },
  { id: 12, title: 'Feynman teknika: Mëso çdo gjë duke shpjeguar', excerpt: 'Nëse nuk mund ta shpjegosh thjeshtë, nuk e ke kuptuar vërtet. Richard Feynman e dinte këtë para të gjithëve.', image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80' },
  { id: 13, title: 'Deep Work: 4 orë fokus i plotë ndryshojnë gjithçka', excerpt: 'Cal Newport argumenton: aftësia për të punuar pa distraftime është super-fuqi e shekullit 21. Ja si e ndërtoni.', image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80' },
  { id: 14, title: 'Flow State: Neuroshkenca e produktivitetit maksimal', excerpt: 'Çfarë ndodh në tru kur jemi "në zonë" dhe si ta aktivizojmë këtë gjendje me vetëdije çdo ditë?', image: 'https://images.unsplash.com/photo-1485988412941-77a8a93ab3a8?auto=format&fit=crop&w=1200&q=80' },
  { id: 15, title: 'Prokrastinami: Shkaqet biologjike dhe mënyra e çlirimit', excerpt: 'Prokrastinami nuk është dembelësi, por rregullim emocional. Kuptimi i kësaj ndryshon gjithçka.', image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&w=1200&q=80' },
  { id: 16, title: 'Sfida 30-ditore e meditimit: Çfarë ndodh me trurin', excerpt: 'Ndërmora sfidën: 10 minuta meditim çdo ditë për 30 ditë. Rezultatet me skanim MRI ishin të papritura.', image: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=1200&q=80' },
  { id: 17, title: 'Biohacking i thjeshtë: 5 protokolle me prova shkencore', excerpt: 'Biohacking nuk do të thotë implante dhe suplemente ekzotike. Këtu janë 5 intervenime me bazë solide shkencore.', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=80' },
  { id: 18, title: 'Nga burnout-i te ringjallja: Historia e Arianit', excerpt: 'Pas 3 vitesh si software engineer nën presion ekstrem, Arianit u gjet me zero energji. Çfarë bëri pastaj.', image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80' },
  { id: 19, title: 'Si ndërtova zakonet e mia brenda 90 ditësh', excerpt: 'Nuk kisha asnjë zakon të mirë të qëndrueshëm. Pas 90 ditësh eksperimentimi me metoda shkencore, ja çfarë funksionoi.', image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=1200&q=80' },
  { id: 20, title: '10 libra bazë: Neuroshkencë, psikologji & produktivitet', excerpt: 'Lista e kuruar me kujdes nga ekipi ynë: librat që kanë ndikuar më shumë mbi shkencën dhe vetë-zhvillimin.', image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1200&q=80' },
  { id: 21, title: 'Podcast-et shkencore që duhet të dëgjoni çdo javë', excerpt: 'Nga neuroshkenca te psikologjia praktike: podcast-et me cilësinë më të lartë shkencore, të kuruar nga ekspertët tanë.', image: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1200&q=80' },
  { id: 22, title: 'Aplikacione falas të verifikuara për mendjen dhe produktivitetin', excerpt: 'Nuk keni nevojë të paguani shumë: këto aplikacione falas ofrojnë veçori shkencore të provuara.', image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80' },
  { id: 23, title: 'Pse Gjenerata Z ka krizë fokusi dhe si ta adresojmë', excerpt: 'Studimi i Microsoft: kohëzgjatja mesatare e vëmendjes ra nga 12 në 8 sekonda. Por problemi nuk është gjenerata, por mjedisi.', image: 'https://images.unsplash.com/photo-1622396481328-9b1b78cdd9fd?auto=format&fit=crop&w=1200&q=80' },
  { id: 24, title: 'Gjumi dhe kreativiteti: Çfarë thotë neuroshkenca', excerpt: 'Zbuloni lidhjet shkencore midis gjumit, emosioneve dhe kapacitetit kreativ të trurit sipas hulumtimeve më të fundit.', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=1200&q=80' },
  { id: 25, title: 'Si të ndërtosh grup studimi efektiv në 5 hapa', excerpt: 'Grupe studimi funksionojnë ose nuk funksionojnë varësisht nga struktura. Këtu janë 5 kushtet e suksesit.', image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80' },
  { id: 26, title: 'Sfida kolektive: 21 ditë pa ekran pas darkës', excerpt: '847 anëtarë pranuan sfidën. Pas 21 ditësh pa telefon/TV pas orës 21:00, ja çfarë raportuan.', image: 'https://images.unsplash.com/photo-1516912481808-3406841bd33c?auto=format&fit=crop&w=1200&q=80' },
  { id: 27, title: 'Dopamina vs serotonina: Ndryshimi që duhet të kuptosh', excerpt: 'Të dy quhen "hormoni i lumturisë", por funksionojnë ndryshe. Kuptimi i dallimit ndryshon mënyrën si menaxhon motivimin.', image: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=1200&q=80' },
  { id: 28, title: 'Nervus Vagus: Çelësi i sistemit nervor parasimpatik', excerpt: 'Nervi më i gjatë i trupit kontrollon zemrën, mushkëritë dhe zorrën. Aktivizimi i tij e kthen trupin nga "alarm" në "qetësi".', image: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=1200&q=80' },
  { id: 29, title: 'Psikiatria nutricionale: Si ushqimi modelon mendjen', excerpt: 'Meta-analiza 2022 (Jacka): dieta mesdhetare zvogëlon riskun e depresionit me 33%. Ushqimi është farmakologji e përditshme.', image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80' },
  { id: 30, title: 'Kortizoli kronik: Armiku i heshtur i trurit tuaj', excerpt: 'Stresi i shkurtër është adaptiv. Stresi kronik dëmton fizikisht hipokampusin, qendrën e kujtesës. Çfarë tregon shkenca.', image: 'https://images.unsplash.com/photo-1493836512294-502baa1986e2?auto=format&fit=crop&w=1200&q=80' },
  { id: 31, title: 'Teknika Cornell: Sistemi i shënimeve që mëson Harvard-i', excerpt: 'Zhvilluar nga Walter Pauk, 1950. Mësohet sot nga universitetet kryesore botërore si standardi i shënimeve efektive.', image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=1200&q=80' },
  { id: 32, title: 'Interleaving: Studimi i ndërkëmbyer rrit performancën 43%', excerpt: 'Shumica studiojnë temën A plotësisht, pastaj B, pastaj C. Interleaving i ndërkëmben: rezultatet shkencore habiten.', image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&q=80' },
  { id: 33, title: 'Metacognitioni: Arti i të mësuarit si të mësosh', excerpt: 'Studentët me metacognition të lartë mësojnë 2x më shpejt, jo sepse janë më të zgjuar, por sepse e dinë si funksionon mendja e tyre.', image: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?auto=format&fit=crop&w=1200&q=80' },
  { id: 34, title: 'Gjuha e dytë pas 30 vjeç: Çfarë thotë neuroshkenca', excerpt: 'Miti "pas 18 vjeç nuk mëson dot gjuhë" është i rrezuar shkencërisht. Truri adult ka avantazhe unike nëse i shfrytëzon siç duhet.', image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=1200&q=80' },
  { id: 35, title: 'Teknika Pomodoro: Shkenca pas 25 minutave', excerpt: 'Francesco Cirillo e zhvilloi me një kohëmatës domate. Sot e përdorin miliona. Por pse funksionon neurologjikisht?', image: 'https://images.unsplash.com/photo-1508780709619-79562169bc64?auto=format&fit=crop&w=1200&q=80' },
  { id: 36, title: 'Kronotipi dhe pikul kognitiv: Puna në orën e duhur', excerpt: '8 orë punë nuk kanë kuptim pa ditur KUJDES jeni kognitivisht në nivel maksimal. Çdonjëri ka "orën e artë" ditore.', image: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?auto=format&fit=crop&w=1200&q=80' },
  { id: 37, title: 'GTD (Getting Things Done): Zbraz mendjen për të menduar', excerpt: '"Mendja duhet të jetë si ujë", pa barrë detyrave të paplasifikuara. GTD e zbraz mendjen për të menduar, jo për të mbajtur mend.', image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=1200&q=80' },
  { id: 38, title: 'Distraksionet dixhitale: Kostoja kognitive e njoftimeve', excerpt: 'Çdo njoftim i telefonit kushton 23 minuta rikuperim fokusi. Studjuesit e Microsoft e matën. Çfarë mund të bëjmë konkretisht?', image: 'https://images.unsplash.com/photo-1455849318743-b2233052fcff?auto=format&fit=crop&w=1200&q=80' },
  { id: 39, title: '21 ditë pa sheqer të shtuar: Protokolli dhe efektet', excerpt: 'Çfarë ndodh me energjinë, fokusin dhe disponimin kur eliminon sheqerin e shtuar për 21 ditë. Protokoll i plotë me gjurmim.', image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=1200&q=80' },
  { id: 40, title: 'Sfida 30-ditore kognitive: Dual N-Back, meditim dhe lexim aktiv', excerpt: 'Kombinim i tre teknikave me bazë shkencore: 55 minuta/ditë për 30 ditë. Protokoll i plotë me matje para dhe pas.', image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=1200&q=80' },
  { id: 41, title: 'Journaling shkencor: 15 minuta që ristrukturojnë trurin', excerpt: 'James Pennebaker (UT Austin): shkrimi ekspresiv redukton kortizolin, forcon imunitetin dhe ndryshon strukturën e trurit. Protokoll praktik.', image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80' },
  { id: 42, title: 'Protokolli 8-javësh i gjumit optimal (CBT-I vetë-zbatim)', excerpt: 'CBT-I adaptuar si protokoll pa terapis. 8 javë, 5 strategji klinike të provuara. 76% efektivitet i raportuar pa ilaçe.', image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=1200&q=80' },
  { id: 43, title: 'Nga depresioni tek maratona: Historia e Valdrinit', excerpt: 'Pas diagnostikimit me depresion klinik në moshën 27, Valdrini zgjodhi lëvizjen fizike si terapinë kryesore. 18 muaj më vonë: maratona.', image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80' },
  { id: 44, title: 'Sindroma e impostorëve tek mjekësia: Historia e Floritës', excerpt: 'Pas 6 vitesh Mjekësi me nota shkëlqyeshme, Florita ende ndihej "mashtruese". Si e doli nga cikli i vetëdyshimit?', image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1200&q=80' },
  { id: 45, title: 'Si një startup zbatoi neuroshkencën në kulturën e punës', excerpt: 'Eliminuan mbledhjet e mëngjesit, zbatuan deep work blocks dhe No-Meeting Fridays. Produktiviteti u rrit 28% brenda 3 muajsh.', image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80' },
  { id: 46, title: '10 kurse online falas nga Harvard, MIT dhe Stanford', excerpt: 'Harvard, MIT, Stanford dhe Yale ofrojnë kurse falas mbi psikologjinë, neuroshkencën dhe produktivitetin. Lista e kuruar me kujdes.', image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=1200&q=80' },
  { id: 47, title: '7 studime themelore që riformuan psikologjinë moderne', excerpt: 'Nga eksperimenti i Milgram-it te Attachment Theory: hulumtimet që çdo person i informuar duhet t\'i njohë.', image: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=1200&q=80' },
  { id: 48, title: 'Kanalet YouTube të verifikuara për neuroshkencë dhe psikologji', excerpt: 'Jo çdo kanal "shkencor" është i besueshëm. Lista jonë është filtruar: vetëm me referenca peer-reviewed dhe ekspertë të verifikuar.', image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=1200&q=80' },
  { id: 49, title: 'Si të aksesoni hulumtimet shkencore falas: Udhëzues praktik', excerpt: 'Shumica e studimeve janë pas "paywall", por ka mënyra legale dhe falas. Udhëzuesi i plotë për aksesimin e shkencës pa pagesë.', image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=1200&q=80' },
  { id: 50, title: 'Paradoksi i zgjedhjes: Pse 40 opsione na bëjnë ngordhur', excerpt: 'Barry Schwartz tregoi: më shumë opsione = më pak lumturi. Neuroshkenca e konfirmon. Ja si ta reduktoni "decision fatigue".', image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1200&q=80' },
  { id: 51, title: 'Efekti Dunning-Kruger: Shkenca pas vetëbesimit të paarsyeshëm', excerpt: 'Pse ata që dinë më pak janë shpesh më konfidentë? Dhe pse ekspertët dyshojnë në veten? Shkencë dhe strategji praktike.', image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80' },
  { id: 52, title: 'Agjencia e perceptuar: Pse kontrolli imagjinar shpëton jetë', excerpt: 'Ellen Langer (Harvard) dha bimë dhome rezidentëve: grupi me "kontroll" kishte 50% vdekshmëri më të ulët. Çfarë na mëson kjo?', image: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80' },
  { id: 53, title: 'Accountability Partners: Shkenca pas sistemit më të fuqishëm të zakoneve', excerpt: 'Studimi i ASTD: gjasat e përfundimit të qëllimit rriten nga 10% (vetëm ideja) në 95% (takim fiks me partner). Pse dhe si funksionon.', image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80' },
  { id: 54, title: 'Arti i diskutimit shkencor: Si të debatoni pa konflikte bosh', excerpt: 'Shumica e debateve online janë emocion, jo arsye. Kjo udhëzues praktike të mëson si të diskutoni ideat me integritet intelektual.', image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80' },
  { id: 55, title: 'Mentor Connect: Si të gjeni mentorin e duhur në çdo fushë', excerpt: 'Mentori i duhur mund të zvogëlojë kurbën e mësimit me vite. Por shumica e njerëzve nuk dinë si t\'i gjejnë.', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80' },
]

const SITE_URL = 'https://myneurosphera.com'
const SITE_IMAGE = 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=1200&q=80'

let _baseHtml = null

function getBaseHtml() {
  if (_baseHtml) return _baseHtml
  // Try multiple paths — Vercel bundles includeFiles relative to project root (/var/task)
  const candidates = [
    join(process.cwd(), 'dist', 'index.html'),
    join(__dirname, '..', 'dist', 'index.html'),
    join(__dirname, 'dist', 'index.html'),
    join(process.cwd(), 'index.html'),
  ]
  for (const p of candidates) {
    try { _baseHtml = readFileSync(p, 'utf8'); return _baseHtml } catch {}
  }
  // Bare-minimum fallback so the function always returns valid HTML
  _baseHtml = '<!DOCTYPE html><html lang="sq"><head><title>NeuroSphera</title></head><body></body></html>'
  return _baseHtml
}

function esc(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

// Strip all Unsplash params and rebuild cleanly — avoids the ?→& bug from partial param removal
function forceJpeg(imgUrl) {
  if (!imgUrl || !imgUrl.includes('unsplash.com')) return imgUrl
  const [base] = imgUrl.split('?')
  return `${base}?w=1200&h=630&fit=crop&fm=jpg&q=80`
}

function injectOG(html, { title, description, image, url }) {
  const img = forceJpeg(image)
  const tags = [
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta property="og:image" content="${esc(img)}" />`,
    `<meta property="og:image:secure_url" content="${esc(img)}" />`,
    `<meta property="og:image:type" content="image/jpeg" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${esc(title)}" />`,
    `<meta property="og:url" content="${esc(url)}" />`,
    `<meta property="og:type" content="article" />`,
    `<meta property="og:site_name" content="NeuroSphera" />`,
    `<meta property="og:locale" content="sq_AL" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(title)}" />`,
    `<meta name="twitter:description" content="${esc(description)}" />`,
    `<meta name="twitter:image" content="${esc(img)}" />`,
    `<meta name="twitter:image:alt" content="${esc(title)}" />`,
  ].join('\n    ')

  return html
    .replace(/<meta\s+property="og:[^"]*"[^>]*\/?>/gi, '')
    .replace(/<meta\s+name="twitter:[^"]*"[^>]*\/?>/gi, '')
    .replace(/<\/head>/i, `  ${tags}\n  </head>`)
}

export default function handler(req, res) {
  const id = parseInt(req.query.id)
  const article = ARTICLES.find(a => a.id === id)

  const html = getBaseHtml()

  if (!article) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
    return res.send(html)
  }

  const enriched = injectOG(html, {
    title: article.title + ' — NeuroSphera',
    description: article.excerpt,
    image: article.image,
    url: `${SITE_URL}/articles/${article.id}`,
  })

  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=3600')
  res.send(enriched)
}
