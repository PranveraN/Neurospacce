// ── Crisis keywords ───────────────────────────────────────────────────────────
export const CRISIS_WORDS = [
  'vetëvrasje','vras veten','dua të vdes','nuk dua të jetoj',
  's\'ka kuptim','heq dorë nga jeta','fund i gjithçkaje',
  'dëmtoj veten','dua të lë gjithçka',
]

// ── Emotion starters shown before first message ───────────────────────────────
export const EMOTION_STARTERS = [
  { id:'anxiety',      emoji:'😰', label:'Jam nën ankth',        color:'#f97316' },
  { id:'stress',       emoji:'😤', label:'Jam nën stres',         color:'#ef4444' },
  { id:'tired',        emoji:'😴', label:'Ndihem i/e lodhur',     color:'#6366f1' },
  { id:'focus',        emoji:'🌀', label:'Kam probleme me fokus', color:'#38bdf8' },
  { id:'overthinking', emoji:'💭', label:'Mendoj shumë',          color:'#a855f7' },
  { id:'empty',        emoji:'🫧', label:'Ndihem bosh',           color:'#818cf8' },
  { id:'burnout',      emoji:'🔋', label:'Ndihem i mbingarkuar',  color:'#ec4899' },
]

// ── Topic → colour ────────────────────────────────────────────────────────────
export const TOPIC_COLOR = {
  anxiety:'#f97316', stress:'#ef4444', tired:'#6366f1',
  focus:'#38bdf8', overthinking:'#a855f7', empty:'#818cf8', burnout:'#ec4899',
}

