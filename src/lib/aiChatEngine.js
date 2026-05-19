// ── Ethical AI Chat Engine ────────────────────────────────────────────────────
// Safe, limited, CBT/WHO/APA-aligned mental health guidance.
// Articles are linked directly to /articles/:id (real library routes).

export const TOPICS = {
  anxiety:      { label: 'Ankth',       color: '#ef4444', bg: '#ef444415', icon: '😰', grad: ['#ef4444','#f97316'] },
  depression:   { label: 'Depresion',   color: '#3b82f6', bg: '#3b82f615', icon: '😔', grad: ['#3b82f6','#6366f1'] },
  stress:       { label: 'Stres',       color: '#f97316', bg: '#f9731615', icon: '😤', grad: ['#f97316','#ef4444'] },
  sleep:        { label: 'Gjumë',       color: '#6366f1', bg: '#6366f115', icon: '😴', grad: ['#6366f1','#8b5cf6'] },
  overthinking: { label: 'Overthinking',color: '#8b5cf6', bg: '#8b5cf615', icon: '🌀', grad: ['#8b5cf6','#a855f7'] },
  burnout:      { label: 'Burnout',     color: '#ec4899', bg: '#ec489915', icon: '🔋', grad: ['#ec4899','#8b5cf6'] },
  family:       { label: 'Familje',     color: '#10b981', bg: '#10b98115', icon: '👨‍👩‍👧', grad: ['#10b981','#06b6d4'] },
  confidence:   { label: 'Vetëbesim',   color: '#f59e0b', bg: '#f59e0b15', icon: '💪', grad: ['#f59e0b','#f97316'] },
  focus:        { label: 'Fokus',       color: '#06b6d4', bg: '#06b6d415', icon: '🎯', grad: ['#06b6d4','#3b82f6'] },
}

const TOPIC_KEYWORDS = {
  anxiety:      ['ankth','frikë','panik','anksioze','shqetëso','druaj','nervoz','tremb','frikëso'],
  depression:   ['trishtim','depresion','trishtë','shpresë','dështim','zbrazëti','asgjë','nuk dua','nuk mundem'],
  stress:       ['stres','ngarkesë','presion','lodhur','sfidë','shumë punë','nuk arrij'],
  sleep:        ['gjumë','fle','insomni','zgjoh','natën','pagjumësi'],
  overthinking: ['mendoj shumë','overthink','mendime','nuk ndal','rrotull','kokë'],
  burnout:      ['burnout','ezauruar','kuptim','heq dorë','dua të lë','pa energji'],
  family:       ['familje','prindër','fëmijë','nënë','babë','bashkëshort','bashkëshorte','çift','martesë','divorc'],
  confidence:   ['vetëbesim','ndihem keq','nuk jam','inferior','frikë nga gjykimi','dyshoj veten'],
  focus:        ['fokus','vëmendje','koncentrim','adhd','shpërhap','produktivitet','harroj'],
}

export function detectTopic(text) {
  const lower = text.toLowerCase()
  for (const [topic, kws] of Object.entries(TOPIC_KEYWORDS)) {
    if (kws.some(kw => lower.includes(kw))) return topic
  }
  return null
}

// ── Real articles from the library, keyed by topic ────────────────────────────
// Route: /articles/:id  (ArticleDetail page)

