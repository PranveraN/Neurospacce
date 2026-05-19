// NeuroSpace Sistemi i Vlerësimit të Inteligjencës së Karrierës v1.0
// 60 pyetje · 15 dimensione kognitive · 12 arkëtipe · 18 përputhje karriere

export const MODULES = [
  { id:'cognitive',     label:'Modelet Kognitive',          sub:'Logjikë, njohje modelesh dhe arsyetim analitik',        icon:'🧠', color:'#7c3aed' },
  { id:'strategic',     label:'Inteligjenca Strategjike',   sub:'Vendimmarrja, vizioni dhe planifikimi afatgjatë',        icon:'♟',  color:'#3b82f6' },
  { id:'workstyle',     label:'Stili i Punës & Ekzekutimi', sub:'Si përpunon, prioritizon dhe ofron rezultate',           icon:'⚡', color:'#10b981' },
  { id:'leadership',    label:'Udhëheqja & Autoriteti',     sub:'Si ndikon, zhvillon dhe drejton',                        icon:'🎯', color:'#f59e0b' },
  { id:'innovation',    label:'Inovacioni & Kreativiteti',  sub:'Si gjeneron, validon dhe kampionon ide të reja',         icon:'💡', color:'#ec4899' },
  { id:'collaboration', label:'Bashkëpunimi & Komunikimi',  sub:'Si komunikon, ndërton besim dhe navigon ekipe',          icon:'🤝', color:'#06b6d4' },
  { id:'stress',        label:'Stresi & Adaptueshmëria',    sub:'Si performon nën presion dhe gjatë ndryshimeve',         icon:'🌊', color:'#8b5cf6' },
  { id:'values',        label:'Vlerat e Karrierës & Motivimi', sub:'Çfarë të motivon thellësisht në jetën profesionale', icon:'🚀', color:'#f97316' },
]

export const DIMENSIONS = {
  analytical_depth:        { label:'Thellësia Analitike',            icon:'🔬', desc:'Thellësia e arsyetimit logjik dhe të bazuar në të dhëna' },
  strategic_thinking:      { label:'Mendimi Strategjik',             icon:'♟',  desc:'Planifikimi afatgjatë dhe parashikimi i sistemeve' },
  creative_intelligence:   { label:'Inteligjenca Kreative',          icon:'✨', desc:'Gjenerimi i zgjidhjeve të reja dhe jo të dukshme' },
  execution_speed:         { label:'Shpejtësia e Ekzekutimit',       icon:'⚡', desc:'Shpejtësia nga vendimi deri tek rezultati i ofruar' },
  pattern_recognition:     { label:'Njohja e Modeleve',              icon:'🔷', desc:'Identifikimi i strukturës në informacione komplekse' },
  leadership_drive:        { label:'Dëshira Udhëheqëse',             icon:'🎯', desc:'Motivimi për të drejtuar, zhvilluar dhe frymëzuar të tjerët' },
  innovation_potential:    { label:'Potenciali Inovativ',             icon:'💡', desc:'Gjasat për të gjeneruar ide breakthrough' },
  social_intelligence:     { label:'Inteligjenca Sociale',           icon:'🤝', desc:'Leximi i njerëzve, ndërtimi i besimit, navigimi i dinamikave' },
  communication_precision: { label:'Precizioni Komunikues',          icon:'📡', desc:'Qartësia dhe qëllimësia e transferimit të informacionit' },
  emotional_stability:     { label:'Stabiliteti Emocional',          icon:'🧘', desc:'Konsistenca nën presion dhe vështirësi' },
  risk_orientation:        { label:'Orientimi ndaj Rrezikut',        icon:'📈', desc:'Apetiti i llogaritur për rezultate me variancë të lartë' },
  adaptability:            { label:'Adaptueshmëria',                 icon:'🌊', desc:'Shpejtësia dhe cilësia e rregullimit ndaj ndryshimeve' },
  focus_consistency:       { label:'Konsistenca e Fokusit',          icon:'🎯', desc:'Vëmendje e qëndrueshme dhe ekzekutim mbi prioritetet' },
  systems_thinking:        { label:'Mendimi Sistematik',             icon:'⚙️',  desc:'Kuptimi i ndërveprimeve shkak-pasojë' },
  independent_solving:     { label:'Zgjidhja e Pavarur e Problemeve',icon:'🧩', desc:'Puna nëpër kompleksitet pa mbështetje të jashtme' },
}