// ── Rotating AI responses per topic (indexed by conversation depth) ───────────
export const RESPONSES = {
  anxiety: [
    `Mund të duket sikur mendja nuk po ndalet — dhe kjo është e lodhshme. 💙\n\nAnkthi e mban trupin në gjendje alarmi edhe kur nuk ka rrezik real. Nuk është dobësi. Është truri që mundohet të të mbrojë.\n\n✨ **Teknikë e shpejtë:** Gjej 5 objekte rreth teje dhe emërtoji ngadalë. Kjo e ankoron mendjen tek e tashmja.`,
    `Ankthi shpesh vjen në valë — rritet, arrin pikun, pastaj kalon. 🌊\n\nNjë nga teknikat më efektive klinike është **Box Breathing** — i njëjti ushtrim i Navy SEALs — që e qetëson sistemin nervor brenda 90 sekondave.\n\nDo të provonim bashkë tani?`,
    `Ti ke bërë shumë duke ndier këtë dhe duke folur për të. 🤍\n\nAnkthi kronik meriton mbështetje profesionale — jo sepse je i/e sëmurë, por sepse meriton vegla të duhura. Terapia CBT e personalizuar ka rezultate të provuara shkencërisht.`,
  ],
  stress: [
    `Stresi i vazhdueshëm e lodhë trupin dhe mendjen njëkohësisht. 🫧\n\nAderimi ndaj shumë gjërave njëherësh i kalon kapacitetin e trurit. Nuk duhet të mbash gjithçka vetëm.\n\n✨ **Teknikë e çastit:** Marr 3 frymëmarrje të thella dhe listoni mentalitet 3 gjëra urgjente nga ato "të mundshme". Kjo e ruan korteksin prefrontal aktiv.`,
    `Cortizoli kronik — hormoni i stresit — ndikon drejtpërdrejt gjumin, fokusi dhe humorin. 🧠\n\nNjë nga modelet më efektive për stres është **Matrica Eisenhower**: ndani detyrat në Urgjent/Jo Urgjent × Të Rëndësishme/Jo Të Rëndësishme.\n\nDo të krijonim bashkë prioritetet e ditës suaj?`,
    `Stresi i zgjatur pa mbështetje mund të çojë në burnout — dhe kjo ndodh gradualisht. 🌿\n\nNuk duhet të arrish deri atje. Një sesion me psikolog mund të të ndihmojë të kuptosh burimet e stresit dhe të ndërtosh mekanizma konkretë mbrojtjeje.`,
  ],
  tired: [
    `Lodhja nuk është gjithmonë fizike — shpesh është emocionale ose mendore. 🌙\n\nKur trupi thotë "mjaft", zakonisht i ka dhënë shumë pa marrë mjaftueshëm.\n\n✨ **Teknikë e çastit:** Mbyllni sytë 60 sekonda dhe vëni vëmendjen vetëm tek frymëmarrja. Jo zgjidhje, vetëm pranim.`,
    `Ekzistojnë 7 lloje lodhje: fizike, mendore, emocionale, sociale, kreative, shpirtërore, shqisore. 💡\n\nNjohja e llojit ndihmon të zgjedhësh rimëkëmbjen e duhur — jo gjithmonë gjumi, por herë-herë izolim i qetë, lëvizje e lehtë, ose kontakt njerëzor.\n\nCilin lloj lodhje e ndjeni ju tani?`,
    `Lodhja e zgjatur mund të jetë shenjë burnout-i ose anemie — dy kushte shumë të ndryshme. 🌱\n\nNë të dy rastet, mbështetja profesionale e personalon rrugën e rikuperimit. Nuk duhet të e gjeje vetëm.`,
  ],
  focus: [
    `Kur vëmendja shpërhapet, shpesh nuk ka të bëjë me disiplinë — ka të bëjë me ngarkesë të fshehtë mendore. 🎯\n\nTruri me overload kalon në modalitet "skaning" dhe nuk mund të hyjë thellë. Kjo ndodh me të gjithë.\n\n✨ **Teknikë e çastit:** Bëj vetëm 1 gjë për 10 minutat e ardhshme — pa telefon, pa njoftime. Vetëm 1.`,
    `Teknika **Pomodoro** tregon se truri punon më mirë me cikle 25 min punë + 5 min pushim. 🍅\n\nPo ashtu, **Neurogjurmët**: muzikë binaurale (40 Hz gamma) rrit fokusin me 12% sipas studimeve UCLA.\n\nDo të krijonim bashkë një seancë fokus 25-minutëshe tani?`,
    `Vëmendja kronike e shpërhapuë mund të tregojë ADHD, ankth latent, ose burnout mendor. 🔍\n\nNjë psikolog mund të bëjë vlerësim të shkurtër dhe të propozojë strategji të personalizuara — jo gjithmonë ilaç, shpesh vetëm teknika kognitive.`,
  ],
  overthinking: [
    `Mendimi i tepërt nuk është defekt — është truri që kërkon të zgjidhë diçka pa mjaftueshëm informacion. 💭\n\nPor kur mendja rrotullohet pa asnjë veprim, konsumon energji pa prodhuar zgjidhje.\n\n✨ **Teknikë e çastit:** Emërtoji mendimet: "Kjo është shqetësim", "Kjo është analizë", "Kjo është frikë". Emërtimi i zvogëlon fuqinë automatikisht.`,
    `"Worry Time" është teknikë e CBT: cakto 15 minuta në ditë vetëm për t'u shqetësuar — me vetëdije. Jashtë asaj kohe, kur mendja shkon atje, thuaj: "Tani jo, kam kohë për këtë." 🕰️\n\nStudimet tregojnë se kjo redukton overthinking-un me 45% pas 2 javësh.`,
    `Overthinking kronik mund të jetë simptomë e ankthit të gjeneralizuar (GAD) ose OCD të lehtë. 🧩\n\nNjë psikolog CBT e di saktë si ta "rimëkëmbësh" sistemin e mendimit — dhe rezultatet janë shumë premtuese me 8-12 sesione.`,
  ],
  empty: [
    `Ndjesia e zbrazëtisë emocionali është e vështirë për t'u shpjeguar — por shumë e vërtetë. 🌫️\n\nShpesh vjen pas periudhave intensive, pas humbjes, ose kur jemi ndarë nga vetja.\n\n✨ **Teknikë e çastit:** Prek diçka fizike rreth teje — sipërfaqen e tryezës, të ftohtit të ajrit. Shqisat rikthejnë praninë kur emocionet janë larg.`,
    `"Emotional numbing" ose bllokimi emocional është një mekanism mbrojtës — truri ndalon ndjenjat kur janë shumë. 🔒\n\nNuk do të thotë se je i/e thyer. Do të thotë se ke mbajtur shumë pa mbështetje.\n\nCilja hap i vogël mund të bëjë ndryshim sot?`,
    `Zbrazëtia e zgjatur meriton vëmendje — jo vetëm "vazhdo". 🌱\n\nPsikologu mund të të ndihmojë të kuptosh çfarë ke mbyllur brenda dhe të gjesh rrugën pa force, pa gjykim.`,
  ],
  burnout: [
    `Burnout-i nuk ndodh brenda natës — ndërtohet gradualisht, fazë pas faze. 🔋\n\nFaza 1: entuziazëm. Faza 2: stagnacion. Faza 3: frustracion. Faza 4: apati. Faza 5: kolaps.\n\n✨ **Teknikë e çastit:** Mendoj se ku ndodhesh tani — dhe dija vetëm kjo tregon se ke vetëdije, gjë shumë e rëndësishme.`,
    `Rikuperimi nga burnout-i kërkon **rimëkëmbje të strukturuar** — jo vetëm pushim. 🌿\n\nHapat: (1) Zvogëlo ngarkesën: jo gjithçka, por një gjë. (2) Rikthe kufij. (3) Cakto 20 min në ditë vetëm për ty. (4) Lëvizje e lehtë.\n\nCili nga këto hapa duket i mundshëm sot?`,
    `Burnout-i i patrajtuar çon në probleme shëndetësore afatgjata. 🏥\n\nNjë psikolog specialist burnout-i mund të ndërtojë me ty plan konkret rikuperimi — hap pas hapi, pa presion.`,
  ],
}