export const ARTICLES_BY_TOPIC = {
  anxiety: [
    { id: 1,  title: 'Çfarë ndodh në tru gjatë ankthit?',         category: 'Ankth',       readTime: '5 min', image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=400&q=80' },
    { id: 30, title: 'Kortizoli Kronik: Armiku i Heshtur i Trurit', category: 'Ankth',       readTime: '6 min', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
  ],
  depression: [
    { id: 8,  title: 'Depresioni: Kuptimi i vërtetë i sëmundjes', category: 'Depresion',   readTime: '7 min', image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=400&q=80' },
    { id: 3,  title: 'Gjumi dhe shëndeti mendor: Lidhja e fshehur', category: 'Gjumë',     readTime: '6 min', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=400&q=80' },
  ],
  stress: [
    { id: 7,  title: 'Frymëmarrja si mjet kundër stresit',         category: 'Mindfulness', readTime: '4 min', image: 'https://images.unsplash.com/photo-1474418397713-7eff674c03e8?auto=format&fit=crop&w=400&q=80' },
    { id: 30, title: 'Kortizoli Kronik: Armiku i Heshtur i Trurit', category: 'Ankth',       readTime: '6 min', image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=400&q=80' },
  ],
  sleep: [
    { id: 3,  title: 'Gjumi dhe shëndeti mendor: Lidhja e fshehur', category: 'Gjumë',     readTime: '6 min', image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=400&q=80' },
    { id: 42, title: 'Protokolli 8-Javësh i Gjumit Optimal (CBT-I)', category: 'Labs',      readTime: '8 min', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=400&q=80' },
  ],
  overthinking: [
    { id: 2,  title: 'Mindfulness: Si të jetosh në çastin e tanishëm', category: 'Mindfulness', readTime: '4 min', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=400&q=80' },
    { id: 1,  title: 'Çfarë ndodh në tru gjatë ankthit?',         category: 'Ankth',       readTime: '5 min', image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=400&q=80' },
  ],
  burnout: [
    { id: 18, title: 'Nga Burnout-i te Ringjallja: Historia e Arianit', category: 'Studim Rasti', readTime: '6 min', image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&q=80' },
    { id: 7,  title: 'Frymëmarrja si mjet kundër stresit',         category: 'Mindfulness', readTime: '4 min', image: 'https://images.unsplash.com/photo-1474418397713-7eff674c03e8?auto=format&fit=crop&w=400&q=80' },
  ],
  family: [
    { id: 6,  title: 'Marrëdhëniet toksike: Si t\'i njohësh',     category: 'Marrëdhënie', readTime: '5 min', image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=400&q=80' },
    { id: 2,  title: 'Mindfulness: Si të jetosh në çastin e tanishëm', category: 'Mindfulness', readTime: '4 min', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=400&q=80' },
  ],
  confidence: [
    { id: 5,  title: 'Vetëbesimi: Ku fillon dhe si ndërtohet',     category: 'Vetëbesim',   readTime: '5 min', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80' },
    { id: 4,  title: 'CBT: Si të ndryshosh mendimet negative',     category: 'CBT',         readTime: '5 min', image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=400&q=80' },
  ],
  focus: [
    { id: 13, title: 'Deep Work: 4 Orë Fokus i Plotë Ndryshojnë Gjithçka', category: 'Produktivitet', readTime: '6 min', image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&q=80' },
    { id: 35, title: 'Teknika Pomodoro: Shkenca Pas 25 Minutave',  category: 'Produktivitet', readTime: '4 min', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=400&q=80' },
  ],
}

// ── AI responses per topic, per depth ────────────────────────────────────────

const RESPONSES = {
  anxiety: [
    `Kuptoj që je nën ankth tani — dhe kjo ndjesi është e vështirë, jo dobësi.

🌬️ **Box Breathing** — provo tani:
→ Merr frymë ngadalë: 1…2…3…4
→ Mbaj: 1…2…3…4
→ Nxirr: 1…2…3…4
→ Mbaj: 1…2…3…4
→ Përsërit 3-4 herë

Kjo teknikë aktivizon sistemin parasimptetik brenda 60–90 sekondave. Si ndihesh pas pak çastesh? 🙂`,
    `Ankthi ndodh kur amigdala — "alarmi" i trurit — aktivizohet edhe pa rrezik real. Truri yt po të mbron, edhe kur nuk ka asnjë kërcënim faktik. Kjo nuk është diçka "e çrregullt" — kjo është biologia.

Këta artikuj nga biblioteka jonë shpjegojnë si funksionon dhe si ta menaxhosh:`,
    `Kemi eksploruar disa teknika dhe burime të dobishme. Ankthi i vazhdueshëm trajtohet më mirë me mbështetje profesionale. Kam identifikuar specialisten e duhur për gjendjen tuaj:`,
  ],
  depression: [
    `Faleminderit që e ndajë këtë me mua — nuk është e lehtë të flasësh për të ndjyerën rëndë.

🧘 **Aktivizim i vogël sjellor** — hapi i parë:
→ Ngritu dhe pi një gotë ujë tani
→ Hap dritaren ose dil 2 minuta jashtë
→ Shkruaj 1 gjë të vogël pozitive nga sot

Aktivizimi sjelljor — edhe i vogël — ndihmon trurin të dalë nga spiralet depresive. Si e fillon ditën sot? 🤍`,
    `Ndjenjat që opisë mund të lidhen me mënyrën si truri përpunon emocionet gjatë periudhave të vështira. Nuk je "i thyer" — je njerëzor.

Këta artikuj nga biblioteka jonë ofrojnë perspektivë shkencore:`,
    `Kemi biseduar disa herë. Ndjenjat e tua meritojnë mbështetje profesionale. Specialisti i mëposhtëm punon pikërisht me këtë:`,
  ],
  stress: [
    `Stresi i lartë është njëra nga gjendjet më të zakonshme — por nuk duhet të jetosh me të.

💆 **PMR i Shpejtë** (3 minuta):
→ Shtrire ose ulje i qetë
→ Tërhiq grushtat fort 5 sekonda, lëro papritur
→ Vazhdo me supet — ngrit, mbaj, lëro
→ Frymëmarrje e thellë 3 herë

Çfarë është burimi kryesor i stresit sot? 💬`,
    `Stresi kronik ndikon korteksin paraballor — zonën e trurit për vendimmarrje dhe rregullim emocional. Kjo shpjegon pse gjithçka duket më e vështirë kur je nën presion.

Artikujt e mëposhtëm nga biblioteka jonë japin strategji praktike:`,
    `Stresi i zgjatur kërkon mbështetje profesionale. Specialistja e mëposhtme punon me menaxhimin e stresit:`,
  ],
  sleep: [
    `Gjumi i keq ndikon në çdo aspekt tjetër — humor, energji, mendim. Kuptoj pse ndihesh kështu.

🌙 **Higjiena e gjumit** — 3 rregulla për sonte:
→ Ndalo ekranin 60 min para gjumit
→ Temperatura e dhomës: 18-20°C
→ Nëse nuk fle pas 20 min — ngritu, lexo 10 min, kthehu

Sa kohë ke probleme me gjumin? 🌛`,
    `Gjumi dhe shëndeti mendor janë të lidhur bidireksionalisht. Mungesa e gjumit ndikon humorin, dhe humor i keq ndikon gjumin.

Artikujt e mëposhtëm nga biblioteka jonë, me protokolle të provuara shkencërisht:`,
    `Insomnia e zgjatur trajtohet shumë efektivisht me mbështetje profesionale. Dr. Gashi është specialist i gjumit:`,
  ],
  overthinking: [
    `Kur mendja nuk ndalet, kjo mund të jetë shenjë se po përpunon diçka të rëndësishme.

🧠 **ACT Defusion** — 2 minuta:
→ Identifiko mendimin përsëritës
→ Thuaji vetes: *"Kam mendimin se..."*
→ Imagjinoje si re kalimtare në qiell
→ Lëre të kalojë, kthehu te frymëmarrja

Cili është mendimi që të vjen shpesh sot? 💭`,
    `Overthinking-u shpesh lidhet me nevojën e kontrollit ose me trajtimin e pasigurisë. Truri kërkon zgjidhje — por rrotullimi nuk është zgjidhje.

Lexo këta artikuj nga biblioteka jonë:`,
    `Nëse overthinking-u ndikon jetën tuaj çdo ditë, biseda me specialist ndihmon të identifikoni modelet:`,
  ],
  burnout: [
    `Burnout-i nuk është dobësi — është sinjali i trurit dhe trupit se burimet janë ezauruar.

⚡ **Stop & Reset** — tani:
→ Ndalo çdo aktivitet jourgient
→ 5 frymëmarrje të thella
→ Identifiko 1 gjë që mund ta lësh sot
→ Planifiko 30 minuta "zero output"

Sa kohë ndihesh kështu? 🔋`,
    `Burnout-i klinik ka 3 dimensione: ezaurimin emocional, depersonalizimin dhe uljen e ndjenjës së kompetencës.

Lexo historitë dhe strategjitë nga biblioteka jonë:`,
    `Burnout-i i moderuar-rëndë kërkon mbështetje profesionale. Specialistja e mëposhtme punon me rikuperimin:`,
  ],
  family: [
    `Dinamikat familjare mund të jenë nga sfidat më komplekse emocionale. Faleminderit që e ndajë.

🤝 **Komunikimi Jo-Violent** — teknikë e shpejtë:
→ *"Ndihem i/e fyer kur..."* (jo "ti gjithmonë...")
→ *"Kam nevojë për..."* (trego çfarë dëshiron)
→ *"Do të donit...?"* (pyet, mos supozohet)

Çfarë situate familjare ju shqetëson më shumë? 💙`,
    `Konfliktet familjare shpesh lindin nga nevojat e pakomunikuara. Nuk jeni "fajtorë" — keni nevojë për mjete të reja.

Artikujt e mëposhtëm nga biblioteka jonë:`,
    `Dinamikat familjare komplekse trajtohen me terapi çiftesh ose familjeje. Specialistja Drita Halili është eksperte EFT:`,
  ],
  confidence: [
    `Vetëbesimi i ulët shpesh vjen nga "besimet automatike negative" — mendimet kritike të brendshme që i marrim si të vërteta.

⭐ **CBT Restrukturim** — 3 hapa:
→ Shkruaj 1 mendim vetëkritik që ke sot
→ Pyet: *Ku është evidence-a reale?*
→ Reformulo: *"Edhe pse... unë gjithsesi..."*

Cili është mendimi vetëkritik më i shpeshtë sot? 💛`,
    `Vetëbesimi i ulët shpesh ka rrënjë të thella. Kjo nuk është diçka që "korigjosh" vetëm me mendje.

Artikujt e mëposhtëm nga biblioteka jonë:`,
    `Puna e thellë mbi vetëbesimin bëhet më efektivisht me mbështetje profesionale:`,
  ],
  focus: [
    `Vështirësia e fokusit mund të ketë shumë shkaqe — nga lodhja mendore, stresi, deri te ADHD.

🎯 **Pomodoro + Ndërgjegjësia:**
→ Vendos timer 25 minuta
→ 1 detyrë, telefon në modalitet "mos shqetëso"
→ Kur mendja endet — thuaj *"mendim"* dhe kthehu
→ 5 minuta pushim pas çdo cikli

Sa vështirë të duket fokusimi krahasuar me 6 muaj më parë? 🧩`,
    `Problemet e fokusit shpesh lidhen me mbingarkesën kognitive ose gjumin e pakët.

Lexo artikujt e mëposhtëm nga biblioteka jonë:`,
    `Nëse problemet e fokusit janë të vazhdueshme, vlerësimi profesional sqaron shkaqet dhe zgjidhjet:`,
  ],
}

const DEFAULT_RESPONSES = [
  `Jam këtu të dëgjoj. Si ndihesh saktësisht tani? Kjo do të më ndihmojë të ofrojë mbështetjen e duhur. 🤍`,
  `Kuptoj. A mund të tregosh pak më shumë rreth asaj çfarë po kalon? Ku ndihesh më shumë ngarkesë sot? 💬`,
  `Faleminderit për besimin. Mund t\'i lidheni me një nga specialistët tanë për mbështetje të thelluar:`,
]

// ── Expert mapping ────────────────────────────────────────────────────────────

const EXPERT_IDS = {
  anxiety:      'elsa-krasniqi',
  depression:   'mentor-gashi',
  stress:       'arjeta-berisha',
  sleep:        'mentor-gashi',
  overthinking: 'elsa-krasniqi',
  burnout:      'valbona-curri',
  family:       'drita-halili',
  confidence:   'arjeta-berisha',
  focus:        'blerim-hoxha',
  default:      'arjeta-berisha',
}

// ── Public API ────────────────────────────────────────────────────────────────

export function getResponse(topic, depth) {
  const pool = topic ? RESPONSES[topic] : DEFAULT_RESPONSES
  const idx  = Math.min(depth, pool.length - 1)
  return pool[idx]
}

export function getArticlesForTopic(topic) {
  return ARTICLES_BY_TOPIC[topic] || ARTICLES_BY_TOPIC.anxiety
}

export function getExpertIdForTopic(topic) {
  return EXPERT_IDS[topic] || EXPERT_IDS.default
}

export function getStep(depth) {
  if (depth === 0) return 0
  if (depth === 1) return 1
  return 2
}

export const MAX_DEPTH = 4