export const QUESTIONS = [

  /* ══ MODULI 1: MODELET KOGNITIVE (P1–10) ══════════════════════════════════ */
  {
    id:1, module:'cognitive', type:'model',
    q:'Cili është numri tjetër në këtë varg: 2, 5, 10, 17, 26, ___?',
    n:'Shiko ndryshimet midis vlerave të njëpasnjëshme.',
    opts:[
      { id:'a', t:'33', s:{pattern_recognition:1, analytical_depth:0} },
      { id:'b', t:'35', s:{pattern_recognition:0, analytical_depth:1} },
      { id:'c', t:'37', s:{pattern_recognition:5, analytical_depth:4}, c:true },
      { id:'d', t:'39', s:{pattern_recognition:0, analytical_depth:0} },
    ],
  },
  {
    id:2, module:'cognitive', type:'logjikë',
    q:'Tre procese softuerike ekzekutohen paralelisht. A përfundon çdo 4 minuta, B çdo 6 minuta, C çdo 10 minuta — të gjitha filluan njëkohësisht. Pas sa minutash do të përfundojnë të gjitha tre saktësisht në të njëjtën kohë?',
    n:'Gjej shumëfishin më të vogël të përbashkët.',
    opts:[
      { id:'a', t:'20 minuta', s:{systems_thinking:1, analytical_depth:1} },
      { id:'b', t:'30 minuta', s:{systems_thinking:2, analytical_depth:2} },
      { id:'c', t:'60 minuta', s:{systems_thinking:5, analytical_depth:5}, c:true },
      { id:'d', t:'120 minuta', s:{systems_thinking:1, analytical_depth:1} },
    ],
  },
  {
    id:3, module:'cognitive', type:'i shpejtë',
    q:'Numëro shkronjën "N" në frazën e mëposhtme — ke 20 sekonda:\n"NONLINEAR INNOVATION ENGINE NETWORK"',
    n:'Saktësi nën presionin e kohës.',
    opts:[
      { id:'a', t:'7',  s:{focus_consistency:1, execution_speed:0} },
      { id:'b', t:'8',  s:{focus_consistency:2, execution_speed:1} },
      { id:'c', t:'9',  s:{focus_consistency:5, execution_speed:4}, c:true },
      { id:'d', t:'11', s:{focus_consistency:0, execution_speed:0} },
    ],
  },
  {
    id:4, module:'cognitive', type:'analogji',
    q:'SIMPTOMA : DIAGNOZA :: TË DHËNA BRUTO : ___',
    n:'Identifiko marrëdhënien logjike të transformimit.',
    opts:[
      { id:'a', t:'Bazë të dhënash', s:{analytical_depth:1, pattern_recognition:1} },
      { id:'b', t:'Statistika',      s:{analytical_depth:2, pattern_recognition:2} },
      { id:'c', t:'Njohuri',         s:{analytical_depth:5, pattern_recognition:4}, c:true },
      { id:'d', t:'Numra',           s:{analytical_depth:0, pattern_recognition:0} },
    ],
  },
  {
    id:5, module:'cognitive', type:'zbritëse',
    q:'Të gjitha kompanitë teknologjike janë agile. Disa kompani agile janë fitimprurëse. Prandaj:',
    n:'Apliko logjikë të rreptë zbritëse — mos supuzo përtej asaj që thuhet.',
    opts:[
      { id:'a', t:'Të gjitha kompanitë teknologjike janë fitimprurëse',       s:{analytical_depth:0, systems_thinking:0} },
      { id:'b', t:'Asnjë kompani teknologjike nuk është fitimprurëse',        s:{analytical_depth:0, systems_thinking:0} },
      { id:'c', t:'Disa kompani teknologjike mund të jenë fitimprurëse',      s:{analytical_depth:5, systems_thinking:4}, c:true },
      { id:'d', t:'Të gjitha kompanitë fitimprurëse janë agile',             s:{analytical_depth:1, systems_thinking:1} },
    ],
  },
  {
    id:6, module:'cognitive', type:'model',
    q:'Cili koncept NUK i përket grupit: Iterim · Rekursion · Lak Reagimi · Hierarki · Ripërsëritje',
    n:'Identifiko elementin struktural që nuk i përket.',
    opts:[
      { id:'a', t:'Iterim',       s:{pattern_recognition:1, analytical_depth:1} },
      { id:'b', t:'Lak Reagimi',  s:{pattern_recognition:2, analytical_depth:2} },
      { id:'c', t:'Rekursion',    s:{pattern_recognition:2, analytical_depth:2} },
      { id:'d', t:'Hierarki',     s:{pattern_recognition:5, analytical_depth:4}, c:true },
    ],
  },
  {
    id:7, module:'cognitive', type:'model',
    q:'Nëse A=2, B=4, C=8, D=16 (çdo vlerë dyfishohet), cila është vlera e F?',
    n:'Vazhdo modelin e dyfishimit edhe dy hapa.',
    opts:[
      { id:'a', t:'32',  s:{pattern_recognition:1, analytical_depth:1} },
      { id:'b', t:'48',  s:{pattern_recognition:0, analytical_depth:0} },
      { id:'c', t:'64',  s:{pattern_recognition:5, analytical_depth:5}, c:true },
      { id:'d', t:'128', s:{pattern_recognition:1, analytical_depth:1} },
    ],
  },
  {
    id:8, module:'cognitive', type:'logjikë',
    q:'Një startup ka 40 inxhinierë. Nëse kapaciteti kolektiv dyfishohet çdo 18 muaj (rritje e qëndrueshme eksponenciale), cila është prodhimtaria efektive pas 3 vjetësh?',
    n:'Apliko rritjen eksponenciale mbi dy periudha dyfishimi.',
    opts:[
      { id:'a', t:'Ekuivalente me 80 inxhinierë',  s:{pattern_recognition:0, analytical_depth:1} },
      { id:'b', t:'Ekuivalente me 120 inxhinierë', s:{pattern_recognition:1, analytical_depth:2} },
      { id:'c', t:'Ekuivalente me 160 inxhinierë', s:{pattern_recognition:5, analytical_depth:5}, c:true },
      { id:'d', t:'Ekuivalente me 200 inxhinierë', s:{pattern_recognition:1, analytical_depth:1} },
    ],
  },
  {
    id:9, module:'cognitive', type:'krahasues',
    q:'Dhënë: P > Q, R > P, S < Q. Rendit nga më i madhi tek më i vogli.',
    n:'Ndërto zinxhirin e pabarazive hap pas hapi.',
    opts:[
      { id:'a', t:'P, R, Q, S', s:{analytical_depth:1, pattern_recognition:1} },
      { id:'b', t:'R, P, Q, S', s:{analytical_depth:5, pattern_recognition:5}, c:true },
      { id:'c', t:'R, Q, P, S', s:{analytical_depth:2, pattern_recognition:2} },
      { id:'d', t:'P, Q, R, S', s:{analytical_depth:0, pattern_recognition:0} },
    ],
  },
  {
    id:10, module:'cognitive', type:'matricë',
    q:'Në një rrjetë 3×3: Rreshti 1 ka shumë 15, Rreshti 2 ka shumë 12, Rreshti 3 ka shumë 18. Kolona 1 ka shumë 14, Kolona 2 ka shumë 16. Sa është shuma e Kolonës 3?',
    n:'Përdor shumën totale të rrjetës për të nxjerrë kolonën që mungon.',
    opts:[
      { id:'a', t:'12', s:{analytical_depth:1, systems_thinking:1} },
      { id:'b', t:'13', s:{analytical_depth:2, systems_thinking:2} },
      { id:'c', t:'15', s:{analytical_depth:5, systems_thinking:5}, c:true },
      { id:'d', t:'17', s:{analytical_depth:1, systems_thinking:1} },
    ],
  },

  /* ══ MODULI 2: INTELIGJENCA STRATEGJIKE (P11–18) ═══════════════════════════ */
  {
    id:11, module:'strategic', type:'skenar',
    q:'Konkurenti yt kryesor sapo uli çmimet me 30% me një produkt pothuajse identik. Ke 6 javë të reagosh. Çfarë qasjeje mbështet?',
    opts:[
      { id:'a', t:'Përshtat çmimin menjëherë — mbajtja e pjesës së tregut është prioriteti.',                                                          s:{execution_speed:4, risk_orientation:2, strategic_thinking:1} },
      { id:'b', t:'Lësh nivel premium dhe ricaktoji kategorinë — bëje krahasimin e çmimeve krejtësisht irelevant.',                                    s:{strategic_thinking:5, innovation_potential:4, risk_orientation:4} },
      { id:'c', t:'Kryej hulumtim të shpejtë me klientët për të kuptuar cilin segment rrezikon para çdo veprimi.',                                     s:{analytical_depth:5, systems_thinking:4, strategic_thinking:3} },
      { id:'d', t:'Përshpejto planin e produktit për të dërguar veçori që rrisin varësinë brenda 90 ditëve.',                                         s:{execution_speed:5, strategic_thinking:3, leadership_drive:3} },
    ],
  },
  {
    id:12, module:'strategic', type:'skenar',
    q:'Duhet të shpërndarësh buxhet të kufizuar R&D midis katër iniciativave të mundshme. Si vendos?',
    opts:[
      { id:'a', t:'Shpërndan barabartë — shmang politikën e brendshme dhe ruan opsionalitetin.',                                                      s:{systems_thinking:2, strategic_thinking:2, focus_consistency:2} },
      { id:'b', t:'Gjithçka tek iniciativa me potencialin më të lartë — përqendrimi mposht diversifikimin.',                                          s:{risk_orientation:5, innovation_potential:4, strategic_thinking:3} },
      { id:'c', t:'Ndërto model portfolio të kuantifikuar: ROI × harmonim strategjik × kohë deri tek vlera.',                                         s:{analytical_depth:5, systems_thinking:5, strategic_thinking:4} },
      { id:'d', t:'Financo iniciativën me rrugën më të shpejtë drejt validimit të tregut.',                                                           s:{execution_speed:5, risk_orientation:3, strategic_thinking:2} },
    ],
  },
  {
    id:13, module:'strategic', type:'skenar',
    q:'Ke 18 muaj runway dhe mundësi reale për të hyrë në treg të ri të madh ngjitur. Si e qasesh hyrjen?',
    opts:[
      { id:'a', t:'Hulumtim i gjerë i tregut para çdo angazhimi — saktësia ka prioritet mbi shpejtësinë.',                                            s:{analytical_depth:5, focus_consistency:4, strategic_thinking:3} },
      { id:'b', t:'Lësh MVP shpejt, valido me përdorues realë dhe itero mbi sinjalin — shpejtësia është strategjia.',                                 s:{risk_orientation:5, adaptability:4, innovation_potential:3} },
      { id:'c', t:'Bli lojtar lokal për të kolapsuar kurbën e të mësuarit dhe shko direkt te shkalla.',                                               s:{strategic_thinking:5, leadership_drive:3, risk_orientation:4} },
      { id:'d', t:'Bashkëpuno me shpërndarës të vendosur — redukto rrezikun, ndaj avantazhin.',                                                       s:{social_intelligence:4, strategic_thinking:4, risk_orientation:2} },
    ],
  },
  {
    id:14, module:'strategic', type:'skenar',
    q:'Teknologji kritike që ju nevojitet për shkallëzim është e disponueshme për blerje ose ndërtim të brendshëm. Si vendos?',
    opts:[
      { id:'a', t:'Gjithmonë ndërto — kontrolli strategjik mbi infrastrukturën bazë është i pa-negociueshëm.',                                        s:{independent_solving:5, leadership_drive:4, risk_orientation:3} },
      { id:'b', t:'Gjithmonë bli — shpejtësia drejt tregut krijon më shumë vlerë se pronësia.',                                                       s:{execution_speed:5, risk_orientation:3, strategic_thinking:2} },
      { id:'c', t:'Varet tërësisht nga rëndësia strategjike, kostoja totale dhe fleksibiliteti i ardhshëm — modeloje.',                               s:{strategic_thinking:5, analytical_depth:5, systems_thinking:4} },
      { id:'d', t:'Bli për ta validuar, pastaj rindërtoje brendësisht ndërsa shkalla justifikon.',                                                    s:{strategic_thinking:4, systems_thinking:4, independent_solving:3} },
    ],
  },
  {
    id:15, module:'strategic', type:'skenar',
    q:'Ke tre iniciativa me vlerë të lartë por burime vetëm për dy. Si zgjedh?',
    opts:[
      { id:'a', t:'Zgjidh dy me ROI-n më të fortë të menjëhershëm.',                                                                                  s:{execution_speed:4, analytical_depth:3, strategic_thinking:2} },
      { id:'b', t:'Prioritizo sipas harmonimit me vizionin strategjik 5-vjeçar — ROI afatshkurtër është dytësor.',                                    s:{strategic_thinking:5, systems_thinking:4, analytical_depth:4} },
      { id:'c', t:'Ekzekuto të tria me kosto minimale për të gjeneruar të dhëna validimi, pastaj angazhohu.',                                         s:{innovation_potential:4, analytical_depth:4, risk_orientation:3} },
      { id:'d', t:'Lëre ekipin ekzekutues të vendosë — ata i njohin pengesat teknike më mirë.',                                                       s:{social_intelligence:4, leadership_drive:2, communication_precision:3} },
    ],
  },
  {
    id:16, module:'strategic', type:'skenar',
    q:'Produkti yt kryesor po rritet por rritja po ngadalësohet qartë. Pivoto apo vazhdo?',
    opts:[
      { id:'a', t:'Pivoto tani para se ngadalësimi të bëhet spiral — pritja është gabimi më i shtrenjtë.',                                            s:{risk_orientation:5, adaptability:4, innovation_potential:3} },
      { id:'b', t:'Dyfizho atë që krijoi rritjen origjinale — ekzekutimi i përmirësuar mund të rikthejë impulsin.',                                   s:{focus_consistency:5, execution_speed:4, strategic_thinking:3} },
      { id:'c', t:'Diagnostiko sistematikisht tavanin e rritjes para veprimit — shkaku përcakton reagimin.',                                          s:{analytical_depth:5, systems_thinking:5, strategic_thinking:4} },
      { id:'d', t:'Zgjerohu në treg ngjitur me produktin aktual — zgjat kurbën S.',                                                                   s:{strategic_thinking:4, innovation_potential:3, risk_orientation:3} },
    ],
  },
  {
    id:17, module:'strategic', type:'skenar',
    q:'CEO-ja dëshiron të nxjerrë produkt shpejt që ekipi beson do krijojë borxh teknik dhe rrezik cilësie. Çfarë bën?',
    opts:[
      { id:'a', t:'Kundërshto drejtpërdrejt me të dhëna mbi koston afatgjatë — rreziku duhet kuantifikuar, jo gëlltitur.',                            s:{communication_precision:5, leadership_drive:4, independent_solving:5} },
      { id:'b', t:'Respekto dhe menaxho rrezikun e cilësisë brendësisht — zgjedh betejat tua me kujdes.',                                             s:{emotional_stability:4, analytical_depth:3, execution_speed:4} },
      { id:'c', t:'Negocio qasje fazore: diçka të hollë tani sipas orarit, veçoria e plotë sipas afatit realist.',                                    s:{strategic_thinking:5, communication_precision:4, social_intelligence:4} },
      { id:'d', t:'Eskaloi tek bordi ose niveli tjetër — kontributi strategjik meriton konsideratë strategjike.',                                     s:{leadership_drive:3, risk_orientation:4, communication_precision:2} },
    ],
  },
  {
    id:18, module:'strategic', type:'skenar',
    q:'Identifikon pikë të verbër strategjike të rëndësishme në planin 5-vjeçar të organizatës. Çfarë bën?',
    opts:[
      { id:'a', t:'Dokumentoje tërësisht me analizë mbështetëse dhe prezantoje formalisht tek drejtuesit.',                                           s:{communication_precision:5, analytical_depth:5, systems_thinking:4} },
      { id:'b', t:'Ndërtoj mënyrë reagimi ndaj saj në heshtje ndërsa e sinjalizon kur momenti është i duhur.',                                       s:{independent_solving:5, systems_thinking:4, focus_consistency:4} },
      { id:'c', t:'Ngrite në seancën e ardhshme të planifikimit strategjik — kanalet e duhura ekzistojnë.',                                          s:{strategic_thinking:4, communication_precision:3, social_intelligence:3} },
      { id:'d', t:'Ndajë vetëm me ekipin e menjëhershëm — drejtuesit seniorë mund të mos jenë gati.',                                                s:{social_intelligence:3, emotional_stability:3, leadership_drive:2} },
    ],
  },

  /* ══ MODULI 3: STILI I PUNËS & EKZEKUTIMI (P19–26) ════════════════════════ */
  {
    id:19, module:'workstyle', type:'preferencë',
    q:'Sapo të është caktuar projekt kompleks 3-mujor. Cila është lëvizja jote e parë?',
    opts:[
      { id:'a', t:'E zbërthen në hapa kryesore dhe hartoj grafikun e varësive të strukturuara.',                                                      s:{focus_consistency:5, systems_thinking:4, execution_speed:3} },
      { id:'b', t:'Filloj me komponentin më të vështirë dhe më të paqartë — zgjidh pasigurinë para ndërtimit.',                                       s:{independent_solving:5, risk_orientation:3, adaptability:4} },
      { id:'c', t:'Hartoj të gjitha palët e interesuara dhe varësitë para se të prek ndonjë punë.',                                                   s:{systems_thinking:5, analytical_depth:4, strategic_thinking:3} },
      { id:'d', t:'Ndërtoj prototip të shpejtë të produktit kryesor për të zbuluar të panjohurat.',                                                   s:{innovation_potential:4, execution_speed:4, adaptability:3} },
    ],
  },
  {
    id:20, module:'workstyle', type:'skenar',
    q:'Tre afate të mëdha konvergojnë në të njëjtën javë. Cila është qasja jote?',
    opts:[
      { id:'a', t:'Zgjat orët e punës dhe shtye të tria — angazhimi ndaj cilësisë është standardi.',                                                  s:{execution_speed:5, focus_consistency:4, emotional_stability:2} },
      { id:'b', t:'Negocio afatet proaktivisht bazuar në prioritet strategjik dhe ndikim tek palët.',                                                  s:{strategic_thinking:4, communication_precision:5, leadership_drive:3} },
      { id:'c', t:'Delego komponentët me specifikimet më të qarta tek anëtarët e besuar të ekipit.',                                                  s:{leadership_drive:5, social_intelligence:4, strategic_thinking:3} },
      { id:'d', t:'Identifiko punën me vlerë të lartë, shko thellë tek ajo, dhe menaxho pritshmëritë për të tjerat.',                                s:{analytical_depth:5, strategic_thinking:4, communication_precision:4} },
    ],
  },
  {
    id:21, module:'workstyle', type:'preferencë',
    q:'Cila mënyrë e përpunimit të informacionit kompleks të përshkruan më saktë?',
    opts:[
      { id:'a', t:'Sekuencialisht — kam nevojë për kuptim të plotë para se të kaloj në shtresën tjetër.',                                             s:{analytical_depth:5, focus_consistency:5, systems_thinking:3} },
      { id:'b', t:'Paralelisht — mbaj disa fije njëkohësisht dhe i sintetizoj më vonë.',                                                              s:{systems_thinking:5, analytical_depth:4, innovation_potential:3} },
      { id:'c', t:'Nga lart-poshtë — filloj me pamjen e madhe dhe shkoj drejt asaj që ka rëndësi.',                                                  s:{strategic_thinking:5, systems_thinking:4, creative_intelligence:3} },
      { id:'d', t:'Vizualisht — hartoj gjithçka gjeografisht për të gjetur modelet që nuk i shoh në tekst.',                                          s:{creative_intelligence:4, pattern_recognition:5, systems_thinking:4} },
    ],
  },
  {
    id:22, module:'workstyle', type:'skenar',
    q:'Nevojitet vendim i madh sot, por ke qasje vetëm në 60% të të dhënave të nevojshme. Çfarë bën?',
    opts:[
      { id:'a', t:'Prit të dhëna shtesë — vendimet e këqija ndërtohen mbi njëra-tjetrën; ato të vona rrallë bëjnë dëm.',                            s:{focus_consistency:4, analytical_depth:4, risk_orientation:1} },
      { id:'b', t:'Vendos tani me të dhënat e disponueshme — ndërto pika rishikimi për korrektim me kohë.',                                          s:{risk_orientation:4, adaptability:5, strategic_thinking:4} },
      { id:'c', t:'Përcakto saktësisht çfarë informacioni minimal ndryshon vendimin, dhe merr vetëm atë.',                                           s:{analytical_depth:5, independent_solving:5, strategic_thinking:4} },
      { id:'d', t:'Merr vendimin por dokumento të gjitha supozimet eksplicitisht — krijo gjurmë auditimi.',                                          s:{analytical_depth:4, communication_precision:4, systems_thinking:4} },
    ],
  },
  {
    id:23, module:'workstyle', type:'preferencë',
    q:'Si reagon kur merr komente shumë kritike mbi punën tënde?',
    opts:[
      { id:'a', t:'E analizoj për vlefshmëri para se ta internalizoj — qëndrimi im si parazgjedhje është skepticizmi.',                              s:{analytical_depth:5, emotional_stability:5, independent_solving:4} },
      { id:'b', t:'E përdor si karburant — kritikat më mprehtin dhe rrisin nivelin tim të performancës.',                                            s:{emotional_stability:4, risk_orientation:3, focus_consistency:5} },
      { id:'c', t:'E vlerësoj publikisht pavarësisht si ndjehem — hapja ndaj kritikave përshpejton rritjen.',                                        s:{social_intelligence:5, communication_precision:4, emotional_stability:3} },
      { id:'d', t:'E përpunoj privatisht fillimisht, pastaj vendos me qetësi mbi çfarë do veproj.',                                                  s:{emotional_stability:5, independent_solving:4, analytical_depth:4} },
    ],
  },
  {
    id:24, module:'workstyle', type:'skenar',
    q:'Jesh thellë i fokusuar në punë komplekse kur mbërrin kërkesë urgjente nga palë e lartë. Çfarë bën?',
    opts:[
      { id:'a', t:'Kaloj plotësisht dhe menjëherë — urgjenca nga palë të larta është sinjal i qartë prioriteti.',                                     s:{adaptability:5, emotional_stability:3, execution_speed:4} },
      { id:'b', t:'Shënoj saktësisht ku jam, pastaj kaloj — ruajtja e kontekstit vlen 30 sekonda.',                                                  s:{focus_consistency:5, systems_thinking:4, adaptability:3} },
      { id:'c', t:'Mbaroj mendimin ose seksionin aktual para kalimit — fokusin e prishur e paguan shtrenjtë.',                                        s:{focus_consistency:5, independent_solving:4, emotional_stability:4} },
      { id:'d', t:'Vlerësoj shpejt urgjencën reale të të dyja, pastaj vendos me informacion të plotë.',                                              s:{analytical_depth:5, strategic_thinking:4, systems_thinking:4} },
    ],
  },
  {
    id:25, module:'workstyle', type:'preferencë',
    q:'Cili mjedis mundëson punën tënde më të mirë të thellë dhe të fokusuar?',
    opts:[
      { id:'a', t:'Solo, blloqe të gjata të pandërprera, komunikim minimal në kohë reale.',                                                           s:{independent_solving:5, focus_consistency:5, analytical_depth:4} },
      { id:'b', t:'Ekip i vogël besimi, bashkëpunim i lehtë, hapësirë e ndarë fizike ose dixhitale.',                                               s:{social_intelligence:4, communication_precision:4, leadership_drive:3} },
      { id:'c', t:'Plotësisht asinkron — performoj më mirë kur kontrolloj kohën dhe kontekstin tim.',                                                s:{adaptability:4, focus_consistency:4, independent_solving:4} },
      { id:'d', t:'Mjedis me energji të lartë me qasje të menjëhershme tek njerëz të mençur që sfidojnë mendimin tim.',                             s:{social_intelligence:4, innovation_potential:4, adaptability:3} },
    ],
  },
  {
    id:26, module:'workstyle', type:'skenar',
    q:'Të është dhënë problem që askush në organizatën tënde nuk e ka zgjidhur. Ku fillon?',
    opts:[
      { id:'a', t:'Hulumtoj si industritë dhe fushat ngjitur e kanë zgjidhur version të ngjashëm të problemit.',                                     s:{analytical_depth:4, systems_thinking:4, pattern_recognition:4} },
      { id:'b', t:'Filloj nga parimet e para — zgjidhjet e jashtme mund të kodifikojnë supozimet e gabuara.',                                        s:{independent_solving:5, analytical_depth:5, innovation_potential:4} },
      { id:'c', t:'Mblodh grupin më shumëllojshëm kognitiv të disponueshëm dhe punojmë bashkë.',                                                    s:{social_intelligence:5, leadership_drive:4, communication_precision:4} },
      { id:'d', t:'Ndërtoj eksperiment të shpejtë me kosto të ulët për të testuar hipotezën kryesore.',                                             s:{innovation_potential:5, risk_orientation:4, adaptability:4} },
    ],
  },

  /* ══ MODULI 4: UDHËHEQJA & AUTORITETI (P27–33) ════════════════════════════ */
  {
    id:27, module:'leadership', type:'skenar',
    q:'Anëtar i ekipit vazhdimisht nuk arrin produktet, megjithëse ka aftësitë e nevojshme. Çfarë bën?',
    opts:[
      { id:'a', t:'Bisedë e drejtpërdrejtë: ricakto pritshmëritë, vendos llogaridhënie, dokumento zotimet.',                                         s:{leadership_drive:5, communication_precision:5, emotional_stability:4} },
      { id:'b', t:'Rriti frekuencën e takimeve dhe ofroj mbështetje aktive për të hequr bllokimet.',                                                 s:{social_intelligence:5, leadership_drive:4, emotional_stability:4} },
      { id:'c', t:'Ricakto punën e tyre tek performuesit më të fortë — mbroje misionin.',                                                            s:{leadership_drive:4, execution_speed:4, strategic_thinking:3} },
      { id:'d', t:'Diagnostiko shkakun rrënjësor: kapacitet, qartësi, apo motivim? Reagimi varet nga përgjigja.',                                    s:{analytical_depth:5, social_intelligence:4, systems_thinking:4} },
    ],
  },
  {
    id:28, module:'leadership', type:'skenar',
    q:'Dy nga performuesit më të lartë duan të drejtojnë të njëjtën iniciativë. Çfarë bën?',
    opts:[
      { id:'a', t:'Jepjane atij kujt i nevojitet më shumë ky zhvillim karriere tani.',                                                               s:{social_intelligence:5, leadership_drive:5, emotional_stability:4} },
      { id:'b', t:'Bëji të bashkëpunojnë mbi propozim të përbashkët dhe lëri udhëheqësin natyral të dalë.',                                          s:{social_intelligence:4, adaptability:4, leadership_drive:3} },
      { id:'c', t:'Cakto bazuar tërësisht mbi përputhshmërinë me projektin dhe aftësinë — ndjenjat janë dytësore.',                                  s:{analytical_depth:5, strategic_thinking:4, independent_solving:4} },
      { id:'d', t:'Krijo gjurmë pronësie të ndryshme brenda iniciativës që të dyja drejtojnë me kuptim real.',                                       s:{systems_thinking:5, leadership_drive:5, strategic_thinking:4} },
    ],
  },
  {
    id:29, module:'leadership', type:'skenar',
    q:'Ke trashëguar ekip me moral të ulët, procese të paqarta dhe prodhimtari të dobët. Si i qasesh 30 ditët e para?',
    opts:[
      { id:'a', t:'Diagnostiko para se të ndryshosh gjë — kuptoje shkakun real të mosfunksionimit.',                                                  s:{analytical_depth:5, systems_thinking:4, strategic_thinking:4} },
      { id:'b', t:'Krijo fitore të dukshme të shpejta menjëherë — morali ndjek rezultatet, jo qëllimet.',                                            s:{execution_speed:4, leadership_drive:4, emotional_stability:3} },
      { id:'c', t:'Vendos transparencë radikale — ndaj çfarë sheh, çfarë beson, dhe çfarë planifikon të bësh.',                                      s:{communication_precision:5, leadership_drive:4, emotional_stability:5} },
      { id:'d', t:'Hiq pengesat strukturore dhe lëre ekipin të vetëpërcaktojë mënyrën e funksionimit.',                                              s:{social_intelligence:5, leadership_drive:4, adaptability:4} },
    ],
  },
  {
    id:30, module:'leadership', type:'skenar',
    q:'Ekipi yt ka aftësi teknike të klasit botëror por vuajnë me mendimin strategjik. Si e adresoni?',
    opts:[
      { id:'a', t:'Trajno dhe zhvillo — mendimi strategjik është aftësi e mësueshme.',                                                               s:{leadership_drive:5, social_intelligence:4, strategic_thinking:4} },
      { id:'b', t:'Bëre strategjinë domenin tënd ekskluziv dhe lëri të fokusojnë tek ekspertiza teknike.',                                           s:{strategic_thinking:5, independent_solving:5, leadership_drive:3} },
      { id:'c', t:'Punëso mendimtarë strategjikë që plotësojnë thellësinë teknike të ekipit.',                                                       s:{leadership_drive:4, strategic_thinking:4, social_intelligence:3} },
      { id:'d', t:'Dizajno sisteme dhe rituale që integrojnë strukturalisht mendimin strategjik në rrjedhën e punës.',                                s:{systems_thinking:5, leadership_drive:4, strategic_thinking:5} },
    ],
  },
  {
    id:31, module:'leadership', type:'skenar',
    q:'Vendim i juaji i menduar po sfidohet publikisht nga koleg para drejtuesve. Reagimi?',
    opts:[
      { id:'a', t:'Qëndro pranë vendimit me të dhëna — presioni i jashtëm nuk ndryshon logjikën bazë.',                                             s:{independent_solving:5, leadership_drive:5, communication_precision:4} },
      { id:'b', t:'Angazhohu sinqerisht me kritikën — mund të përmbajë informacion që përmirëson vendimin.',                                         s:{social_intelligence:5, communication_precision:5, emotional_stability:4} },
      { id:'c', t:'Rishiko vendimin tërësisht me sy të freskët — vëmendja e shtuar është dhuratë.',                                                  s:{analytical_depth:5, emotional_stability:4, strategic_thinking:4} },
      { id:'d', t:'Ngrihu mbi dinamikën — vendimet e forta bëjnë armiq, dhe kjo është kosto e pranueshme.',                                          s:{emotional_stability:5, leadership_drive:4, risk_orientation:4} },
    ],
  },
  {
    id:32, module:'leadership', type:'preferencë',
    q:'Ekipi yt sapo ofroi rezultat të jashtëzakonshëm në kushte të vështira. Çfarë bën?',
    opts:[
      { id:'a', t:'Festo publikisht me njohje specifike, me emër, për kontributin e secilit person.',                                                 s:{social_intelligence:5, leadership_drive:5, communication_precision:4} },
      { id:'b', t:'Dokumento të mësuarit dhe ndaje me organizatën e gjerë si model.',                                                                s:{systems_thinking:4, communication_precision:4, strategic_thinking:3} },
      { id:'c', t:'Përdor impulsin si pikë lëshimi për sfidën tjetër, më të vështirë.',                                                              s:{leadership_drive:5, risk_orientation:4, independent_solving:4} },
      { id:'d', t:'Lëri rezultatet të flasin — festimi i tepruar mund të krijojë vetëkënaqësi.',                                                     s:{independent_solving:4, emotional_stability:3, strategic_thinking:3} },
    ],
  },
  {
    id:33, module:'leadership', type:'skenar',
    q:'Drejtues senior vazhdimisht shfuqizon vendimet e ekipit tënd pa arsye të qartë. Si e zgjidhni?',
    opts:[
      { id:'a', t:'Ndërtoj protokoll formal të autoritetit të vendimeve dhe merr miratim para konfliktit tjetër.',                                    s:{systems_thinking:5, communication_precision:5, leadership_drive:4} },
      { id:'b', t:'Investo në marrëdhënien — fito besimin e tyre gradualisht deri sa shfuqizimet bëhen të panevojshme.',                             s:{social_intelligence:5, communication_precision:4, strategic_thinking:4} },
      { id:'c', t:'Para-harmonizo çdo vendim të rëndësishëm me të dhëna — elimino surprizat plotësisht.',                                           s:{analytical_depth:5, strategic_thinking:4, communication_precision:5} },
      { id:'d', t:'Adresoje drejtpërdrejt — strukturat e paqarta të autoritetit gërryjnë performancën e ekipit.',                                    s:{leadership_drive:5, communication_precision:5, emotional_stability:4} },
    ],
  },

  /* ══ MODULI 5: INOVACIONI & KREATIVITETI (P34–40) ════════════════════════ */
  {
    id:34, module:'innovation', type:'skenar',
    q:'Duhet të zgjidhësh problem që nuk ka zgjidhje të njohur në industrinë tënde. Ku fillon?',
    opts:[
      { id:'a', t:'Studion fusha dhe disiplina ngjitur ku problem analog është zgjidhur.',                                                            s:{pattern_recognition:5, analytical_depth:4, systems_thinking:4} },
      { id:'b', t:'Apliko kufizime ekstreme për të krijuar presion kreativ — nevoja krijon çfarë logjika nuk mund.',                                  s:{creative_intelligence:5, innovation_potential:5, risk_orientation:3} },
      { id:'c', t:'Mblodh ekip me diversitet maksimal — zgjidhja jeton në ndërlëshimin kognitiv.',                                                   s:{social_intelligence:4, innovation_potential:4, leadership_drive:4} },
      { id:'d', t:'Puno mbrapsht nga rezultati ideal dhe hartoj çdo supozim midis këtu dhe atje.',                                                    s:{strategic_thinking:5, systems_thinking:4, analytical_depth:4} },
    ],
  },
  {
    id:35, module:'innovation', type:'skenar',
    q:'Anëtar i ri i ekipit propozon ide radikale që mund të shpërbyjë produktin tënd kryesor. Si reagon?',
    opts:[
      { id:'a', t:'Kryej vlerësim të strukturuar rigoroz — idetë radikale meritojnë analizë serioze.',                                               s:{analytical_depth:5, strategic_thinking:4, innovation_potential:4} },
      { id:'b', t:'Inkuboje menjëherë si eksperiment me burime minimale.',                                                                           s:{innovation_potential:5, risk_orientation:4, strategic_thinking:3} },
      { id:'c', t:'Kampionoje tek drejtuesit menjëherë — ai nivel mendimi duhet shpërblyer dhe nxjerrë.',                                            s:{leadership_drive:4, innovation_potential:5, creative_intelligence:4} },
      { id:'d', t:'Testoje privatisht fillimisht, pastaj vendos nëse cilësia meriton ta nxjerrësh.',                                                 s:{analytical_depth:5, independent_solving:4, strategic_thinking:4} },
    ],
  },
  {
    id:36, module:'innovation', type:'skenar',
    q:'Duhet të inovosh brenda buxheti shumë të kufizuar — 20% e asaj çka do idealisht. Si qasesh?',
    opts:[
      { id:'a', t:'Kufizimet janë vendi ku jeton inovacioni real — punën time më të mirë e bëj nën to.',                                             s:{creative_intelligence:5, innovation_potential:5, analytical_depth:4} },
      { id:'b', t:'Përqendro të gjitha burimet tek një hipotezë breakthrough — shpërhapja nuk funksionon me 20%.',                                   s:{focus_consistency:5, risk_orientation:4, strategic_thinking:3} },
      { id:'c', t:'Ricaktoji problemin tërësisht derisa zgjidhja bëhet e qartë brenda kufizimit.',                                                   s:{creative_intelligence:5, systems_thinking:4, analytical_depth:5} },
      { id:'d', t:'Kërko burime të jashtme: partneritete, burim i hapur, grante, kontribute komuniteti.',                                            s:{social_intelligence:4, strategic_thinking:4, adaptability:4} },
    ],
  },
  {
    id:37, module:'innovation', type:'skenar',
    q:'Iniciativa jote më inovative dështon në validimin e tregut pas 6 muajsh punë. Si e përpunon?',
    opts:[
      { id:'a', t:'Kryej post-mortem rigoroz për të kuptuar saktësisht çfarë po thotë e dhëna.',                                                     s:{analytical_depth:5, focus_consistency:4, systems_thinking:4} },
      { id:'b', t:'Itero shpejt mbi feedback-in — dështimi është pikë të dhënash me densitet të lartë, jo fund.',                                   s:{adaptability:5, risk_orientation:4, innovation_potential:4} },
      { id:'c', t:'Hiqe prapa dhe pyet nëse problemi meritonte zgjidhur fare.',                                                                      s:{strategic_thinking:5, analytical_depth:4, independent_solving:4} },
      { id:'d', t:'Pranoje koston, ekstrakto të mësuarit dhe ridrejtoje energjinë tek basti tjetër.',                                               s:{risk_orientation:4, adaptability:4, emotional_stability:4} },
    ],
  },
  {
    id:38, module:'innovation', type:'preferencë',
    q:'Cila përshkruan më saktë stilin tënd natyral të inovacionit?',
    opts:[
      { id:'a', t:'Sistematik — inovojë duke kuptuar thellë sistemet aktuale, pastaj ridizajnoj kufizimet.',                                          s:{systems_thinking:5, analytical_depth:5, focus_consistency:4} },
      { id:'b', t:'Shpërbytes — kërkon çfarë të heqësh ose zëvendësosh, jo t\'u shtosh me rritje.',                                                 s:{creative_intelligence:5, innovation_potential:5, risk_orientation:4} },
      { id:'c', t:'Bashkëpunues — inovacionet më të mira dolën nga ndërlëshimi i besimit të lartë.',                                                s:{social_intelligence:5, communication_precision:4, innovation_potential:4} },
      { id:'d', t:'Intuitiv — besoj sinjalet e hershme dhe lëviz para se të dhënat të jenë përfundimtare.',                                         s:{creative_intelligence:4, risk_orientation:5, adaptability:4} },
    ],
  },
  {
    id:39, module:'innovation', type:'preferencë',
    q:'Si e qasesh pasigurinë e natyrshme të punës kreative?',
    opts:[
      { id:'a', t:'Krijon strukturë — paqartësia është armiku i ekzekutimit dhe e eliminoj herët.',                                                  s:{focus_consistency:5, systems_thinking:4, execution_speed:4} },
      { id:'b', t:'E përqafoj — rezultatet më të mira dolën nga qëndrimi vërtetë i hapur ndaj pasigurisë.',                                         s:{adaptability:5, creative_intelligence:4, innovation_potential:4} },
      { id:'c', t:'E kufizoj me kohë — eksploro lirisht brenda dritares së përcaktuar, pastaj angazhohu.',                                          s:{strategic_thinking:5, focus_consistency:4, adaptability:4} },
      { id:'d', t:'Përdor kuadre për të kufizuar pasigurinë pa eliminuar hapësirën kreative.',                                                       s:{systems_thinking:5, analytical_depth:4, strategic_thinking:4} },
    ],
  },
  {
    id:40, module:'innovation', type:'skenar',
    q:'Të jepet brief "blue-sky" i vërtetë: buxhet i pakufizuar, pa afat, pa kufizime. Çfarë bën fillimisht?',
    opts:[
      { id:'a', t:'Vendo menjëherë kufizime vetjake — briefet e pakufizuara prodhojnë punë mediokre.',                                               s:{independent_solving:5, focus_consistency:4, analytical_depth:4} },
      { id:'b', t:'Mendo në shkallën më të madhe të imagjinueshme fillimisht, pastaj kalo tek fizibiliteti.',                                        s:{strategic_thinking:5, creative_intelligence:5, innovation_potential:4} },
      { id:'c', t:'Konsulto gjerësisht para gjenerimit të ideve — konteksti dhe kufizimet janë materiali kreativ real.',                             s:{social_intelligence:4, analytical_depth:4, systems_thinking:4} },
      { id:'d', t:'Fillo të gjenerosh menjëherë — kufizimet e vendosura do të vrisnin impulsin kreativ.',                                           s:{creative_intelligence:5, innovation_potential:4, risk_orientation:3} },
    ],
  },

  /* ══ MODULI 6: BASHKËPUNIMI & KOMUNIKIMI (P41–47) ══════════════════════════ */
  {
    id:41, module:'collaboration', type:'skenar',
    q:'Po drejtosh iniciativë cross-functional ku palë kyçe kanë prioritete drejtpërdrejt konfliktuale. Si vazhdon?',
    opts:[
      { id:'a', t:'Harto interesat e secilit dhe arkitekto harmonimin strukturor para çdo pune.',                                                     s:{strategic_thinking:5, systems_thinking:5, communication_precision:4} },
      { id:'b', t:'Vendos metrika të suksesit të ndarë në fillim — divergjenca tek rezultatet bllokon çdo progres.',                                  s:{communication_precision:5, strategic_thinking:4, leadership_drive:4} },
      { id:'c', t:'Kryej seanca të strukturuara zgjidhje konflikti për të nxjerrë dhe zgjidhur tensionet.',                                          s:{social_intelligence:5, communication_precision:5, leadership_drive:4} },
      { id:'d', t:'Vepro me autonomi maksimale — menaxhimi i tepërt i palëve krijon më shumë fërkime se çka zgjidh.',                               s:{independent_solving:5, analytical_depth:4, execution_speed:4} },
    ],
  },
  {
    id:42, module:'collaboration', type:'skenar',
    q:'Koleg me aftësi kritike dhe të pazëvendësueshme është shumë i vështirë për të punuar. Si e trajton?',
    opts:[
      { id:'a', t:'Vendos marrëveshje të qarta pune dhe respektoi profesionalisht, pa përjashtim.',                                                  s:{communication_precision:5, leadership_drive:4, emotional_stability:4} },
      { id:'b', t:'Investo kohë duke kuptuar çfarë realisht shkakton sjelljen e tyre të vështirë.',                                                  s:{social_intelligence:5, emotional_stability:5, analytical_depth:4} },
      { id:'c', t:'Minimizon ndërveprimet — dizajno rrjedhën e punës për të reduktuar varësinë nga ta.',                                            s:{independent_solving:4, execution_speed:4, strategic_thinking:3} },
      { id:'d', t:'Eskaloi kur sjellja krijon rrezik të matshëm projekti — disa probleme kanë nevojë për strukturë.',                               s:{leadership_drive:4, communication_precision:4, systems_thinking:3} },
    ],
  },
  {
    id:43, module:'collaboration', type:'skenar',
    q:'Duhet të ofrosh lajm të keq të rëndësishëm tek palë e lartë e interesuar. Si e strukturon komunikimin?',
    opts:[
      { id:'a', t:'Fillo me të dhëna, pastaj implikimi, pastaj rruga përpara — qartësia përshpejton zgjidhjen.',                                     s:{communication_precision:5, analytical_depth:5, strategic_thinking:4} },
      { id:'b', t:'Kontekstualizoje fillimisht — sigurohu ta kuptojnë mjedisin para se të marrin lajmin.',                                           s:{communication_precision:5, social_intelligence:4, strategic_thinking:4} },
      { id:'c', t:'Ji i drejtpërdrejtë dhe i menjëhershëm — vonesa dhe zbutja shtojnë dëmin.',                                                      s:{communication_precision:5, emotional_stability:4, execution_speed:4} },
      { id:'d', t:'Harto bashkë mesazhin me dikë që i njeh mirë palën e interesuar.',                                                               s:{social_intelligence:5, communication_precision:4, strategic_thinking:3} },
    ],
  },
  {
    id:44, module:'collaboration', type:'skenar',
    q:'Takimet në organizatën tënde janë vazhdimisht joproduktive dhe konsumojnë 40% të kohës. Çfarë bën?',
    opts:[
      { id:'a', t:'Dizajno sistem operimi takimesh: lexim paraprak i detyrueshëm, axhenda të ngushta, dalje të dokumentuara.',                       s:{systems_thinking:5, leadership_drive:4, communication_precision:4} },
      { id:'b', t:'Refuzo njëanshëm takimet e panevojshme dhe modelo sjelljen që dëshiron të përhapet.',                                            s:{leadership_drive:5, independent_solving:4, communication_precision:3} },
      { id:'c', t:'Pranoji joeficiencën — takimet kanë vlerë kapitali social që analiza e produktivitetit e humb.',                                  s:{social_intelligence:5, communication_precision:4, emotional_stability:3} },
      { id:'d', t:'Zëvendëso takimet e rregullta me komunikim të shkruar asinkron kudo ku formati lejon.',                                           s:{communication_precision:5, systems_thinking:4, adaptability:4} },
    ],
  },
  {
    id:45, module:'collaboration', type:'skenar',
    q:'Koleg merr kreditet publikisht për punën që ti drejtove, para drejtuesve seniorë. Reagimi?',
    opts:[
      { id:'a', t:'Korrekto rekordin profesionalisht dhe menjëherë — qartësia duhet vendosur.',                                                      s:{communication_precision:5, leadership_drive:5, emotional_stability:4} },
      { id:'b', t:'Adresoje privatisht me kolegun fillimisht, para çdo eskalimi.',                                                                   s:{social_intelligence:5, communication_precision:4, emotional_stability:5} },
      { id:'c', t:'Rrit dukshmërinë e kontributeve tua vazhdimisht në të ardhmen — krijo kredit strukturor.',                                       s:{analytical_depth:4, independent_solving:4, focus_consistency:4} },
      { id:'d', t:'Lëri të shkojë — rekordi i punës tënde do flasë me kalimin e kohës.',                                                            s:{emotional_stability:5, independent_solving:4, risk_orientation:2} },
    ],
  },
  {
    id:46, module:'collaboration', type:'skenar',
    q:'Po bashkohesh me ekip të ri me performancë të lartë ku besimi është mirë-vendosur. Si integrohen?',
    opts:[
      { id:'a', t:'Dëgjo shumë në 30 ditët e para para se të shprehësh ndonjë mendim ose drejtim.',                                                 s:{social_intelligence:5, analytical_depth:4, emotional_stability:4} },
      { id:'b', t:'Demonstro vlerë menjëherë përmes rezultateve — performanca fiton përfshirjen më shpejt.',                                         s:{execution_speed:5, independent_solving:5, leadership_drive:4} },
      { id:'c', t:'Investo në ndërtimin e marrëdhënieve 1-me-1 individuale para kontributit tek dinamikat e grupit.',                               s:{social_intelligence:5, communication_precision:4, emotional_stability:4} },
      { id:'d', t:'Kuptoje thellë procesin e vendimmarrjes të ekipit para se të përpiqesh të ndikosh.',                                             s:{systems_thinking:5, analytical_depth:4, strategic_thinking:4} },
    ],
  },
  {
    id:47, module:'collaboration', type:'preferencë',
    q:'Duhet të bashkëpunosh ngushtë me dikë stilin komunikues të të cilit është drejtpërdrejt i kundërt me tëndin. Çfarë bën?',
    opts:[
      { id:'a', t:'Diskuto eksplicit preferencat dhe bie dakord mbi normat e punës — emëro ndryshimet dhe uraji.',                                   s:{communication_precision:5, social_intelligence:5, emotional_stability:4} },
      { id:'b', t:'Adaptohu ndaj stilit të tyre — përgjegjësia e komunikimit është e imja.',                                                        s:{social_intelligence:5, adaptability:5, communication_precision:4} },
      { id:'c', t:'Minimizon komunikimin tek shkëmbimet e fokusuara tek prodhimi — fërkimi i stilit është irelevant.',                              s:{independent_solving:4, execution_speed:4, communication_precision:3} },
      { id:'d', t:'Dokumento gjithçka tepër — redukto varësinë nga komunikimi drejtpërdrejt me strukturë.',                                         s:{communication_precision:4, systems_thinking:4, focus_consistency:4} },
    ],
  },

  /* ══ MODULI 7: STRESI & ADAPTUESHMËRIA (P48–54) ════════════════════════════ */
  {
    id:48, module:'stress', type:'skenar',
    q:'Prioritet i madh projekti ndryshon me njoftim 48-orësh — ristrukturo muaj pune. Reagimi i menjëhershëm?',
    opts:[
      { id:'a', t:'Riplanifiko menjëherë — adapto ekzekutimin tek prioriteti i ri pa vonesë.',                                                       s:{adaptability:5, execution_speed:4, strategic_thinking:4} },
      { id:'b', t:'Kundërshto formalisht — ndryshimet e papritura krijojnë dështime kaskadë poshtë.',                                               s:{leadership_drive:4, communication_precision:5, systems_thinking:4} },
      { id:'c', t:'Absorbo ndryshimin duke nxjerrë transparentisht koston dhe rrezikun e plotë tek palët.',                                         s:{communication_precision:5, systems_thinking:5, emotional_stability:4} },
      { id:'d', t:'Identifiko menjëherë çfarë mund të lihet krejtësisht kundrejt çfarë thjesht lëviz — pastro fushëveprimin.',                      s:{strategic_thinking:5, analytical_depth:5, systems_thinking:4} },
    ],
  },
  {
    id:49, module:'stress', type:'skenar',
    q:'Jesh 3 muaj brenda projektit pa kërkesa të qarta dhe të rëna dakord. Si e trajton?',
    opts:[
      { id:'a', t:'Detyro seancë harmonimi të kërkesave — paqartësia strategjike kaq vonë është e papranueshme.',                                   s:{leadership_drive:4, communication_precision:5, systems_thinking:4} },
      { id:'b', t:'Përcakto metrikën tënde të veriut veriut brendësisht dhe ndërto drejt saj deri sa korrigjohet.',                                 s:{independent_solving:5, strategic_thinking:5, risk_orientation:4} },
      { id:'c', t:'Rriti frekuencën e komunikimit me palët e interesuara për të formuar aktivisht drejtimin.',                                       s:{communication_precision:5, social_intelligence:4, strategic_thinking:3} },
      { id:'d', t:'Ekzekuto rrjedha paralele pune mbi hipotezat më të mundshme dhe lëri më të mirën të fitojë.',                                    s:{innovation_potential:4, risk_orientation:5, adaptability:4} },
    ],
  },
  {
    id:50, module:'stress', type:'skenar',
    q:'Ke 4 orë për vendim me aksion të lartë me vetëm 50% të të dhënave. Procesi yt?',
    opts:[
      { id:'a', t:'Sintetizo shpejt të dhënat e disponueshme në kuadër të strukturuar vendimi dhe puno nëpër të.',                                   s:{analytical_depth:5, systems_thinking:5, strategic_thinking:4} },
      { id:'b', t:'Beso njohjen e modeleve — eksperienca dhe intuita përpunojnë çfarë të dhënat nuk mund t\'i shprehin.',                           s:{pattern_recognition:5, independent_solving:5, risk_orientation:4} },
      { id:'c', t:'Merr input të shpejtë nga 2–3 këshilltarë besimi me përvojë relevante.',                                                         s:{social_intelligence:4, leadership_drive:3, strategic_thinking:4} },
      { id:'d', t:'Përcakto rezultatin më të keq, vlerëso nëse është i mbijetueshëm, pastaj angazhohu.',                                            s:{emotional_stability:5, strategic_thinking:5, analytical_depth:4} },
    ],
  },
  {
    id:51, module:'stress', type:'skenar',
    q:'Projekt që drejtove dhe kampionove publikisht dështon. Reagimi?',
    opts:[
      { id:'a', t:'Merri tërësisht, kryej post-mortem publik dhe ndaje të mësuarit gjerësisht.',                                                     s:{leadership_drive:5, communication_precision:5, emotional_stability:5} },
      { id:'b', t:'Analizoje privatisht dhe apliko të mësuarit tek sfida tjetër.',                                                                   s:{independent_solving:5, analytical_depth:5, emotional_stability:4} },
      { id:'c', t:'Lëviz menjëherë përpara — qëndrimi mbi dështim është humbje produktiviteti, jo virtyt.',                                         s:{risk_orientation:4, adaptability:5, execution_speed:4} },
      { id:'d', t:'Përdore dështimin për të rindërtuar procesin që lejoi të ndodhte.',                                                              s:{systems_thinking:5, strategic_thinking:4, analytical_depth:4} },
    ],
  },
  {
    id:52, module:'stress', type:'skenar',
    q:'Organizata kalon ristrukturim të papritur duke ndërprerë linjat e raportimit dhe qartësinë. Çfarë bën?',
    opts:[
      { id:'a', t:'Përdore ndërprerjen si levë për të ridizajnuar diçka strukturalisht më të mirë.',                                                s:{innovation_potential:4, risk_orientation:5, strategic_thinking:4} },
      { id:'b', t:'Ankoroje ekipin tek prioritetet e qarta të punës ndërsa zhurma strukturore zgjidhet.',                                           s:{leadership_drive:5, emotional_stability:5, focus_consistency:4} },
      { id:'c', t:'Navigo lart shpejt për të kuptuar dinamikat e reja të pushtetit dhe arkitekturën e vendimmarrjes.',                              s:{strategic_thinking:4, social_intelligence:4, analytical_depth:4} },
      { id:'d', t:'Ruaj prodhimtari të jashtëzakonshme — performanca është mbrojtja më e besueshme në tranzicion.',                                 s:{execution_speed:5, focus_consistency:5, emotional_stability:4} },
    ],
  },
  {
    id:53, module:'stress', type:'preferencë',
    q:'Në situatë me presion të lartë që kërkon performancë kognitive kulmore — çfarë bën?',
    opts:[
      { id:'a', t:'Aktivizo protokoll mendor të qëllimshëm — frymëmarrje e strukturuar, prioritet i vetëm, hiq të gjitha inputet.',                 s:{emotional_stability:5, focus_consistency:5, independent_solving:4} },
      { id:'b', t:'Presioni më aktivizon — vazhdimisht performoj në nivelin tim më të lartë nën kushte të kufizuara.',                             s:{emotional_stability:4, risk_orientation:4, adaptability:4} },
      { id:'c', t:'Ndaj qartë çfarë mund të kontrolloj nga çfarë nuk mund — pastaj veproj vetëm mbi të parin.',                                     s:{emotional_stability:5, systems_thinking:4, analytical_depth:4} },
      { id:'d', t:'Komunikoi presionin tek palët kryesore — qartësia e ndarë shumëfishon kapacitetin e reagimit.',                                  s:{communication_precision:4, social_intelligence:4, leadership_drive:3} },
    ],
  },
  {
    id:54, module:'stress', type:'skenar',
    q:'Ke operuar me kapacitet maksimal për 3 muaj të njëpasnjëshëm pa rikuperim të kuptimtë. Çfarë bën?',
    opts:[
      { id:'a', t:'Ristrukturoj proaktivisht ngarkesën para degradimit të performancës — parandalimi mposht korrigjimin.',                           s:{strategic_thinking:5, systems_thinking:4, emotional_stability:5} },
      { id:'b', t:'Vazhdo — misioni ka horizont kohor dhe kapaciteti personal është sakrificë afatshkurtër.',                                       s:{risk_orientation:4, execution_speed:5, leadership_drive:3} },
      { id:'c', t:'Identifiko një ose dy gjëra për t\'i lënë tërësisht — jo vonuar, jo deleguar. Lër.',                                            s:{strategic_thinking:5, analytical_depth:5, independent_solving:4} },
      { id:'d', t:'Ndërtoj sisteme që reduktojnë rolin tim si pikë e vetme dështimi — mos prit të largohesh.',                                     s:{systems_thinking:5, leadership_drive:4, strategic_thinking:4} },
    ],
  },

  /* ══ MODULI 8: VLERAT E KARRIERËS & MOTIVIMI (P55–60) ══════════════════════ */
  {
    id:55, module:'values', type:'preferencë',
    q:'Cili është motivimi yt kryesor profesional?',
    opts:[
      { id:'a', t:'Zotërimi — të bëhem vërtetë i klasit botëror në diçka të vështirë.',                                                             s:{independent_solving:5, focus_consistency:5, analytical_depth:4} },
      { id:'b', t:'Ndikimi — ndryshimi i diçkaje të rëndësishme në botë përmes punës sime.',                                                        s:{leadership_drive:4, innovation_potential:4, risk_orientation:4} },
      { id:'c', t:'Ndërtimi — krijimi i gjërave që mbijetojnë përfshirjes sime.',                                                                   s:{innovation_potential:5, strategic_thinking:4, systems_thinking:4} },
      { id:'d', t:'Influenca — formimi i mënyrës si të tjerët mendojnë, vendosin dhe veprojnë.',                                                    s:{leadership_drive:5, communication_precision:4, social_intelligence:4} },
    ],
  },
  {
    id:56, module:'values', type:'preferencë',
    q:'Pas 10 vjetësh, suksesi profesional për ty nënkupton:',
    opts:[
      { id:'a', t:'Drejtimin e organizate që është vërtetë e shkëlqyer në atë çka bën.',                                                            s:{leadership_drive:5, strategic_thinking:5, systems_thinking:4} },
      { id:'b', t:'Ndërtimin e diçkaje nga asgjëja që tani operon në shkallë të rëndësishme.',                                                      s:{innovation_potential:5, risk_orientation:4, independent_solving:5} },
      { id:'c', t:'Njohjen si ekspert përcaktues në fushë që ka rëndësi.',                                                                          s:{independent_solving:5, analytical_depth:5, focus_consistency:4} },
      { id:'d', t:'Zhvillimin e brezit të talenteve që ka tejkaluar aftësinë tënde.',                                                               s:{social_intelligence:5, leadership_drive:5, emotional_stability:4} },
    ],
  },
  {
    id:57, module:'values', type:'preferencë',
    q:'Cila strukturë organizative mundëson veten tënde më të mirë profesionale?',
    opts:[
      { id:'a', t:'E sheshtë, autonome, besim i lartë — unë përcaktoj fushëveprimin tim dhe mat performancën time.',                                s:{independent_solving:5, risk_orientation:4, adaptability:4} },
      { id:'b', t:'E strukturuar por fleksibël — prioritete strategjike të qarta me hapësirë kuptimtare ekzekutimi.',                               s:{focus_consistency:4, systems_thinking:4, strategic_thinking:4} },
      { id:'c', t:'Me lëvizje të shpejtë, llogaridhënie e lartë, e drejtuar nga misioni — misioni tejkalon strukturën.',                            s:{execution_speed:5, leadership_drive:4, risk_orientation:4} },
      { id:'d', t:'Thellë bashkëpunuese, meritokraci idesh — mendimi më i mirë fiton pavarësisht hierarkisë.',                                     s:{social_intelligence:5, innovation_potential:4, communication_precision:4} },
    ],
  },
  {
    id:58, module:'values', type:'preferencë',
    q:'Në spektrin nga stabiliteti maksimal deri tek rreziku maksimal — ku vepron natyralisht?',
    opts:[
      { id:'a', t:'Shumë drejt stabilitetit — puna e shkëlqyer kërkon kushte të parashikueshme.',                                                   s:{focus_consistency:5, emotional_stability:4, analytical_depth:4} },
      { id:'b', t:'Ekuilibër i llogaritur — marr rreziqe brenda themeleve reziliente.',                                                             s:{strategic_thinking:5, emotional_stability:4, risk_orientation:3} },
      { id:'c', t:'Shumë drejt rrezikut — avantazhi asimetrik i bastit të duhur ia vlen variancën.',                                               s:{risk_orientation:5, innovation_potential:4, adaptability:4} },
      { id:'d', t:'Rreziku është funksion i njohurisë — e reduktoj drejt zeros përmes përgatitjes dhe analizës.',                                  s:{analytical_depth:5, independent_solving:5, systems_thinking:4} },
    ],
  },
  {
    id:59, module:'values', type:'preferencë',
    q:'Cilën kompromis profesional e pranon më lehtë?',
    opts:[
      { id:'a', t:'Të ardhura më të ulëta në këmbim të ndikim real dukshëm më të lartë.',                                                           s:{innovation_potential:4, emotional_stability:4, social_intelligence:4} },
      { id:'b', t:'Titull më i ulët në këmbim të pronësisë dhe autonomisë të vërteta.',                                                             s:{independent_solving:5, risk_orientation:4, innovation_potential:4} },
      { id:'c', t:'Stabilitet më i ulët në këmbim të mundësisë së avantazhit asimetrik.',                                                          s:{risk_orientation:5, innovation_potential:5, adaptability:4} },
      { id:'d', t:'Shpejtësi më e ulët në këmbim të cilësisë dhe precizionit shumë më të lartë.',                                                  s:{focus_consistency:5, analytical_depth:5, independent_solving:4} },
    ],
  },
  {
    id:60, module:'values', type:'preferencë',
    q:'Në thelb profesional — cila deklaratë identiteti rezonon më thellë?',
    opts:[
      { id:'a', t:'Jam kryesisht mendimtar. Gjeneroj strategji dhe kuadre që të tjerët ekzekutojnë.',                                               s:{strategic_thinking:5, creative_intelligence:5, analytical_depth:4} },
      { id:'b', t:'Jam kryesisht ndërtues. Kthej vizion të paqartë në realitet funksional.',                                                        s:{independent_solving:5, systems_thinking:5, innovation_potential:4} },
      { id:'c', t:'Jam kryesisht udhëheqës. Zhvilloj njerëz dhe ndërtoj sisteme që krijojnë rezultate.',                                            s:{leadership_drive:5, social_intelligence:4, strategic_thinking:4} },
      { id:'d', t:'Jam kryesisht specialist. Zhvilloj ekspertizë të rrallë dhe të thellë që krijon vlerë të pazëvendësueshme.',                     s:{independent_solving:5, analytical_depth:5, focus_consistency:5} },
    ],
  },
]