// ── Contextual chips shown after each AI response ─────────────────────────────
export const CHIP_SETS = {
  anxiety: [
    { id:'box', emoji:'🫁', label:'Box Breathing',       action:'technique:box_breathing', color:'#38bdf8' },
    { id:'grd', emoji:'🌿', label:'5-4-3-2-1 Grounding', action:'technique:grounding',    color:'#22c55e' },
    { id:'art', emoji:'📖', label:'Pse ndodh ankthi?',   action:'article:anxiety',         color:'#6366f1' },
    { id:'bdy', emoji:'🧘', label:'Body scan relaks',    action:'technique:body_scan',     color:'#8b5cf6' },
    { id:'ask', emoji:'💬', label:'Pyet psikologun',     action:'ask_psychologist',        color:'#fbbf24' },
    { id:'bk',  emoji:'📅', label:'Rezervo takim',       action:'booking',                 color:'#ec4899' },
  ],
  stress: [
    { id:'box', emoji:'🌬️', label:'Box Breathing',      action:'technique:box_breathing', color:'#38bdf8' },
    { id:'rst', emoji:'☕', label:'Pushim 5-min',         action:'technique:rest',          color:'#fbbf24' },
    { id:'art', emoji:'📖', label:'Stres apo burnout?',  action:'article:burnout',         color:'#6366f1' },
    { id:'prt', emoji:'📋', label:'Prioritizo detyrat',  action:'technique:priority',      color:'#22c55e' },
    { id:'ask', emoji:'💬', label:'Pyet psikologun',     action:'ask_psychologist',        color:'#a855f7' },
    { id:'bk',  emoji:'📅', label:'Rezervo takim',       action:'booking',                 color:'#ec4899' },
  ],
  tired: [
    { id:'slp', emoji:'😴', label:'Ndihmë për gjumë',    action:'technique:sleep',         color:'#6366f1' },
    { id:'eng', emoji:'☀️', label:'Ritual energjie',     action:'technique:rest',          color:'#fbbf24' },
    { id:'art', emoji:'📖', label:'Llojet e lodhjes',    action:'article:tired',           color:'#818cf8' },
    { id:'brn', emoji:'🌙', label:'Kontrollo burnout',   action:'switch:burnout',          color:'#ec4899' },
    { id:'brh', emoji:'🫁', label:'Frymëmarrje energji', action:'technique:box_breathing', color:'#38bdf8' },
    { id:'ask', emoji:'💬', label:'Pyet psikologun',     action:'ask_psychologist',        color:'#a855f7' },
  ],
  focus: [
    { id:'foc', emoji:'🎯', label:'Fokus 25-min',          action:'technique:focus_reset',  color:'#38bdf8' },
    { id:'dis', emoji:'📵', label:'Shmang shpërqendrimet', action:'technique:distraction',  color:'#22c55e' },
    { id:'art', emoji:'📖', label:'Pse truri = mjegull?',  action:'article:focus',          color:'#6366f1' },
    { id:'pln', emoji:'📋', label:'Mini-plan',             action:'technique:priority',     color:'#fbbf24' },
    { id:'ask', emoji:'💬', label:'Fol me ekspert',        action:'ask_psychologist',       color:'#a855f7' },
    { id:'bk',  emoji:'📅', label:'Rezervo takim',         action:'booking',                color:'#ec4899' },
  ],
  overthinking: [
    { id:'grd', emoji:'🌿', label:'5-4-3-2-1 Grounding',  action:'technique:grounding',    color:'#22c55e' },
    { id:'art', emoji:'📖', label:'Pse mendja nuk ndalet?',action:'article:overthinking',   color:'#6366f1' },
    { id:'jrl', emoji:'✍️', label:'Shkruaj mendimet',     action:'navigate:journal',        color:'#8b5cf6' },
    { id:'stp', emoji:'🧠', label:'Ndalo overthinking',   action:'technique:body_scan',     color:'#a855f7' },
    { id:'ask', emoji:'💬', label:'Fol me dikë',          action:'ask_psychologist',        color:'#fbbf24' },
    { id:'bk',  emoji:'📅', label:'Rezervo takim',        action:'booking',                 color:'#ec4899' },
  ],
  empty: [
    { id:'grd', emoji:'🌊', label:'Ankorohu tani',        action:'technique:grounding',    color:'#38bdf8' },
    { id:'jrl', emoji:'✍️', label:'Shpreh veten',         action:'navigate:journal',       color:'#8b5cf6' },
    { id:'art', emoji:'📖', label:'Çfarë është numbing?', action:'article:empty',          color:'#818cf8' },
    { id:'bdy', emoji:'🧘', label:'Aktivizim i lehtë',    action:'technique:body_scan',    color:'#a855f7' },
    { id:'ask', emoji:'💬', label:'Pyet psikologun',      action:'ask_psychologist',       color:'#fbbf24' },
    { id:'bk',  emoji:'📅', label:'Rezervo takim',        action:'booking',                color:'#ec4899' },
  ],
  burnout: [
    { id:'rst', emoji:'🌱', label:'Rikuperim gradual',     action:'technique:rest',          color:'#22c55e' },
    { id:'art', emoji:'📖', label:'Burnout apo lodhje?',   action:'article:burnout',         color:'#6366f1' },
    { id:'ask', emoji:'💬', label:'Pyet psikologun',       action:'ask_psychologist',        color:'#fbbf24' },
    { id:'bk',  emoji:'📅', label:'Rezervo takim',         action:'booking',                 color:'#ec4899' },
    { id:'slp', emoji:'🌙', label:'Prioritizo gjumin',     action:'switch:tired',            color:'#a855f7' },
    { id:'box', emoji:'🫁', label:'Frymëmarrje qetësuese', action:'technique:box_breathing', color:'#38bdf8' },
  ],
}