// ─── ARKËTIPET (12) ──────────────────────────────────────────────────────────
export const ARCHETYPES = [
  {
    id:'strategic_architect', name:'Arkitekti Strategjik', tagline:'Dizajnon sistemet që formësojnë rezultatet',
    emoji:'♟', color:'#7c3aed',
    desc:'Vepron në kryqëzimin e vizionit dhe strukturës. Nuk sheh vetëm ku duhet të shkojë organizata — dizajnon arkitekturën që e çon atje. Mendimi yt është shumëhorizontal: menaxhon të tashmen duke ndërtuar sistemet që do kenë rëndësi pas 5 vjetësh.',
    strengths:['Mendimi në nivel sistemi','Planifikimi afatgjatë','Arkitektura e vendimmarrjes','Dizajni organizativ','Njohja e modeleve ndërdomenore'],
    challenges:['Mund të mbi-inxhinierojë zgjidhjet','Lufton me pasiguri radikale','Mund të perceptohet si i ngadaltë në ekzekutim'],
    environments:['Organizata të udhëhequra nga strategjia','Operacione në shkallë','Role të dizajnit të sistemeve komplekse','Këshillim ekzekutiv'],
    careers:['Drejtor Strategjie','Konsulent Menaxhimi','Arkitekt Sistemesh','Drejtor Politikash','Kreu i Stafit'],
    leadership:'Dizajnon mjedisin e vendimmarrjes në vend të marrjes së të gjitha vendimeve. Udhëheq nëpërmjet strukturës.',
    burnout:'Humbja e qartësisë strategjike — kur detyrohet në ekzekutim të pastër pa autoritet vizionari.',
    growth:'Zhvillo tolerancë më të lartë ndaj pasigurisë së pareduktushme. Jo çdo sistem mund të dizajnohet paraprakisht.',
    profile:{analytical_depth:90,strategic_thinking:92,creative_intelligence:52,execution_speed:62,pattern_recognition:72,leadership_drive:68,innovation_potential:55,social_intelligence:48,communication_precision:72,emotional_stability:72,risk_orientation:45,adaptability:60,focus_consistency:82,systems_thinking:88,independent_solving:78},
  },
  {
    id:'visionary_catalyst', name:'Katalizatori Vizionar', tagline:'Sheh të ardhmen që të tjerët nuk e kanë imagjinuar akoma',
    emoji:'🔭', color:'#3b82f6',
    desc:'Vepron para konsensusit. Identifikon modele në zhvillim, ndryshime konceptuale dhe hapësira të bardha tregu para se të bëhen të dukshme. Vlera jote më e madhe është në fazat e hershme — kur problemi ende nuk është i definuar dhe zgjidhja nuk është shpikur.',
    strengths:['Mendimi i të ardhmes','Sinteza konceptuale','Gjenerimi i ideve në shkallë','Njohja e tendencave','Frymëzimi i të tjerëve me vizion'],
    challenges:['Thellësia e ekzekutimit','Ndjekja e detajeve','Mund të humbasë interesin pas fazës së ideve'],
    environments:['Laboratorë inovacioni','Sipërmarrje të hershme','Qendra mendimi','Agjenci kreative','Institucione kërkimore'],
    careers:['Sipërmarrës','Drejtor Inovacioni','Drejtor Kreativ','Kapitalist Sipërmarrës (VC)','Udhëheqës Kërkimor'],
    leadership:'Udhëheq nëpërmjet frymëzimit dhe qartësisë konceptuale. Të tjerët ndjekin sepse vizioni është bindës.',
    burnout:'Të detyrohet të mirëmbajë dhe ekzekutojë çfarë ka ndërtuar tashmë — kurtha e "modalitetit të mirëmbajtjes".',
    growth:'Ndërto një proces ekzekutimi me rigor të lartë nga fillimi deri në fund. Mbarimi është vetë akti kreativ.',
    profile:{analytical_depth:68,strategic_thinking:80,creative_intelligence:90,execution_speed:50,pattern_recognition:58,leadership_drive:72,innovation_potential:92,social_intelligence:62,communication_precision:55,emotional_stability:55,risk_orientation:82,adaptability:75,focus_consistency:40,systems_thinking:65,independent_solving:68},
  },
  {
    id:'analytical_builder', name:'Ndërtuesi Analitik', tagline:'Ndërton gjërat e duhura saktësisht',
    emoji:'🔬', color:'#10b981',
    desc:'Kombinon thellësi analitike të rrallë me tendencë drejt ndërtimit. Nuk teorizon — konstrukton. Puna jote karakterizohet nga korrektësia e brendshme, integriteti struktural dhe precizioni që krijon sisteme të cilave njerëzit u besojnë.',
    strengths:['Rigor sasior','Inxhinieri e precizionit','Arsyetimi nga parimet e para','Zgjidhja e pavarur e problemeve','Ndërtimi i sistemeve që shkallëzohen'],
    challenges:['Komunikimi i njohurive komplekse','Menaxhimi i palëve','Mund të nënvlerësojë faktorë të pa-kuantifikueshëm'],
    environments:['Kompani deep-tech','Kërkim sasior','Organizata inxhinierike','Industri intensive me të dhëna'],
    careers:['Shkencëtar i të Dhënave','Inxhinier ML','Analist Sasior','Shkencëtar Kërkimor','Inxhinier Kryesor'],
    leadership:'Udhëheq nëpërmjet kompetencës së demonstruar dhe autoritetit teknik.',
    burnout:'Të tërhiqet në punë sociale ose politike që e largon nga zanati.',
    growth:'Zhvillo aftësinë për të kthyer thellësinë analitike në komunikim të kuptueshëm për palët vendimmarrëse.',
    profile:{analytical_depth:92,strategic_thinking:65,creative_intelligence:55,execution_speed:72,pattern_recognition:85,leadership_drive:40,innovation_potential:62,social_intelligence:45,communication_precision:60,emotional_stability:68,risk_orientation:45,adaptability:55,focus_consistency:82,systems_thinking:85,independent_solving:90},
  },
  {
    id:'adaptive_leader', name:'Lideri Adaptiv', tagline:'Udhëheq efektivisht nëpër çdo territor',
    emoji:'🌊', color:'#f59e0b',
    desc:'Je me vlerë të madhe në kompleksitet. Mund të lexosh njëkohësisht dhomën, sistemin dhe tregun — dhe pastaj të veprosh. Udhëheqja jote është situacionale: nuk aplikon stil fiks, por kalibron sipas asaj çka kërkon momenti.',
    strengths:['Udhëheqje situacionale','Inteligjencë emocionale','Harmonim ndër-funksional','Performancë në krizë','Ndërtimi i sigurisë psikologjike'],
    challenges:['Mund të perceptohet si jo-konsistent','Mund t\'i mungojë "doktrina" personale e qartë','Gjerësia ndonjëherë në kurriz të thellësisë'],
    environments:['Organizata me rritje të lartë','Projekte transformimi','Ekipe globale','Situata rikuperimi'],
    careers:['Drejtor i Përgjithshëm','Drejtor Operacionesh','Udhëheqës Organizativ','Kreu i Stafit','CEO Rikuperimi'],
    leadership:'I fokusuar thellë tek njerëzit. Ndërton besimin së pari, pastaj nxjerr performancën nëpërmjet tij.',
    burnout:'Mjedise të qëndrueshme me paqartësi të lartë pa mbështetje strukturore.',
    growth:'Zhvillo filozofi udhëheqje të qartë dhe të dokumentuar — adaptueshmëria jote duhet të jetë e ankoruar tek diçka.',
    profile:{analytical_depth:65,strategic_thinking:75,creative_intelligence:58,execution_speed:70,pattern_recognition:55,leadership_drive:85,innovation_potential:60,social_intelligence:82,communication_precision:75,emotional_stability:88,risk_orientation:60,adaptability:90,focus_consistency:65,systems_thinking:65,independent_solving:65},
  },
  {
    id:'precision_executor', name:'Ekzekutuesi Preciz', tagline:'Ofron me konsistencë kirurgjikale',
    emoji:'⚡', color:'#ef4444',
    desc:'Ti je shtylla operacionale e sistemeve me performancë të lartë. Transformon paqartësinë në qartësi, strategjinë në orare dhe angazhimet në rezultate të ofruara. Besueshmëria jote është formë e avantazhit konkurrues.',
    strengths:['Ekselencë operacionale','Prodhimtari e cilësisë së lartë','Besueshmëria e afateve','Dizajni i proceseve','Menaxhimi i rrezikut në ekzekutim'],
    challenges:['Mund të rezistojë pivote strategjike','Më pak i rehatshëm me detyra të hapura kreative','Nënvlerëson vlerën e paqartësisë produktive'],
    environments:['Organizata në shkallëzim','Operacione kritike për misionin','Organizata ofruese produktesh','Shërbime financiare'],
    careers:['Drejtor Programi','Drejtor Operacionesh (COO)','Menaxher Inxhinierie','Udhëheqës Operacionesh','Kreu i Stafit'],
    leadership:'Komandon nëpërmjet qartësisë dhe konsistencës. Ekipi di saktësisht çfarë pritet.',
    burnout:'Zgjerim i vazhdueshëm i fushëveprimit pa autoritet ta kufizojë.',
    growth:'Praktiko me qëllim nën-specifikimin e projektit dhe lëri rezultate të dalin — ndërto rehatësi me paqartësi produktive.',
    profile:{analytical_depth:72,strategic_thinking:65,creative_intelligence:40,execution_speed:90,pattern_recognition:72,leadership_drive:55,innovation_potential:45,social_intelligence:50,communication_precision:82,emotional_stability:75,risk_orientation:35,adaptability:60,focus_consistency:90,systems_thinking:75,independent_solving:78},
  },
  {
    id:'innovation_architect', name:'Arkitekti i Inovacionit', tagline:'Dizajnon sisteme që nuk ekzistonin',
    emoji:'💡', color:'#ec4899',
    desc:'Rri në kryqëzimin e imagjinatës dhe inxhinierisë. Nuk gjeneron vetëm ide — arkitekton sistemet, proceset dhe infrastrukturat që bëjnë të mundshme kategori krejtësisht të reja. Je personi që ndërton platformën mbi të cilën të tjerët ndërtojnë.',
    strengths:['Mendimi platformë','Dizajni i sistemeve të reja','Kreativiteti teknik','Vizioni i produktit afatgjatë','Sinteza ndërdisiplinore'],
    challenges:['Konsistenca e ekzekutimit','Puna rritëse','Mund të dizajnojë sisteme përtej kapacitetit organizativ'],
    environments:['Kompani platformë','Firma me intensitet të lartë R&D','Organizata të udhëhequra nga produkti','Startup teknik'],
    careers:['Drejtor Teknik (CTO)','Arkitekt Produkti','Udhëheqës Platforme','Kreu i R&D','Dizajner Kryesor'],
    leadership:'Krijon mjedise ku inovacioni është prodhimi natyral i sistemit.',
    burnout:'Të detyrohet të mirëmbajë sisteme legacy që vetë i ka ndërtuar.',
    growth:'Ndërto një proces operacional nga fillimi deri në fund. Arkitektura pa ndjeshmëri operacionale prodhon sisteme të brishta.',
    profile:{analytical_depth:75,strategic_thinking:80,creative_intelligence:85,execution_speed:55,pattern_recognition:70,leadership_drive:65,innovation_potential:90,social_intelligence:55,communication_precision:65,emotional_stability:55,risk_orientation:70,adaptability:65,focus_consistency:50,systems_thinking:82,independent_solving:72},
  },
  {
    id:'empathic_strategist', name:'Strategjisti Empatik', tagline:'Ekzekuton strategjinë nëpërmjet njerëzve, jo mbi ta',
    emoji:'🤝', color:'#06b6d4',
    desc:'Kupton se strategjia është akt social. Navigon dimensionin njerëzor të jetës organizative me të njëjtin precision analitik që të tjerët aplikojnë ndaj të dhënave. Je njëaq efektiv në sallën e bordeve sa dhe në bisedë një-me-një.',
    strengths:['Harmonimi i palëve','Ndikimi organizativ','Komunikimi me inteligjencë emocionale','Leximi i dinamikave të grupit','Ndërtimi i besimit ndërmjet funksioneve'],
    challenges:['Mund të shmangë vendime të vështira','Mund të jetë shumë i orientuar drejt konsensusit','Tendencë drejt shmangies së konfliktit ndërnjerëzor'],
    environments:['Organizata matricë','Industri intensive me njerëz','Role këshilluese udhëheqëse','Ndërmarrje sociale'],
    careers:['Drejtor i Njerëzve (CPO)','Menaxher Produkti','Drejtor Marketingu','Dizajner Organizativ','Partner Strategjie'],
    leadership:'Udhëheq duke ndërtuar kapital relacional së pari. Strategjia implementohet nëpërmjet besimit të fituar.',
    burnout:'Mbajtja e peshës emocionale të të tjerëve pa rikuperim strukturor.',
    growth:'Zhvillo aftësinë për të marrë dhe mbajtur vendime të vështira që do të kushtojnë kapital social.',
    profile:{analytical_depth:65,strategic_thinking:78,creative_intelligence:60,execution_speed:55,pattern_recognition:55,leadership_drive:68,innovation_potential:60,social_intelligence:90,communication_precision:88,emotional_stability:85,risk_orientation:45,adaptability:70,focus_consistency:60,systems_thinking:65,independent_solving:60},
  },
  {
    id:'high_agency_founder', name:'Themeluesi me Iniciativë të Lartë', tagline:'Merr pronësi të rezultateve pavarësisht strukturës',
    emoji:'🚀', color:'#f97316',
    desc:'Vepron me marrëdhënie thelbësisht të ndryshme ndaj autoritetit dhe rezultatit. Kur sheh problem, pyetja nuk është "kujt i takon kjo?" — por "çfarë do bëj unë për të?" Ky orientim të bën jashtëzakonisht efektiv në mjedise të hershme dhe burim fërkimi potencial në ato rigide.',
    strengths:['Pronësi ekstreme','Shpejtësia nën pasiguri','Krijimi i sipërmarrjeve','Zgjidhja e pavarur e problemeve','Rezistenca ndaj dështimit'],
    challenges:['Puna brenda strukturave hierarkike','Delegimi','Durimi me organizata të ngarkuara me procese'],
    environments:['Startup','Kompani të financuara me VC','Konsultim i pavarur','Divizione sipërmarrëse'],
    careers:['Themelues / CEO','Ndërtues Sipërmarrjesh','Sipërmarrës i Brendshëm','Udhëheqës i Njësisë','Partner i Përgjithshëm (VC)'],
    leadership:'Pronësia e parë: beson se udhëheqësi hyn i pari në çfarë është më e vështirë.',
    burnout:'Humbja e pronësisë — kur organizata rritet dhe kontrolli difuzohet.',
    growth:'Ndërto ekip besimi të lartë dhe lëri të kenë pronësi mbi diçka që kujdesesh thellë. Leveria është tek njerëzit e tjerë.',
    profile:{analytical_depth:65,strategic_thinking:78,creative_intelligence:70,execution_speed:75,pattern_recognition:55,leadership_drive:90,innovation_potential:82,social_intelligence:60,communication_precision:65,emotional_stability:60,risk_orientation:85,adaptability:80,focus_consistency:55,systems_thinking:65,independent_solving:75},
  },
  {
    id:'systems_optimizer', name:'Optimizuesi i Sistemeve', tagline:'Bën sistemet komplekse të performojnë në tavanin e tyre',
    emoji:'⚙️', color:'#84cc16',
    desc:'Sheh sisteme ku të tjerët shohin detyra. Nxjerr kënaqësi të thellë nga kuptimi i mënyrës si funksionon realisht procesi kompleks — dhe pastaj ridizajnimi i tij që prodhimi të jetë strukturalisht më i mirë. Je personi që organizatat kanë desperatçerisht nevojë dhe rrallë dinë ta gjejnë.',
    strengths:['Analiza e proceseve','Identifikimi i ngushtimeve','Mendimi i infrastrukturës','Optimizimi i bazuar në të dhëna','Shkallëzimi operacional'],
    challenges:['Kompleksiteti me faktor njerëzor','Rezistenca ndaj variablave jo-sasorë','Mund të optimizojë sistemin e gabuar bukur'],
    environments:['Organizata inxhinierike në shkallë','Biznese intensive operacionale','Infrastrukturë financiare','Kompani platformë'],
    careers:['Inxhinier i të Dhënave','Arkitekt Platforme','Analist Biznesi','Strateg Operacionesh','Udhëheqës Infrastrukture ML'],
    leadership:'Udhëheq nëpërmjet qartësisë strukturore — sistemet që dizajnon flasin vetë.',
    burnout:'Operimi në organizata shumë politike komplekse për të implementuar përmirësime strukturore.',
    growth:'Angazhohu me qëllim me probleme cilësore, të centruara tek njerëzit që rezistojnë kuadret tua natyrale.',
    profile:{analytical_depth:85,strategic_thinking:65,creative_intelligence:45,execution_speed:75,pattern_recognition:82,leadership_drive:45,innovation_potential:50,social_intelligence:50,communication_precision:65,emotional_stability:70,risk_orientation:40,adaptability:60,focus_consistency:85,systems_thinking:90,independent_solving:75},
  },
  {
    id:'creative_connector', name:'Lidhësi Kreativ', tagline:'Krijon nëpërmjet marrëdhënieve dhe sintezës së papritur',
    emoji:'✨', color:'#a855f7',
    desc:'Aftësia jote më e fuqishme është sinteza — kombinimi i ideve, njerëzve dhe disiplinave në mënyra që prodhojnë rezultate që asnjë domain i vetëm nuk mund t\'i gjenerojë. Ti je ura midis botëve që zakonisht nuk bisedojnë me njëra-tjetrën.',
    strengths:['Sinteza ndërdomenore','Leveria e rrjetit','Ideimi kreativ','Mendimi mbi brand dhe narrativë','Inovacioni i drejtuar nga marrëdhënia'],
    challenges:['Puna analitike e thellë','Fokusi i zgjatur solo','Rigor sasior'],
    environments:['Agjenci kreative','Organizata brand','Platforma sociale','Institucione kulturore','Kompani të udhëhequra nga dizajni'],
    careers:['Drejtor Kreativ','Strateg Brand','Sipërmarrës Kreativ','Krijues Përmbajtjeje','Udhëheqës Strategji UX'],
    leadership:'Frymëzues dhe gjithëpërfshirës. Krijon mjedise ku kreativiteti ndjehet i sigurt.',
    burnout:'Të detyrohet në rol krejtësisht analitik ose ekzekutiv procesesh.',
    growth:'Ndërto një projekt nga koncepti deri tek matja sasorë rigoroze. Të dhënat do ta bëjnë kreativitetin tënd më të fuqishëm.',
    profile:{analytical_depth:50,strategic_thinking:60,creative_intelligence:90,execution_speed:50,pattern_recognition:50,leadership_drive:55,innovation_potential:80,social_intelligence:88,communication_precision:85,emotional_stability:70,risk_orientation:55,adaptability:72,focus_consistency:45,systems_thinking:50,independent_solving:55},
  },
  {
    id:'resilient_commander', name:'Komandanti Rezistent', tagline:'Performon në kulm nën presionin maksimal',
    emoji:'🛡', color:'#64748b',
    desc:'Je kalibruar për aksion me aksion të lartë. Kur kushtet përkeqësohen — kur të dhënat mungojnë, afati ka kolapsuar dhe ekipi kërkon drejtim — ti performon më mirë, jo më keq. Kjo nuk është aftësi e zakonshme. Në mjedisin e duhur, vlen më shumë se pothuajse çdo tjetër.',
    strengths:['Performanca në krizë','Veprim vendimtar','Stabiliteti psikologjik nën presion','Kohezion ekipi në vështirësi','Qartësia operacionale kur ka rëndësi'],
    challenges:['Mjedise me aksion të ulët','Organizata burokratike','Strategjia e gjatë-horizontale me durim'],
    environments:['Industri me aksion të lartë','Menaxhim krizash','Rikuperimi','Sisteme reagimi ndaj emergjencave'],
    careers:['Drejtor Krizash','Komandant Operacionesh','Udhëheqës Strategjie Emergjence','CEO Rikuperimi','Komandant Incidenti'],
    leadership:'Udhëheq nga fronti nën zjarr. Qetë kur të tjerët panikojnë.',
    burnout:'Mjedise të qëndrueshme me urgjencë të ulët — mungesa e sfidës është forma e vet e stresit.',
    growth:'Zhvillo durimin për punën strategjike me horizont të gjatë dhe me lëvizje të ngadaltë. Jo të gjitha problemet e rëndësishme janë urgjente.',
    profile:{analytical_depth:65,strategic_thinking:72,creative_intelligence:50,execution_speed:82,pattern_recognition:60,leadership_drive:88,innovation_potential:55,social_intelligence:65,communication_precision:70,emotional_stability:88,risk_orientation:65,adaptability:85,focus_consistency:72,systems_thinking:65,independent_solving:68},
  },
  {
    id:'deep_specialist', name:'Specialisti i Thellë', tagline:'Zhvillon ekspertizë të rrallë që krijon vlerë të pazëvendësueshme',
    emoji:'🔭', color:'#0ea5e9',
    desc:'Je personi që shkon ku të tjerët nuk shkojnë. Zhvillon thellësi të vërtetë në domain — llojin që kërkon vite dhe prodhon njohuri të paaccessueshme nga gjeneralistët. Në botën e njohurive sipërfaqësore, thellësia jote është hendeku konkurrues.',
    strengths:['Zotërim domeni','Thellësia analitike e pavarur','Rigor kërkimor','Punë e fokusuar afatgjatë','Besueshmëria intelektuale'],
    challenges:['Gjerësia dhe ndërrimi i kontekstit','Komunikimi me palët','Ndikimi organizativ pa autoritet pozicional'],
    environments:['Institucione kërkimore','Organizata akademike','Kompani deep-tech','Firma konsultuese specialiste'],
    careers:['Shkencëtar Kërkimor','Inxhinier Kryesor','Ekspert Domeni','Profesor','Bashkëpunëtor Teknik'],
    leadership:'Udhëheq nëpërmjet autoritetit intelektual dhe zotërimit të demonstruar.',
    burnout:'Të detyrohet të gjeneralizojë ose të ndërrojë kontekst vazhdimisht ndërmjet domeneve të palidhura.',
    growth:'Zhvillo aftësinë komunikuese për ta bërë ekspertizën tënde të kuptueshme për vendimmarrësit që nuk ndajnë thellësinë tënde.',
    profile:{analytical_depth:92,strategic_thinking:60,creative_intelligence:55,execution_speed:65,pattern_recognition:85,leadership_drive:35,innovation_potential:55,social_intelligence:40,communication_precision:65,emotional_stability:72,risk_orientation:45,adaptability:55,focus_consistency:88,systems_thinking:75,independent_solving:90},
  },
]

// ─── LISTA E KARRIERAVE (18) ───────────────────────────────────────────────────
export const CAREERS = [
  { id:'product_manager',       name:'Menaxher Produkti',             icon:'📦', profile:{strategic_thinking:85,social_intelligence:80,communication_precision:80,analytical_depth:72,systems_thinking:75,innovation_potential:65,leadership_drive:70,adaptability:70} },
  { id:'software_engineer',     name:'Inxhinier Softueri',            icon:'💻', profile:{analytical_depth:85,pattern_recognition:80,systems_thinking:82,independent_solving:82,focus_consistency:78,execution_speed:72} },
  { id:'data_scientist',        name:'Shkencëtar i të Dhënave',       icon:'📊', profile:{analytical_depth:90,pattern_recognition:85,systems_thinking:80,focus_consistency:80,independent_solving:80,strategic_thinking:65} },
  { id:'founder_ceo',           name:'Themelues / CEO',               icon:'🚀', profile:{leadership_drive:90,risk_orientation:85,innovation_potential:80,adaptability:80,strategic_thinking:85,independent_solving:80,emotional_stability:70} },
  { id:'strategy_consultant',   name:'Konsulent Strategjie',          icon:'♟',  profile:{strategic_thinking:90,analytical_depth:85,communication_precision:82,systems_thinking:80,pattern_recognition:72,leadership_drive:65} },
  { id:'ux_designer',           name:'Dizajner UX / Produkti',        icon:'🎨', profile:{creative_intelligence:88,social_intelligence:80,communication_precision:75,pattern_recognition:75,analytical_depth:65,innovation_potential:72} },
  { id:'research_scientist',    name:'Shkencëtar Kërkimor',           icon:'🔬', profile:{analytical_depth:90,independent_solving:90,focus_consistency:88,pattern_recognition:85,systems_thinking:75,emotional_stability:72} },
  { id:'venture_capitalist',    name:'Kapitalist Sipërmarrës (VC)',   icon:'💰', profile:{strategic_thinking:88,risk_orientation:85,analytical_depth:82,social_intelligence:78,pattern_recognition:75,communication_precision:72} },
  { id:'marketing_director',    name:'Drejtor Marketingu',            icon:'📣', profile:{creative_intelligence:82,communication_precision:85,social_intelligence:80,strategic_thinking:78,innovation_potential:75,adaptability:72} },
  { id:'operations_director',   name:'Drejtor Operacionesh',          icon:'⚙️',  profile:{systems_thinking:88,focus_consistency:85,execution_speed:85,leadership_drive:72,communication_precision:72,emotional_stability:72} },
  { id:'ml_engineer',           name:'Inxhinier ML / AI',             icon:'🤖', profile:{analytical_depth:90,systems_thinking:88,pattern_recognition:85,independent_solving:85,focus_consistency:80,strategic_thinking:65} },
  { id:'org_psychologist',      name:'Psikolog Klinik / Organizativ', icon:'🧠', profile:{social_intelligence:90,emotional_stability:88,communication_precision:85,analytical_depth:72,independent_solving:75,adaptability:72} },
  { id:'investment_analyst',    name:'Analist Investimesh',           icon:'📈', profile:{analytical_depth:88,pattern_recognition:85,strategic_thinking:82,focus_consistency:80,systems_thinking:78,independent_solving:80} },
  { id:'creative_director',     name:'Drejtor Kreativ',               icon:'✨', profile:{creative_intelligence:92,innovation_potential:85,communication_precision:80,social_intelligence:72,strategic_thinking:68,risk_orientation:65} },
  { id:'policy_analyst',        name:'Analist Politikash / Publik',   icon:'🏛',  profile:{strategic_thinking:85,analytical_depth:82,communication_precision:80,systems_thinking:78,social_intelligence:72,emotional_stability:70} },
  { id:'management_consultant', name:'Konsulent Menaxhimi',           icon:'📋', profile:{strategic_thinking:88,analytical_depth:82,leadership_drive:78,communication_precision:82,systems_thinking:75,social_intelligence:68} },
  { id:'engineering_manager',   name:'Menaxher Inxhinierie',          icon:'🛠',  profile:{systems_thinking:85,leadership_drive:78,analytical_depth:78,focus_consistency:82,execution_speed:80,communication_precision:75} },
  { id:'impact_leader',         name:'Udhëheqës Social / Impact',     icon:'🌍', profile:{social_intelligence:88,leadership_drive:85,emotional_stability:82,adaptability:78,communication_precision:80,innovation_potential:65} },
]