// ── Guided techniques ─────────────────────────────────────────────────────────
export const TECHNIQUES = {
  box_breathing: {
    title:'Box Breathing', subtitle:'4-4-4-4 — Teknikë Navy SEALs', color:'#38bdf8', emoji:'🫁', rounds:4,
    phases: [
      { label:'Merr frymë', dur:4, dir:1  },
      { label:'Mbaj',       dur:4, dir:0  },
      { label:'Nxirr',      dur:4, dir:-1 },
      { label:'Mbaj',       dur:4, dir:0  },
    ],
    benefit:'Aktivizon nervusin vagal dhe e ul kortizolin brenda 90 sekondave.',
  },
  grounding: {
    title:'5-4-3-2-1 Grounding', subtitle:'Ankorohu në të tanishme', color:'#22c55e', emoji:'🌿',
    steps: [
      { num:5, sense:'shoh',   prompt:'Gjej 5 gjëra që mund t\'i SHIKOSH tani.' },
      { num:4, sense:'prek',   prompt:'Gjej 4 gjëra që mund t\'i PREKËSH.' },
      { num:3, sense:'dëgjon', prompt:'Dëgjo 3 TINGUJ rreth teje.' },
      { num:2, sense:'nuhas',  prompt:'Identifiko 2 AROMA (ose imagjino 2 që i do).' },
      { num:1, sense:'shijoj', prompt:'Identifiko 1 SHIJE (ose ndjeje gojën tënde).' },
    ],
    benefit:'Ndërpret spiralen e ankthit duke riaktivizuar shqisat.',
  },
  body_scan: {
    title:'Body Scan', subtitle:'Relaksim progresiv 3-min', color:'#8b5cf6', emoji:'🧘',
    steps: [
      { label:'Koka & Qafa',      dur:30, instruction:'Vëre çdo tension. Lëre të shkojë me frymëmarrjen.' },
      { label:'Shpatullat',       dur:30, instruction:'Ul shpatullat. Ndieje peshën duke rënë.' },
      { label:'Gjoksi & Beli',    dur:30, instruction:'Me çdo frymëmarrje, gjoksi zgjerohet dhe relaksohet.' },
      { label:'Krahët & Duart',   dur:30, instruction:'Lëri të rëndë, si letër e lagur.' },
      { label:'Kofshët & Këmbët', dur:30, instruction:'Ndieje tokën nën ty. Ti je i/e sigurt këtu.' },
      { label:'Trupi tërësor',    dur:30, instruction:'Breathe. Pranoj. Jam i/e pranishëm tani.' },
    ],
    benefit:'Redukton tensionin fizik dhe aktivizon sistemin parasympathetik.',
  },
  rest: {
    title:'Pushim i Vetëdijshëm', subtitle:'5 minuta vetëm për ty', color:'#fbbf24', emoji:'☕',
    steps: [
      { label:'Distancohuni',   dur:60, instruction:'Largohuni nga ekrani. Vendoseni telefonin me fytyrë poshtë.' },
      { label:'Diçka e ngrohtë',dur:60, instruction:'Bëni çaj, kafe, ose ujë. Mbajeni me të dyja duart.' },
      { label:'Shikoni jashtë', dur:60, instruction:'Shikoni dritaren ose çdo pikë të largët. Sy të butë.' },
      { label:'Frymëmarrje',    dur:60, instruction:'3 frymëmarrje të thella. Vetëm kaq.' },
      { label:'Kthehuni',       dur:60, instruction:'Kthehuni kur jeni gati — jo para.' },
    ],
    benefit:'Pushimi aktiv e rivendos kapacitetin kognitiv të trurit.',
  },
  priority: {
    title:'Mini-Plan Prioritetesh', subtitle:'Matrica Eisenhower', color:'#22c55e', emoji:'📋',
    steps: [
      { label:'Urgjent + Rëndësishëm',      dur:45, instruction:'Shkruaj detyrat që DUHET të bëni SOT. (Max 3)' },
      { label:'Rëndësishëm, jo urgjent',    dur:45, instruction:'Shkruaj detyrat e rëndësishme por jo emergjente. Planifikoi për javën.' },
      { label:'Urgjent, jo rëndësishëm',    dur:45, instruction:'Çfarë mund të delegohet? Delegoje ose eliminoje.' },
      { label:'Jo urgjent, jo rëndësishëm', dur:45, instruction:'Kjo është lista "Jo". Hiqe pa faj.' },
    ],
    benefit:'E strukturon mendjen dhe zvogëlon ngarkesën kognitive.',
  },
  focus_reset: {
    title:'Fokus Reset 25-min', subtitle:'Metoda Pomodoro e Modifikuar', color:'#38bdf8', emoji:'🎯',
    steps: [
      { label:'Cakto detyrën', dur:30,   instruction:'Shkruaj VETËM 1 detyrë konkrete. Jo listë, vetëm 1.' },
      { label:'Eliminimi',     dur:30,   instruction:'Hiqni telefon nga tavolina. Mbyllni tab-et e panevojshëm.' },
      { label:'25 min punë',   dur:1500, instruction:'Punom. Nëse mendja shkot, shkruaj diku dhe rikthehu.' },
      { label:'5 min pushim',  dur:300,  instruction:'Lëvizni! Mos lexoni lajme. Vetëm shtrihuni ose ecni.' },
      { label:'Vlerëso',       dur:30,   instruction:'Sa u bë? Festoni punën e bërë — pa gjykim.' },
    ],
    benefit:'Rrit produktivitetin me 40% dhe e ul lodhjen kognitive.',
  },
  distraction: {
    title:'Anti-Shpërqendrim', subtitle:'Strategji Neuroshkencore', color:'#22c55e', emoji:'📵',
    steps: [
      { label:'Identifiko burin',  dur:45, instruction:'Cili aparat/app të shpërhap më shumë? Telefoni? Emaili?' },
      { label:'Faza "Pa telefon"', dur:60, instruction:'Vendoseni telefon në të hyrë ose dhomë tjetër. Jo pocket.' },
      { label:'Njoftimet',         dur:60, instruction:'Çaktivizo të gjitha njoftime veç thirrjeve. Vetem 2x check/ditë.' },
      { label:'Mjedisi',           dur:45, instruction:'Tavolina e pastër = mendje e pastër. Hiqni 5 gjëra nga sytë.' },
    ],
    benefit:'Mjedisi fizik kontrollon 80% të fokusit — jo vetëm vullneti.',
  },
  sleep: {
    title:'Ritual Gjumi', subtitle:'Protokolli CBT-I', color:'#6366f1', emoji:'🌙',
    steps: [
      { label:'Ora 21:00',      dur:60,  instruction:'Ul ndriçimin. Ekranë kaltër fshehin hormonin e gjumit (melatonin).' },
      { label:'Ora 21:30',      dur:60,  instruction:'Ndaloni punën. Truri ka nevojë 2h të "mbyllet".' },
      { label:'4-7-8 Breathing',dur:120, instruction:'Merr frymë 4s, mbaj 7s, nxirr 8s. Përsërit 4 herë.' },
      { label:'Gjumë-Ora',      dur:60,  instruction:'Zgohuni gjithmonë në të njëjtën orë — madje edhe fundjavë.' },
    ],
    benefit:'Gjumi i strukturuar përmirësohet me 60-70% pas 2 javësh rutinë.',
  },
}

// ── Booking constants ─────────────────────────────────────────────────────────
export const BOOK_CATEGORIES = ['Me ankth','Stres & burnout','Depresion','Çrregullim gjumi','Marrëdhënie','Tjetër']
export const TIME_SLOTS = ['09:00','10:30','12:00','14:00','15:30','17:00']

// ── Quick-advice tips (8 per topic) ──────────────────────────────────────────
export const TIPS = {
  anxiety: [
    { id:'a1', text:'Merr 3 frymëmarrje: frymë 4s, mbaj 2s, nxirr 6s. Aktivizon nervusin vagal dhe ul kortizolin.' },
    { id:'a2', text:'Gjej 5 gjëra që mund t\'i shohësh tani. Ankorimi te e tashmja ndërpret spiralen e ankthit.' },
    { id:'a3', text:'Shkruaj frikën tënde në letër. Ta nxjerrësh nga koka redukton intensitetin me 40%.' },
    { id:'a4', text:'Dillo ujë të ftohtë mbi kyçet. Aktivizon refleksin vagal dhe qetëson sistemin nervor.' },
    { id:'a5', text:'Thuaj me zë: "Kjo do të kalojë. Jam i sigurt tani." Emërtimi qetëson amigdalën.' },
    { id:'a6', text:'Shtriju dhe shtypni shpaten në dysheme 30 sekonda — grounding fizik i menjëhershëm.' },
    { id:'a7', text:'Prek diçka me teksturë — liri, letër, muri. Shqisat ankorojnë mendjen te e tashmja.' },
    { id:'a8', text:'Bëj 4-7-8: frymë 4s, mbaj 7s, nxirr 8s. Ndal spiralen e ankthit brenda 60 sekondave.' },
  ],
  stress: [
    { id:'s1', text:'Bëj 2 minuta shtrirje të shpatullave. Tensioni fizik zvogëlon stresin mendor me 30%.' },
    { id:'s2', text:'Listo 3 gjëra urgjente dhe lër gjithçka tjetër mënjanë përkohësisht. Thjeshto.' },
    { id:'s3', text:'Dil jashtë 5 minuta. Ndriçimi natyral rregullon kortizolin e lartësuar.' },
    { id:'s4', text:'Thuaj "jo" ndaj 1 gjëje sot. Vendosja e kufijve është vetëkujdes, jo egoizëm.' },
    { id:'s5', text:'Largohuni nga tavolina 1 herë në orë. Trupi nuk mbahet produktiv pa lëvizje.' },
    { id:'s6', text:'Dëgjo 1 këngë që të qetëson. Muzika ndikon drejtpërdrejt sistemin autonomik nervor.' },
    { id:'s7', text:'Bëj 10 ngritje të shpejtë. Endorfinat janë antistres natyral pa efekte anësore.' },
    { id:'s8', text:'Pi ujë ngadalë. Dehidratimi i fshehtë përkeqëson stresin dhe tensionin me 20%.' },
  ],
  tired: [
    { id:'t1', text:'20 minuta gjumë i ditës rindëzin trurin pa shkaktuar inertie gjumi. Vendos alarm.' },
    { id:'t2', text:'Pi ujë. Lodhja shpesh është dehidratim i maskuar nga mendja si lodhje mendore.' },
    { id:'t3', text:'Hap dritaret. Oksigjeni i freskët aktivizon korteksin prefrontal brenda minutave.' },
    { id:'t4', text:'Shko te drita natyrore 5 minuta. Ritmi cirkadian ndikon drejtpërdrejt energjinë.' },
    { id:'t5', text:'Ha diçka me protein. Sheqeri i gjakut ndikon drejtpërdrejt energjinë mendore.' },
    { id:'t6', text:'Bëj 10 minuta ecje të lehtë. Qarkullimi i gjakut rrit energjinë me 40%.' },
    { id:'t7', text:'Reduktoni kafeinën pas 14:00. Penalizon ciklin e gjumit dhe e thellëson lodhjen.' },
    { id:'t8', text:'Bëj shtrirje të brezit — shumë lodhje vjen nga tensioni i fshehtë postural.' },
  ],
  focus: [
    { id:'f1', text:'Shkruaj vetëm 1 detyrë konkrete tani. Multi-tasking redukton produktivitetin me 40%.' },
    { id:'f2', text:'Vendos telefonin në dhomë tjetër. Larg syve, larg mendjes — studim i provuar shkencërisht.' },
    { id:'f3', text:'Pune 25 min, pushim 5 min. Pomodoro mbron kapacitetin kognitiv gjatë ditës.' },
    { id:'f4', text:'Mbyll të gjitha skedat veç 1. Context switching harxhon 23 minuta rikuperim.' },
    { id:'f5', text:'Dëgjo zhurmë të bardhë ose muzikë instrumentale. Redukton shpërhapjen me 28%.' },
    { id:'f6', text:'Shkruaj distraksionet në letër ("parking lot") — rikthehu te ato pas punës.' },
    { id:'f7', text:'Bëj 5 frymëmarrje të thella para fillimit. Aktivizon korteksin prefrontal.' },
    { id:'f8', text:'Cakto bllok kohor për email/Whatsapp — jo "kur vjen njoftimi", por 2× në ditë.' },
  ],
  overthinking: [
    { id:'o1', text:'Cakto "Kohën e Shqetësimit" — 15 min në ditë vetëm për t\'u shqetësuar me qëllim.' },
    { id:'o2', text:'Pyete veten: "A do ta kujtoj këtë pas 5 vitesh?" Relativizon shumicën e frikave.' },
    { id:'o3', text:'Shkruaj mendimin shumë herë. Shprehja e tij e zbeh fuqinë emocionale.' },
    { id:'o4', text:'Emërtoje: "Kjo është frikë, jo fakt." Distanca kognitive redukton fuqinë e mendimit.' },
    { id:'o5', text:'Ndrysho ambient. Trupi ndryshon gjendjen mendore kur ndryshon hapësira fizike.' },
    { id:'o6', text:'Fol me zë me veten. Eksternalizimi i mendimeve i bën ata më të menaxhueshëm.' },
    { id:'o7', text:'Bëj diçka me duart — gatim, modelim. Angazhimi motor ndërpret ruminimin.' },
    { id:'o8', text:'Vendos limit: "Kam 10 minuta të mendoj, pastaj veproj ose lë." Respektoje.' },
  ],
  empty: [
    { id:'e1', text:'Prek diçka të ftohtë dhe real — muri, ujë, tokë. Shqisat rikthejnë praninë.' },
    { id:'e2', text:'Dëgjo 1 këngë me tekst kuptimplotë. Muzika ngjall emocionet e bllokuara.' },
    { id:'e3', text:'Shkruaj 3 gjëra që ishin të bukura sot — madje edhe minimale, edhe kafja e mëngjesit.' },
    { id:'e4', text:'Dërgoji dikujt "si je?" — kontakti i vogël mund të kthejë ngrohtësi të papritur.' },
    { id:'e5', text:'Shko jashtë dhe vëzhgoja 1 detaj natyror — pemë, qiell, shpend. Vetëm 1.' },
    { id:'e6', text:'Haje diçka të ngrohtë ngadalë. Ngrohtësia dhe shija aktivizojnë ndjenjat.' },
    { id:'e7', text:'Bëj diçka rutinë e njohur — dusha, pastrimi. Struktura qetëson boshllëkun.' },
    { id:'e8', text:'Lejoni vetes të mos ndiheni mirë tani. Rezistenca e emocionit e zgjat atë.' },
  ],
  burnout: [
    { id:'b1', text:'Zvogëlo 1 detyrim sot — jo gjithçka, por vetëm 1. Kufijtë janë ilaç, jo dobësi.' },
    { id:'b2', text:'Bëj diçka vetëm për kënaqësi — pa produktivitet, pa arsye. Vetëm sepse të pelqen.' },
    { id:'b3', text:'Fshi 1 gjë nga lista — jo shtyje, jo delego, fshi. Nuk bëhet gjithçka.' },
    { id:'b4', text:'Cakto orën e fundit të punës dhe respektoje si mbledhje me CEO-n.' },
    { id:'b5', text:'Merr 1 ditë "jo-produktive" pa faj. Truri ka nevojë për modalitet idle.' },
    { id:'b6', text:'Fol me dikë që të dëgjon pa gjykim. Izolimi e intensifikon burnout-in.' },
    { id:'b7', text:'Prioritizo gjumin mbi gjithçka. Lodhja kognitive nuk zgjidhet me kafeinë.' },
    { id:'b8', text:'Gjej 1 moment dite vetëm yti — kafe në heshtje, shëtitje, faqe libri.' },
  ],
}