// ─── MOTORI I NOTIMIT ─────────────────────────────────────────────────────────
export function scoreAssessment(answers) {
  const DIM_KEYS = Object.keys(DIMENSIONS)
  const raw = {}
  DIM_KEYS.forEach(d => { raw[d] = 0 })

  QUESTIONS.forEach(q => {
    const chosen = q.opts.find(o => o.id === answers[q.id])
    if (!chosen) return
    Object.entries(chosen.s).forEach(([dim, pts]) => { raw[dim] = (raw[dim] || 0) + pts })
  })

  const maxRaw = {}
  DIM_KEYS.forEach(d => { maxRaw[d] = 0 })
  QUESTIONS.forEach(q => {
    const best = {}
    q.opts.forEach(o => {
      Object.entries(o.s).forEach(([dim, pts]) => {
        if (!best[dim] || pts > best[dim]) best[dim] = pts
      })
    })
    Object.entries(best).forEach(([dim, pts]) => { maxRaw[dim] = (maxRaw[dim] || 0) + pts })
  })

  const dimensions = {}
  DIM_KEYS.forEach(d => {
    dimensions[d] = maxRaw[d] > 0 ? Math.min(100, Math.round((raw[d] / maxRaw[d]) * 100)) : 50
  })

  const weights = {
    analytical_depth:1.2, strategic_thinking:1.3, pattern_recognition:1.2,
    systems_thinking:1.2, leadership_drive:1.0, innovation_potential:1.0,
    emotional_stability:1.1, adaptability:1.1, communication_precision:1.0,
    social_intelligence:1.0, creative_intelligence:1.0, execution_speed:1.0,
    focus_consistency:1.0, independent_solving:1.0, risk_orientation:0.9,
  }
  const totalW = Object.values(weights).reduce((a, b) => a + b, 0)
  const wavg   = Object.entries(weights).reduce((s, [d, w]) => s + (dimensions[d] || 50) * w, 0) / totalW
  const neuroScore = Math.min(160, Math.max(60, Math.round(60 + wavg)))

  let archetype = ARCHETYPES[0], bestDist = Infinity
  ARCHETYPES.forEach(a => {
    const dist = DIM_KEYS.reduce((s, d) => { const diff = (dimensions[d]||50)-(a.profile[d]||50); return s+diff*diff }, 0)
    if (dist < bestDist) { bestDist = dist; archetype = a }
  })

  const careers = CAREERS.map(c => {
    const dims = Object.keys(c.profile)
    const dot  = dims.reduce((s, d) => s + (dimensions[d]||50) * c.profile[d], 0)
    const magA = Math.sqrt(dims.reduce((s, d) => s + (dimensions[d]||50)**2, 0))
    const magB = Math.sqrt(dims.reduce((s, d) => s + c.profile[d]**2, 0))
    const sim  = magA && magB ? dot/(magA*magB) : 0
    return { ...c, compatibility: Math.min(99, Math.round(55 + sim * 48)) }
  }).sort((a,b) => b.compatibility - a.compatibility).slice(0, 8)

  const sorted    = DIM_KEYS.slice().sort((a,b) => dimensions[b]-dimensions[a])
  const strengths = sorted.slice(0,3).map(d => ({ key:d, score:dimensions[d], ...DIMENSIONS[d] }))
  const growth    = sorted.slice(-3).map(d => ({ key:d, score:dimensions[d], ...DIMENSIONS[d] }))

  return { dimensions, neuroScore, archetype, careers, strengths, growth }
}