// ── Follow-up chips shown in QuickAdviceCard ──────────────────────────────────
export const FOLLOWUP_CHIPS = [
  { id:'tech',  emoji:'🧘', label:'Teknikë qetësuese', action:'technique:box_breathing', color:'#38bdf8' },
  { id:'art',   emoji:'📖', label:'Lexo artikull',      action:'article:anxiety',         color:'#6366f1' },
  { id:'ask',   emoji:'💬', label:'Pyet psikologun',    action:'ask_psychologist',        color:'#fbbf24' },
  { id:'bk',    emoji:'📅', label:'Rezervo takim',      action:'booking',                 color:'#ec4899' },
  { id:'sleep', emoji:'🌙', label:'Ndihmë për gjumë',   action:'technique:sleep',         color:'#8b5cf6' },
]

// ── Utilities ─────────────────────────────────────────────────────────────────

/**
 * @param {string} text
 * @returns {'anxiety'|'stress'|'tired'|'focus'|'overthinking'|'burnout'|'empty'|null}
 */
export function detectTopic(text) {
  const t = text.toLowerCase()
  if (['ankth','panik','frikë','ankthos','nën ankth'].some(k => t.includes(k)))          return 'anxiety'
  if (['stres','ngarkuar','presion','mbingarkuar'].some(k => t.includes(k)))             return 'stress'
  if (['lodh','gjumë','fle','rraskapit','pa energji'].some(k => t.includes(k)))          return 'tired'
  if (['fokus','koncentr','vëmendje','shpërhap','mjegull'].some(k => t.includes(k)))     return 'focus'
  if (['mendoj shumë','overthink','mendime','nuk ndal','rrotull'].some(k => t.includes(k))) return 'overthinking'
  if (['burn','ezaur','kuptim','heq dorë','apati'].some(k => t.includes(k)))             return 'burnout'
  if (['bosh','vakëti','zbrazët','numb'].some(k => t.includes(k)))                       return 'empty'
  return null
}

/** @param {string} text  @returns {boolean} */
export function isCrisis(text) {
  const t = text.toLowerCase()
  return CRISIS_WORDS.some(w => t.includes(w))
}

/** @returns {string} "HH:MM" in sq-AL locale */
export function nowTime() {
  return new Date().toLocaleTimeString('sq-AL', { hour:'2-digit', minute:'2-digit' })
}

/**
 * @param {string} topic
 * @param {Set<string>} [usedIds] - tip IDs already shown; excluded from pool
 * @returns {{ id: string, text: string }}
 */
export function pickRandomTip(topic, usedIds = new Set()) {
  const pool = (TIPS[topic] || TIPS.anxiety).filter(t => !usedIds.has(t.id))
  if (!pool.length) return (TIPS[topic] || TIPS.anxiety)[0]
  return pool[Math.floor(Math.random() * pool.length)]
}
