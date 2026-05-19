import { useState, useEffect } from 'react'
import {
  X, Brain, Zap, Target, BookOpen, TrendingUp,
  ExternalLink, CheckCircle, Clock, ChevronRight,
  FileText, Play,
} from 'lucide-react'

/* ─── TAB CONFIG ─────────────────────────────────────────────────────────── */
const TABS = [
  { label: 'Shpjegimi', Icon: Brain },
  { label: 'Teknikat',  Icon: Zap },
  { label: 'Ushtrimet', Icon: Target },
  { label: 'Burimet',   Icon: BookOpen },
  { label: 'Progresi',  Icon: TrendingUp },
]

/* ─── DATA ───────────────────────────────────────────────────────────────── */
const PROBLEMS_DATA = {
  memory: {
    icon: '😵', subtitle: 'Neuroshkenca e Kujtesës',
    title: 'Mëson shumë, por nuk mban mend asgjë',
    color: '#a78bfa', glow: 'rgba(124,58,237,0.3)',
    gradient: 'linear-gradient(135deg,#7c3aed,#5b21b6)',
    stats: [
      { value: '70%', label: 'e informacionit harrohet brenda 24 orësh pa reinforcement', src: 'Ebbinghaus, 1885' },
      { value: '50%', label: 'rritje e retentionit me active recall vs. ri-lexim', src: 'Karpicke & Roediger, Science 2008' },
    ],
    explanation: {
      headline: 'Pse truri harron — dhe si ta ndreqim',
      body: 'Psikologu Hermann Ebbinghaus zbuloi në 1885 se truri harron me shpejtësi eksponenciale pa reinforcement. "Kurba e Harresës" tregon se pas 24 orësh humbet ~70% e materialit të ri. Por neuroshkenca moderne ka zbuluar metodat specifike që e kundërshtojnë këtë proces biologjik.',
      concepts: [
        { icon: '📉', name: 'Kurba e Harresës (Ebbinghaus)', desc: 'Pa rishikim aktiv, truri humbet 70% të informacionit brenda 24 orësh dhe mbi 90% brenda 7 ditësh. Kurba është eksponenciale — humbja e parë është më e shpejtë.', source: 'Ebbinghaus, H. (1885). Memory: A Contribution to Experimental Psychology. Teachers College, Columbia University.' },
        { icon: '🧪', name: 'Testing Effect (Efekti i Testimit)', desc: 'Rikthimi aktiv i informacionit e forcon rrjetet neurale 2–3× më shumë sesa ri-leximi pasiv. Truri konsolidon kujtesat vetëm kur detyrohet t\'i "gjejë" ato.', source: 'Karpicke, J.D. & Roediger, H.L. (2008). The Critical Importance of Retrieval for Learning. Science, 319(5865), 966–968.' },
        { icon: '🧠', name: 'Cognitive Load Theory', desc: 'Memoria e punës mban vetëm 4–7 "chunks" simultane (Miller\'s Law). Mbingarkesa njohëse nga materiali i organizuar keq bllokon transferimin në memorien afatgjatë.', source: 'Sweller, J. (1988). Cognitive Load during Problem Solving: Effects on Learning. Cognitive Science, 12(2), 257–285.' },
        { icon: '🌙', name: 'Konsolidimi gjatë gjumit', desc: 'Gjumi i REM konsolidon kujtesat e reja duke i transferuar nga hipokampusi te korteksi cerebral. 6 orë gjumë = ulje 40% e retentionit krahasuar me 8 orë.', source: 'Walker, M.P. (2009). The Role of Sleep in Cognition and Emotion. Annals of the New York Academy of Sciences.' },
      ],
    },
    techniques: [
      { name: 'Active Recall', difficulty: 'E lehtë', difficulty_color: '#34d399', time: '15 min/ditë', desc: 'Testo veten duke u munduar të kujtosh informacionin nga memoria, pa pasur materialin para teje. Studimi i Karpicke (2008) tregon rritje 50% të retentionit krahasuar me ri-leximin pasiv.', steps: ['Lexo materialin një herë me vëmendje të plotë', 'Mbyll librin/shënimet tërësisht', 'Shkruaj nga memoria gjithçka që kujton', 'Kontrollo dhe shëno me ngjyrë boshllëqet', 'Rishiko vetëm materialet e harruara'], science: 'Karpicke & Roediger (2008). Science, 319(5865). doi:10.1126/science.1152408' },
      { name: 'Spaced Repetition', difficulty: 'Mesatare', difficulty_color: '#fbbf24', time: '20 min/ditë', desc: 'Rishiko materialin në intervale eksponenciale në rritje (1 ditë → 3 → 7 → 21 → 60 ditë). Algoritmi SuperMemo-2 optimizon automatikisht intervalet bazuar në performancën tënde.', steps: ['Krijo flashcard-a Q&A për çdo koncept kyç', 'Shkarko Anki (falas nga ankiweb.net)', 'Shiko 20–30 kartela çdo mëngjes pa hezitim', 'Vlerëso ndershmërisht: 1=dështim, 2=vështirë, 3=mirë, 4=lehtë', 'Lër algoritmin të vendosë intervalet — mos ndërhyj'], science: 'Wozniak, P.A. (1990). Optimization of Learning. University of Technology, Poznan.' },
      { name: 'Feynman Technique', difficulty: 'E mesme', difficulty_color: '#f97316', time: '30 min/koncept', desc: 'Shpjego konceptin sikur po i mësosh një fëmije 12-vjeçar. Kur ndesh vështirësi, ato janë saktësisht boshllëqet e kuptueshme — kthehu tek burimi vetëm për ato pjesë. Richard Feynman e quante "the best technique for learning."', steps: ['Shkruaj emrin e konceptit në krye të faqes', 'Shpjegoje thjesht me fjalë të zakonshme (zero jargon)', 'Ku ngec: ktheje tek materiali burimor specifik', 'Simplifikoje edhe më tej me analogji dhe metafora', 'Testo: a mund ta shpjegosh tani një person tjetër?'], science: 'Elaborative Interrogation — Pressley et al. (1992). Applied Cognitive Psychology, 6(5).' },
      { name: 'Interleaving Practice', difficulty: 'E vështirë', difficulty_color: '#ef4444', time: 'Gjatë studimit', desc: 'Studjo tema të ndryshme alternuese (matematik → fizikë → kimi) në vend të bllokimit të një teme. Ndihej "harder" por Kornell & Bjork (2008) treguan 43% rritje të performancës afatgjatë.', steps: ['Zgjidh 3–4 tema për sesionin e studimit', 'Studjo çdo temë maksimum 25 minuta', 'Ndrysho temën edhe kur ndihesh "mid-concept"', 'Mos studjo të njëjtën temë dy sesione rresht', 'Testo me pyetje të kombineara nga të gjitha temat'], science: 'Kornell, N. & Bjork, R.A. (2008). Learning Concepts and Categories. Psychological Science, 19(6).' },
    ],
    exercises: [
      { title: 'Self-Testing Sprint', icon: '📝', duration: '20 min', steps: ['Zgjidh material që studiove dje ose javën e kaluar', 'Vendos materialin larg — mos shiko asgjë', 'Vendos timer 12 min: shkruaj gjithçka që kujton', 'Hap materialin: shëno me ngjyrë të kuqe çfarë humbe', 'Lexo vetëm gërmëzatat e kuqe (5 min)', 'Testo veten sërish pas 48 orësh'], outcome: 'Pas 3 iteracione me intervalin e duhur, retentioni rritet me 60–70% krahasuar me ri-leximin.' },
      { title: 'Cornell Note System', icon: '📓', duration: 'Gjatë studimit', steps: ['Ndaj faqen: kolonë e majtë (3cm), kolonë kryesore (djathtas)', 'Gjatë leximit: shkruaj shënime në kolonën kryesore (çfarë thuhet)', 'Brenda 24 orësh: shkruaj pyetje kyçe ose keywords majtas', 'Mbullo kolonën kryesore dhe përgjigju pyetjeve nga majtas', 'Shkruaj rezyme 3–4 fjali poshtë çdo faqe', 'Rishiko vetëm rezymën javore'], outcome: 'Sistemi i dokumentuar nga Cornell University (1950) dhe validuar nga dhjetëra studime.' },
      { title: 'Anki Daily Protocol', icon: '🃏', duration: '15 min/ditë', steps: ['Shkarko Anki falas (ankiweb.net) — disponueshëm në të gjitha platformat', 'Gjatë studimit: çdo koncept kryesor → kartela Q&A specifike', 'Çdo mëngjes (jo mbrëmje): shiko kartelat e ditës', 'Vlerëso çdo kartë ndershmërisht 1–4', 'Synoji max 30 kartela të reja/ditë — sasi mbi cilësi dëmton', 'Pas 3 muajsh: 95%+ retention rate me ~15 min/ditë'], outcome: 'Miliona studiues nga Harvard, MIT, dhe shkolla mjekësore e përdorin Anki si metodë parësore.' },
    ],
    resources: [
      { type: 'paper', title: 'The Critical Importance of Retrieval for Learning', authors: 'Karpicke & Roediger (2008)', journal: 'Science, 319(5865), 966–968', url: 'https://www.science.org/doi/10.1126/science.1152408', desc: 'Studimi seminal mbi Testing Effect — rikthimi aktiv vs. ri-leximi pasiv.' },
      { type: 'paper', title: 'Optimizing Learning Using Flashcards: Spacing Is More Effective Than Cramming', authors: 'Kornell, N. (2009)', journal: 'Applied Cognitive Psychology, 23(9)', url: 'https://pubmed.ncbi.nlm.nih.gov/20046193/', desc: 'Dëshmi eksperimentale e superioritetit të spaced repetition.' },
      { type: 'book', title: 'Make It Stick: The Science of Successful Learning', authors: 'Brown, Roediger & McDaniel (2014)', publisher: 'Harvard University Press', url: '#', desc: 'Libri bazë mbi metodat e dëshmuara shkencore të studimit. I bazuar plotësisht në peer-reviewed research.' },
      { type: 'book', title: 'A Mind for Numbers', authors: 'Barbara Oakley (2014)', publisher: 'TarcherPerigee', url: '#', desc: 'Si ta mësosh edhe materien që urren — bazuar në neuroshkencë dhe Coursera\'s most-enrolled course.' },
      { type: 'book', title: 'Moonwalking with Einstein', authors: 'Joshua Foer (2011)', publisher: 'Penguin Press', url: '#', desc: 'Si u bë gazetari Foer kampion botëror i kujtesës — neuroshkenca e "memory palaces" dhe teknikave antike.' },
      { type: 'book', title: 'Peak: Secrets from the New Science of Expertise', authors: 'Anders Ericsson & Robert Pool (2016)', publisher: 'Houghton Mifflin Harcourt', url: '#', desc: 'Teoria e "deliberate practice" nga psikologu që ka studiuar ekspertizën për 30 vjet.' },
      { type: 'book', title: 'Ultralearning', authors: 'Scott H. Young (2019)', publisher: 'Harper Business', url: '#', desc: 'Si të mësosh çdo lëndë me shpejtësi dhe thellësi të jashtëzakonshme — strategji të dëshmuara nga MIT dhe Yale.' },
      { type: 'book', title: 'Shkenca e të Mësuarit (Shqip)', authors: 'Piro Misha — botim shqip', publisher: 'Tiranë', url: '#', desc: 'Hyrje shkencore në psikologjinë e të nxënit — burim referimi për sistemin arsimor shqiptar.' },
    ],
    progress: [
      { week: 'Dita 1–3', goal: 'Instalo Anki. Krijo 30 kartela nga materiali i fundit. Mos studo — vetëm krijo kartela.' },
      { week: 'Java 1', goal: 'Zbato Active Recall çdo ditë. Track numrin e gabimeve — ulje = progres.' },
      { week: 'Java 2', goal: 'Zbato Feynman Technique për 2 koncepte të vështirë nga materiali aktual.' },
      { week: 'Java 3–4', goal: 'Introduko Interleaving: 2 sesione studimi me 3 tema alternuese.' },
      { week: 'Muaji 2', goal: 'Krahaso rezultatet e testeve me muajin 1. Metrica: numri i gabimeve Anki.' },
    ],
  },

  distraction: {
    icon: '📱', subtitle: 'Neuroshkenca e Vëmendjes',
    title: 'Distraktimet marrin 70% të ditës',
    color: '#f9a8d4', glow: 'rgba(236,72,153,0.3)',
    gradient: 'linear-gradient(135deg,#db2777,#9d174d)',
    stats: [
      { value: '23 min', label: 'nevojiten mesatarisht për t\'u rifokusuar plotësisht pas një ndërhyrjeje', src: 'Gloria Mark, UC Irvine 2008' },
      { value: '47%', label: 'e kohës mendja bredh larg taskut aktual — "mind-wandering"', src: 'Killingsworth & Gilbert, Harvard 2010' },
    ],
    explanation: {
      headline: 'Si Silicon Valley ka "hijackuar" vëmendjen tonë',
      body: 'Dopamina — neurotransmetuesi i "anticipimit" — aktivizohet çdo herë kur marrim notifikim. Truri i trajnon veten të "duajë" ndërhyrjet, jo informacionin real. Kjo nuk është dobësi karakteri — është biologji e shfrytëzuar me qëllim nga industria teknologjike.',
      concepts: [
        { icon: '🧩', name: 'Attention Residue Theory', desc: 'Kur kalon nga Task A te Task B, 40% e vëmendjes mbetet te Task A. Sa herë ndërhysh, akumulon "residue" kognitive që degradon performancën edhe kur "fokusohet" te detyra e re.', source: 'Leroy, S. (2009). Why Is It So Hard to Do My Work? Organizational Behavior and Human Decision Processes, 109(2), 168–181.' },
        { icon: '🔔', name: 'Dopamine & Notification Loop', desc: 'Notifikimet aktivizojnë lëshimin e dopaminës bazuar në "variable reward" — e njëjta mekanizëm si slot machines. Truri mësohet të "duajë" anticipimin, jo informacionin aktual.', source: 'Schultz, W. (1997). A Neural Substrate of Prediction and Reward. Science, 275(5306), 1593–1599.' },
        { icon: '🌊', name: 'Flow State (Csikszentmihalyi)', desc: 'Gjendja e "Rrjedhës" — produktiviteti maksimal — arrihet vetëm pas 15–20 minuta punë të pandërprerë dhe kërkon sfidë të balancuar me aftësi. Çdo distraksion e ristarton krejtësisht procesin.', source: 'Csikszentmihalyi, M. (1990). Flow: The Psychology of Optimal Experience. Harper & Row.' },
        { icon: '🌀', name: 'Default Mode Network', desc: 'Kur mendja bredh, aktivizohet DMN — rrjeti neural i "autopilotit". Truri shpenzon ~50% të energjisë metabolike në gjendje DMN, duke reduktuar kapacitetin kognitiv aktiv.', source: 'Raichle et al. (2001). A Default Mode of Brain Function. Proceedings of the National Academy of Sciences, 98(2).' },
      ],
    },
    techniques: [
      { name: 'Deep Work Blocks', difficulty: 'E mesme', difficulty_color: '#fbbf24', time: '90–120 min', desc: 'Cal Newport (profesor Georgetown) definon Deep Work si punë kognitive intensive pa distraksion, që nxjerr vlerën maksimale nga kapaciteti intelektual. 1–4 orë/ditë Deep Work = output i 8 orëve "shallow work".', steps: ['Cakto 90 min bllok çdo mëngjes (para email/social)', 'Telefon në dhomë tjetër ose "Airplane mode"', 'Njo task specifik — deri sa të përfundohet', 'Bëj pushim 15 min kur bloku mbaron (shëtit)', 'Rrito gradualisht: 90 min → 2 orë → 3 orë → 4 orë'], science: 'Newport, C. (2016). Deep Work: Rules for Focused Success in a Distracted World. Grand Central Publishing.' },
      { name: 'Pomodoro Technique', difficulty: 'E lehtë', difficulty_color: '#34d399', time: '25+5 min', desc: 'Francesco Cirillo zhvilloi Pomodoro në vitet 80. Hulumtimet tregojnë se pushimet e rregullta parandalojnë "decision fatigue" dhe ruajnë cilësinë kognitive gjatë gjithë ditës.', steps: ['Zgjidhni 1 task të vetme dhe specifike', 'Vendos timer saktësisht 25 minuta', 'Puno pa asnjë ndërhyrje absolute (jo email, jo telefon)', 'Kur timer bie: pushim 5 min (lëviz, hap sytë)', 'Pas 4 Pomodoro: 20–30 min pushim i gjatë'], science: 'Ariga & Lleras (2011). Brief and Rare Mental "Breaks" Keep You Focused. Cognition, 118(3), 439–443.' },
      { name: 'Environment Design', difficulty: 'E lehtë', difficulty_color: '#34d399', time: 'Setup njëfish', desc: 'BJ Fogg (Stanford) dëshmon se mjedisi fizik dhe dixhital është forca kryesore mbi sjelljen — 10× më i fuqishëm se sa "vullneti". Projektimi i mjedisit ndrysho automatikisht sjelljen pa nevojë për forcë.', steps: ['Hiq telefonin fizikisht nga tabela e punës (jo vetëm face-down)', 'Instalimi i app bllokues (Freedom ose Cold Turkey)', 'Krijo "fokus spot" fizik — vetëm punë, asgjë tjetër', 'Shto dritë natyrale (rrit serotonin dhe vëmendje)', 'Muzikë pa tekst gjatë fokusit (studimet e Stanford)'], science: 'Fogg, B.J. (2009). A Behavior Model for Persuasive Design. Proceedings of the 4th International Conference on Persuasive Technology.' },
      { name: 'Mindfulness Attention Training', difficulty: 'E vështirë', difficulty_color: '#ef4444', time: '10 min/ditë', desc: 'Meta-analiza e 47 studimeve (Goyal et al., JAMA 2014) tregoi ulje 38% të stresit dhe rritje të qëndrueshme të vëmendjes selective. Ndryshime strukturore neurologjike pas 8 javësh praktike.', steps: ['Fillo me 10 min fokus vetëm te frymëmarrja (timer)', 'Kur mendja bredh: NUK është dështim — kthe gjakftohtë', 'Rrit gradualisht çdo 2 javë: 10→15→20→30 min', 'Provo app "Waking Up" (neuroscientific approach) ose Headspace', 'Track: matë kohën e fokusit të pandërprerë para/pas'], science: 'Goyal et al. (2014). Meditation Programs for Psychological Stress and Well-being. JAMA Internal Medicine, 174(3), 357–368.' },
    ],
    exercises: [
      { title: 'Digital Detox Protocol', icon: '📵', duration: '7 ditë', steps: ['Dita 1: Çaktivizo TË GJITHA notifikimet (lër vetëm telefonatat)', 'Dita 2: Vendos telefon jashtë dhomës gjatë 2 orëve mëngjesit', 'Dita 3: Bëj 1 sesion 90 min deep work (mos kontrollo asgjë)', 'Dita 4: Hiq ikonat social media nga ekrani kryesor', 'Dita 5–7: "Phone-free hour" 1 orë para gjumit çdo natë', 'Evaluo: Sa orë/ditë shpenzoje aktivisht? (Screen Time Settings)'], outcome: 'Studiuesit raportojnë mesatarisht +2.4 orë produktive/ditë pas javës 1 të detox.' },
      { title: 'Focus Progression Challenge', icon: '⏱️', duration: '14 ditë', steps: ['Dita 1–3: 1× Pomodoro (25 min) çdo ditë — threshold minimal', 'Dita 4–7: 2× Pomodoro rresht pa pushim midis', 'Dita 8–10: 1× bllok 50 minuta pa ndërhyrje', 'Dita 11–14: 90 min deep work çdo mëngjes si ritual', 'Track çdo ditë: Sa herë u "tundove" ta kontrolloje telefonin?', 'Ulja e tundimeve = forcim neurologjik i korteksit prefrontal'], outcome: 'Ky progression ndryshon literalisht densitetin e mielinës në rrjetet e vëmendjes.' },
    ],
    resources: [
      { type: 'paper', title: 'No Task Left Behind? Examining the Nature of Fragmented Work', authors: 'Mark, Gudith & Klocke (2008)', journal: 'CHI Conference on Human Factors in Computing Systems', url: 'https://dl.acm.org/doi/10.1145/1357054.1357072', desc: 'Studimi origjinal: 23 minuta për t\'u rifokusuar pas ndërhyrjeje.' },
      { type: 'paper', title: 'Why Is It So Hard to Do My Work?', authors: 'Sophie Leroy (2009)', journal: 'Organizational Behavior & Human Decision Processes, 109(2)', url: 'https://www.sciencedirect.com/science/article/pii/S0749597809000399', desc: 'Studimi origjinal i Attention Residue Theory.' },
      { type: 'book', title: 'Deep Work: Rules for Focused Success', authors: 'Cal Newport (2016)', publisher: 'Grand Central Publishing', url: '#', desc: 'Argumenti akademik dhe praktik për vlerën e punës kognitive intensive.' },
      { type: 'book', title: 'Indistractable', authors: 'Nir Eyal (2019)', publisher: 'BenBella Books', url: '#', desc: 'Ish-dizajnuesi i adiktivitetit shpjegon si t\'i kundërvihesh tërheqjeve dixhitale.' },
      { type: 'book', title: 'The Shallows: What the Internet Is Doing to Our Brains', authors: 'Nicholas Carr (2010)', publisher: 'W. W. Norton & Company', url: '#', desc: 'Finalist i Pulitzer — si interneti po ristrukturon neurologjikisht mënyrën si mendojmë dhe fokusohemi.' },
      { type: 'book', title: 'Hyperfocus: How to Manage Your Attention in a World of Distraction', authors: 'Chris Bailey (2018)', publisher: 'Viking', url: '#', desc: 'Strategji praktike për menaxhimin e vëmendjes bazuar në hulumtime kognitive bashkëkohore.' },
      { type: 'book', title: 'Your Brain at Work', authors: 'David Rock (2009)', publisher: 'HarperBusiness', url: '#', desc: 'Si funksionon korteksi prefrontal gjatë punës — dhe si ta optimizosh performancën kognitive.' },
      { type: 'book', title: 'Puna e Thellë (Shqip)', authors: 'Cal Newport — përkthim shqip', publisher: 'Botim shqip i disponueshëm', url: '#', desc: '"Deep Work" i përkthyer — argument shkencore dhe praktik për fokusin e thellë në gjuhën shqipe.' },
    ],
    progress: [
      { week: 'Dita 1', goal: 'Çaktivizo të gjitha notifikimet sociale dhe news. Zero exceptions.' },
      { week: 'Java 1', goal: 'Bëj 1× Pomodoro çdo ditë pa dështim. Filloja e streak.' },
      { week: 'Java 2', goal: 'Provo 1× bllok 90 min deep work çdo mëngjes para emailit.' },
      { week: 'Java 3', goal: 'Instalo app bllokues. Shto "fokus spot" fizik specifik.' },
      { week: 'Muaji 2', goal: 'Synoji 3–4 orë punë të thellë/ditë si zakon i konsoliduar.' },
    ],
  },

  information: {
    icon: '📚', subtitle: 'Information Literacy & Knowledge Management',
    title: 'Ka burime kudo — askush nuk të tregon si t\'i filtrojë',
    color: '#93c5fd', glow: 'rgba(59,130,246,0.3)',
    gradient: 'linear-gradient(135deg,#2563eb,#1e40af)',
    stats: [
      { value: '2.5 EB', label: 'informacion i ri prodhohej çdo ditë në 2023 (2.5 exabytes)', src: 'Domo Data Never Sleeps Report 2023' },
      { value: '35%', label: 'e vendimeve preken negativisht nga mbingarkesa informative', src: 'Bain & Company Research 2019' },
    ],
    explanation: {
      headline: 'Mbingarkesa e informacionit — dëmi neurologjik i dokumentuar',
      body: 'Pasoja e mbikonsumimit të informacionit nuk është vetëm "stres" subjektiv. Neuroshkenca dhe psikologjia kognitive tregojnë se information overload degradon cilësinë e vendimeve, shkakton decision fatigue kronik, dhe zvogëlon kapacitetin e mendimit kritik. Zgjidhja nuk është më shumë konsumim — por sisteme inteligjente filtrimi.',
      concepts: [
        { icon: '🌊', name: 'Paradoksi i Zgjedhjes (Barry Schwartz)', desc: 'Opsione dhe burime më të shumta reduktojnë satisfaksionin dhe rrisin ankthin e vendimit. E njëjta gjë ndodh me informacionin — bollëku i tij paralizon veprimtarinë.', source: 'Schwartz, B. (2004). The Paradox of Choice: Why More Is Less. Harper Perennial.' },
        { icon: '🧠', name: 'Decision Fatigue', desc: 'Korteksi prefrontal konsumot kapacitet kognitiv me çdo vendim, duke përfshirë "çfarë të lexoj". Pas 200+ vendimeve/ditë, cilësia e gjykimit bie ndjeshëm dhe automatikisht.', source: 'Baumeister et al. (1998). Ego Depletion: Is the Active Self a Limited Resource? Journal of Personality and Social Psychology, 74(5).' },
        { icon: '🫧', name: 'Filter Bubble', desc: 'Algoritmet e platformave sociale ndërtojnë "burbuza filtruese" — ekspozojnë vetëm informacionin që konfirmon besimet ekzistuese, duke kufizuar perspektivat kritike dhe njohuritë e vërteta.', source: 'Pariser, E. (2011). The Filter Bubble: What the Internet Is Hiding from You. Penguin Press.' },
        { icon: '📊', name: 'Dunning-Kruger Effect', desc: 'Konsumimi sipërfaqësor i shumë burimeve krijon iluzionin e ekspertizës — ndjesia "di shumë" pa sistemet e verifikimit që boshllëqet reale të njohurisë të bëhen të dukshme.', source: 'Kruger, J. & Dunning, D. (1999). Unskilled and Unaware of It. Journal of Personality and Social Psychology, 77(6).' },
      ],
    },
    techniques: [
      { name: 'SIFT Method', difficulty: 'E lehtë', difficulty_color: '#34d399', time: '2 min/burim', desc: 'Mike Caulfield zhvilloi SIFT si standard i media literacy të mësuar tani në Stanford University. Metoda 4-hapshe për evaluimin e çdo burimi informacioni para se ta konsumosh ose shpërndash.', steps: ['Stop — mos reago menjëherë ndaj contentit, merr moment', 'Investigate the source — kush e publikon? Çfarë interesash ka?', 'Find better coverage — kërko 2–3 burime të pavarura për të njëjtën temë', 'Trace claims — gjej burimin origjinal të pretendimit (jo ri-publikimin)', 'Wikipedia ≠ burim final, por është pikënisje e mirë për orientim'], science: 'Caulfield, M. (2017). Web Literacy for Student Fact-Checkers. Pressbooks Open Textbook.' },
      { name: 'PARA Method (Tiago Forte)', difficulty: 'E mesme', difficulty_color: '#fbbf24', time: '2 orë setup', desc: 'PARA (Projects/Areas/Resources/Archives) është sistemi i organizimit të njohurive i dokumentuar dhe i përdorur nga 50,000+ profesionistë. Vendos çdo informacion saktësisht ku i takon — dhe e gjen kur ke nevojë.', steps: ['Projects: detyra aktive me deadline specifik', 'Areas: zona me standarde të qëndrueshme (shëndeti, financat)', 'Resources: interesat dhe tema për eksplorim të ardhshëm', 'Archives: gjithçka e mbyllur/joaktive (ruaj, mos fshi)', 'Çdo notë/artikull: vendose në kategorinë e duhur brenda 10 sekondave'], science: 'Forte, T. (2022). Building a Second Brain: A Proven Method to Organize Your Digital Life. Atria Books.' },
      { name: 'Zettelkasten Method', difficulty: 'E vështirë', difficulty_color: '#ef4444', time: 'Investim afatgjatë', desc: 'Niklas Luhmann, sociologu gjerman, prodhoi 70,000 nota të lidhura gjatë 30 vjetëve dhe botoi 58 libra. Zettelkasten krijon "rrjet mendimi" — lidhjet mes ideve prodhojnë njohuri të re, jo vetëm ruajtje pasive.', steps: ['Çdo ide e vetme → nota atomike e pavarur', 'Lidhja e notave: "Kjo lidhet me [ID-ja e notës X] sepse..."', 'Indeksi qendror = hyrja kryesore në të gjithë rrjetin', 'Kurrë mos kopjo tekst — parafrazo gjithmonë me fjalët tua', 'Lër "emergent connections" të dalin vetë mes notave'], science: 'Ahrens, S. (2017). How to Take Smart Notes: One Simple Technique to Boost Writing. CreateSpace.' },
      { name: 'Deliberate Curation', difficulty: 'E lehtë', difficulty_color: '#34d399', time: '30 min/javë', desc: '"Media diet" — konsumim i qëllimshëm i burimeve të selektuara, sikundër dieta ushqimore. Cal Newport dhe Ryan Holiday rekomandojnë: pak burime cilësore > shumë burime sipërfaqësore.', steps: ['Hiq 80% të feed-ave sociale — mbaj vetëm burimet e domosdoshme', 'Abonohu vetëm 5–7 newsletter cilësor nga ekspertë të verifikuar', 'Cakto "media window" të kufizuar (30 min/ditë, jo casual scroll)', 'Prioritizo libra mbi artikuj — thellësi vs. gjerësi sipërfaqësore', 'Provo "news fast" 7 ditë çdo muaj — vëre çfarë humb realisht'], science: 'Newport, C. (2019). Digital Minimalism: Choosing a Focused Life in a Noisy World. Portfolio/Penguin.' },
    ],
    exercises: [
      { title: 'Information Diet Audit', icon: '📊', duration: '1 orë', steps: ['Listo TË GJITHA burimet informative që konsumon (apps, site, newsletter, podcast)', 'Vlerëso çdo burim me A/B/C (A=thelbësor, B=i dobishëm, C=zhurmë)', 'Fshi ose zhbëj abonimin të gjitha burimeve C — tani, pa hezitim', 'Kufizo burimet B: maksimum 2× javë, jo çdo ditë', 'Rishiko listën çdo muaj — kriteri: "A do ta paguaja këtë burim?"', 'Rezultati mesatar: 60% e burimeve janë "C" — zhurmë e pastër'], outcome: 'Auditin e kryejnë profresionistë të suksesshëm çdo tremujor si "maintenance" kognitive.' },
      { title: 'SIFT Sprint (1 javë)', icon: '🔍', duration: '2 min/artikull', steps: ['Zgjidh 5 artikuj të rastit që ke lexuar ose ndarë sot', 'Zbato SIFT: kush publikon? çfarë interesash ka burimi?', 'Gjej: a ka studime peer-reviewed pas pretendimeve kryesore?', 'Kontrollo: çfarë thotë burim tjetër i pavarur për temën njëjt?', 'Konkludo: cilat artikuj ishin cilësorë? Hiq burimet e dobëta.', 'Pas 7 ditësh: do vësh re se sa shumë "content" është i pavlerë'], outcome: 'Ndërtimi i "bullshit detector" personal është ndoshta aftësia kognitive me vlerën më të lartë.' },
    ],
    resources: [
      { type: 'paper', title: 'Ego Depletion: Is the Active Self a Limited Resource?', authors: 'Baumeister et al. (1998)', journal: 'Journal of Personality & Social Psychology, 74(5)', url: 'https://pubmed.ncbi.nlm.nih.gov/9599441/', desc: 'Baza shkencore e decision fatigue dhe kufijve kognitiv.' },
      { type: 'book', title: 'Building a Second Brain', authors: 'Tiago Forte (2022)', publisher: 'Atria Books', url: '#', desc: 'Metodologjia PARA për organizimin sistematik të njohurive dixhitale.' },
      { type: 'book', title: 'How to Take Smart Notes', authors: 'Sönke Ahrens (2017)', publisher: 'CreateSpace', url: '#', desc: 'Metoda Zettelkasten e Niklas Luhmann — si të ndërtosh "rrjet mendimi".' },
      { type: 'book', title: 'Digital Minimalism', authors: 'Cal Newport (2019)', publisher: 'Portfolio/Penguin', url: '#', desc: 'Filozofia dhe metodologjia e konsumimit të qëllimshëm dixhital.' },
      { type: 'book', title: 'The Art of Thinking Clearly', authors: 'Rolf Dobelli (2013)', publisher: 'Harper', url: '#', desc: '99 gabime kognitive sistematike — si t\'i njohësh dhe shmangësh në vendimmarrje dhe filtrimin e informacionit.' },
      { type: 'book', title: 'Arti i të Menduarit Qartë (Shqip)', authors: 'Rolf Dobelli — botim shqip', publisher: 'Botim shqip i disponueshëm', url: '#', desc: 'Versioni shqip i librit të Dobelli-t mbi 99 gabimet kognitive — gjerësisht i disponueshëm në librari shqiptare.' },
      { type: 'book', title: 'The Information: A History, A Theory, A Flood', authors: 'James Gleick (2011)', publisher: 'Pantheon Books', url: '#', desc: 'Historia e plotë e informacionit si koncepte — nga alfabet te AI. Kontekst thelbësor për epokën dixhitale.' },
    ],
    progress: [
      { week: 'Dita 1', goal: 'Bëj Information Diet Audit. Fshi të gjitha burimet "C" tani.' },
      { week: 'Java 1', goal: 'Zbato SIFT çdo herë që lexon diçka. Bëje habit.' },
      { week: 'Java 2', goal: 'Instalo Obsidian. Krijo 10 nota atomike nga leximet javore.' },
      { week: 'Java 3', goal: 'Setup PARA: kategorizoji 50 notat ekzistuese në 4 kategori.' },
      { week: 'Muaji 2', goal: 'Rishiko "second brain": a po dalin lidhje spontane mes ideve?' },
    ],
  },

  motivation: {
    icon: '🔄', subtitle: 'Neuroshkenca e Zakoneve & Motivimit',
    title: 'Motivimi vjen e shkon — nuk ka sistem',
    color: '#6ee7b7', glow: 'rgba(16,185,129,0.3)',
    gradient: 'linear-gradient(135deg,#059669,#047857)',
    stats: [
      { value: '66 ditë', label: 'nevojiten mesatarisht (18–254 ditë) për të formuar zakon të ri', src: 'Lally et al., UCL European Journal of Social Psychology 2010' },
      { value: '40%', label: 'e sjelljes sonë ditore janë zakone automatike — jo vendime të ndërgjegjshme', src: 'Neal, Wood & Quinn, 2006' },
    ],
    explanation: {
      headline: 'Motivimi është emocion i përkohshëm — zakoni është sistem neurologjik',
      body: 'Neuroshkenca moderne është e qartë: mbështetja tek motivimi (gjendje emocionale kalimtare) për të bërë gjëra të rëndësishme çon drejt dështimit të parashikueshëm. Self-Determination Theory (Deci & Ryan, 1985) tregon se motivimi i qëndrueshëm rrjedh nga autonomia, kompetenca dhe qëllimi i brendshëm — jo nga presioni i jashtëm apo "inspiration."',
      concepts: [
        { icon: '🎯', name: 'Self-Determination Theory', desc: 'Motivimi i vërtetë dhe i qëndrueshëm buron nga 3 nevoja psikologjike bazë: Autonomia (zgjedhje e lirë), Kompetenca (rritje e aftësive), Relatedness (lidhje me të tjerë). Pa to, motivimi i jashtëm shterrë.', source: 'Deci, E.L. & Ryan, R.M. (1985). Intrinsic Motivation and Self-Determination in Human Behavior. Plenum Press.' },
        { icon: '🔁', name: 'Habit Loop (Duhigg)', desc: 'Çdo zakon ka 3 faza neurologjike: Cue (stimulus trigger) → Routine (sjellja automatike) → Reward (shpërblimi neuronal). Pas repeticionit, truri automatizon sekuencën si "chunk" të vetme.', source: 'Duhigg, C. (2012). The Power of Habit: Why We Do What We Do in Life and Business. Random House.' },
        { icon: '📐', name: 'Fogg Behavior Model', desc: 'Sjellja = f(Motivimi, Aftësia, Trigger). Nëse motivimi është i ulët, kompenso duke e bërë zakonin shumë të vogël (Tiny Habits). Kurrë mos prit motivim të lartë — bëje lehtë.', source: 'Fogg, B.J. (2009). A Behavior Model for Persuasive Design. Persuasive Technology Conference, ACM.' },
        { icon: '⚡', name: 'Dopamine & Anticipation', desc: 'Dopamina nuk lëshohet kur merr shpërblimin — lëshohet kur e anticipon. Sistemi i shpërblimeve të parashikueshme dhe i progresit të dukshëm ndërton zakonet e qëndrueshme neurologjike.', source: 'Schultz, W. (1997). A Neural Substrate of Prediction and Reward. Science, 275(5306), 1593–1599.' },
      ],
    },
    techniques: [
      { name: 'Tiny Habits (BJ Fogg)', difficulty: 'E lehtë', difficulty_color: '#34d399', time: '2 min fillim', desc: 'Zakonet e reja duhet të fillojnë aq të vogla sa të jenë "të pamundura të dështojnë." BJ Fogg (Direktori i Stanford Behavior Design Lab) e ka validuar me mbi 40,000 pjesëmarrës.', steps: ['Zgjidh zakonin e dëshiruar (p.sh. ushtrim)', 'Shkurto atë në minimum absolut (p.sh. 2 shtytje dyke)', 'Lidheja pas zakonit ekzistues: "Pasi bëj X, do bëj Y"', '"After I [ZAKON EKZISTUES], I will [ZAKON I RI]"', 'Festo menjëherë — "Yes! Excellent!" krijon lidhje neurale pozitive'], science: 'Fogg, B.J. (2019). Tiny Habits: The Small Changes That Change Everything. Houghton Mifflin Harcourt.' },
      { name: 'Identity-Based Habits', difficulty: 'E mesme', difficulty_color: '#fbbf24', time: 'Ndryshim perspektive', desc: '"Mos thuaj \'po përpiqem të mos pi duhan\' — thuaj \'nuk jam duhanpirës\'." Ndryshimi i identitetit (jo qëllimit) ndryshon sjelljen automatikisht. James Clear e dokumenton me neuroshkencën e self-concept.', steps: ['Identifiko identitetin e dëshiruar: "Jam person që..."', 'Çdo veprim i vogël = votë për identitetin e ri', '"Çfarë do të bënte ky person tani?" — pyetja kyçe', 'Shmang exceptions të hershme (erodon identitetin e ri)', 'Festoji proovat minimale — konfirmojnë identitetin'], science: 'Clear, J. (2018). Atomic Habits: An Easy & Proven Way to Build Good Habits. Avery Publishing Group.' },
      { name: 'Implementation Intentions', difficulty: 'E lehtë', difficulty_color: '#34d399', time: '5 min planifikim', desc: 'Meta-analiza e 94 studimeve (Gollwitzer & Sheeran, 2006) tregoi se njerëzit kanë 2–3× më shumë gjasa të arrijnë qëllimet kur specifikojnë kur-ku-si do ta bëjnë — jo vetëm çfarë.', steps: ['"Kur [SITUATA X], unë do [SJELLJA Y] në [VENDI Z]"', 'Shembull: "Çdo mëngjes pas kafes, do lexoj 10 faqe"', 'Bëje sa më specifik me orë, vend dhe veprim', 'Shkruaje fizikisht — mos e mbaj vetëm mentalisht', 'Shto "If-Then" për pengesat: "Nëse nuk arrij, atëherë..."'], science: 'Gollwitzer, P.M. & Sheeran, P. (2006). Implementation Intentions and Goal Achievement. Advances in Experimental Social Psychology, 38.' },
      { name: 'Don\'t Break the Chain', difficulty: 'E lehtë', difficulty_color: '#34d399', time: 'Çdo ditë', desc: 'Jerry Seinfeld vendoste X të kuqe në kalendarë çdo ditë që shkruante. Motivimi bëhet vizual dhe i prekshëm. Psikologjia e "loss aversion" (Kahneman) shpjegon pse ky sistem funksionon biologjikisht.', steps: ['Vendos 1 qëllim ditor shumë specifik dhe minimal', 'Varo kalendarë fizik ose përdor app (Streaks, Habitica)', 'Vendos markë të kuqe çdo ditë që qëllimi arrihet', 'Rregulli kryesor: "Mos e prish zinxhirin"', 'Nëse prish: Rregulli "asnjëherë dy herë rresht" (Clear)'], science: 'Ariely & Wertenbroch (2002). Procrastination, Deadlines, and Performance. Psychological Science, 13(3).' },
    ],
    exercises: [
      { title: 'Habit Audit (45 min)', icon: '🔍', duration: '45 min', steps: ['Listo të gjitha zakonet ditore nga zgjimi deri te gjumi (detaje)', 'Kategorizoji: + (pozitive), – (negative), 0 (neutrale/automatike)', 'Identifiko: Cili Cue aktivizon çdo zakon negativ?', 'Zgjidh 1 zakon negativ: Ndrysho Rutinën, mos lufto Cue-n', 'Zgjidh 1 zakon të ri të vogël: Apliko Tiny Habits (2 min fillim)', 'Vendos sistem matjeje vizuale (kalendarë fizik ose app)'], outcome: 'Ky audit zbulon se 80% e zakoneve negative ndajnë të njëjtin tip Cue — insight transformues.' },
      { title: 'Identity Redesign Exercise', icon: '🪞', duration: '30 min', steps: ['Shkruaj: "Personi që dua të jem pas 1 viti ka këto cilësi..."', 'Listo 5 karakteristika të personit të dëshiruar', 'Për çdo karakteristikë: "Çfarë bën çdo ditë ky person?"', 'Zgjidh 1 veprim minimal (2 min) që konfirmon identitetin', 'Bëje atë veprim sot — vetëm 2 minuta, pa presion', 'Thuaj me zë: "Unë jam personi që [X]" — konfirmo identitetin'], outcome: 'Clear dokumenton se 2–3 muaj votash të qëndrueshme ndërtojnë dhe konsolidojnë identitetin e ri.' },
    ],
    resources: [
      { type: 'paper', title: 'How are habits formed? Modelling habit formation in the real world', authors: 'Lally et al. (2010)', journal: 'European Journal of Social Psychology, 40(6), 998–1009', url: 'https://onlinelibrary.wiley.com/doi/abs/10.1002/ejsp.674', desc: 'Studimi i UCL: 66 ditë mesatare (18–254) për formimin e zakoneve.' },
      { type: 'paper', title: 'Implementation Intentions: Strong Effects of Simple Plans', authors: 'Gollwitzer & Sheeran (2006)', journal: 'Advances in Experimental Social Psychology, 38', url: 'https://www.sciencedirect.com/science/article/pii/S0065260106380021', desc: 'Meta-analiza 94 studimeve: 2–3× rritje e arritjes së qëllimeve.' },
      { type: 'book', title: 'Atomic Habits', authors: 'James Clear (2018)', publisher: 'Avery Publishing Group', url: '#', desc: 'Libri bazë mbi habit formation me neuroshkencë — 15M kopje të shitura.' },
      { type: 'book', title: 'Tiny Habits', authors: 'BJ Fogg (2019)', publisher: 'Houghton Mifflin Harcourt', url: '#', desc: 'Stanford Behavior Design Lab: zakonet minimale si baza e ndryshimit.' },
      { type: 'book', title: 'The Power of Habit', authors: 'Charles Duhigg (2012)', publisher: 'Random House', url: '#', desc: 'Shpjegimi i plotë shkencor i habit loop — Cue, Routine, Reward — dhe si e ndryshon çdo zakon.' },
      { type: 'book', title: 'Fuqia e Zakonit (Shqip)', authors: 'Charles Duhigg — botim shqip', publisher: 'Botim shqip i disponueshëm', url: '#', desc: '"The Power of Habit" i përkthyer në shqip — libri mbi zakonet më i shitur në gjuhën shqipe.' },
      { type: 'book', title: 'Zakonet Atomike (Shqip)', authors: 'James Clear — botim shqip', publisher: 'Botim shqip i disponueshëm', url: '#', desc: '"Atomic Habits" në shqip — i disponueshëm gjerësisht në librari shqiptare dhe online.' },
      { type: 'book', title: 'The Willpower Instinct', authors: 'Kelly McGonigal (2011)', publisher: 'Avery', url: '#', desc: 'Kursi i Stanford mbi vetëkontrollin — neuroshkenca e vullnetit dhe si ta forcosh sistematikisht.' },
    ],
    progress: [
      { week: 'Dita 1', goal: 'Bëj Habit Audit. Identifiko 1 zakon të ri shumë të vogël (2 min).' },
      { week: 'Java 1', goal: 'Zbato Tiny Habits: bëje çdo ditë pa hezitim. Mos dështo.' },
      { week: 'Java 2', goal: 'Shkruaj Implementation Intention me orë dhe vend specifik.' },
      { week: 'Java 3', goal: 'Fillo zinxhirin vizual — kalendarë fizik ose Streaks app.' },
      { week: 'Muaji 2', goal: 'Evaluo streak-un: A ka ndryshuar ndjesia e identitetit?' },
    ],
  },
}

/* ─── SUB-COMPONENTS ─────────────────────────────────────────────────────── */
function ExplanationTab({ data, color }) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl p-5"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <h3 className="font-black text-white text-base mb-3">{data.headline}</h3>
        <p className="text-white/60 text-sm leading-relaxed">{data.body}</p>
      </div>
      <p className="text-[11px] font-bold uppercase tracking-widest text-white/30 px-1">Konceptet kryesore shkencore</p>
      {data.concepts.map((c, i) => (
        <div key={i} className="flex gap-4 p-4 rounded-2xl transition-colors"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="text-2xl shrink-0 mt-0.5">{c.icon}</span>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-white text-sm mb-1">{c.name}</p>
            <p className="text-white/55 text-xs leading-relaxed mb-2">{c.desc}</p>
            <p className="text-[10px] font-mono leading-snug" style={{ color: color + 'bb' }}>📄 {c.source}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function TechniquesTab({ data, color, gradient }) {
  const [expanded, setExpanded] = useState(null)
  return (
    <div className="space-y-3">
      {data.map((t, i) => (
        <div key={i} className="rounded-2xl overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <button className="w-full flex items-center gap-3 p-4 text-left"
            onClick={() => setExpanded(expanded === i ? null : i)}>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <p className="font-black text-white text-sm">{t.name}</p>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0"
                  style={{ background: t.difficulty_color + '22', color: t.difficulty_color }}>
                  {t.difficulty}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-[10px] text-white/35">
                  <Clock size={9}/> {t.time}
                </span>
                <span className="text-[10px] font-mono text-white/20 truncate hidden sm:block">{t.science.split('(')[0].trim()}</span>
              </div>
            </div>
            <ChevronRight size={15} className="text-white/30 shrink-0 transition-transform duration-200"
              style={{ transform: expanded === i ? 'rotate(90deg)' : 'none' }}/>
          </button>
          {expanded === i && (
            <div className="px-4 pb-4 space-y-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              <p className="text-white/60 text-xs leading-relaxed pt-3">{t.desc}</p>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-2">Hapat e zbatimit</p>
                <ol className="space-y-2">
                  {t.steps.map((step, si) => (
                    <li key={si} className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5"
                        style={{ background: gradient, color: 'white' }}>{si + 1}</span>
                      <span className="text-white/65 text-xs leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="rounded-xl px-3 py-2.5" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <p className="text-[10px] font-mono leading-snug" style={{ color: color + 'bb' }}>🔬 {t.science}</p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function ExercisesTab({ data, color }) {
  const [checked, setChecked] = useState({})
  const toggle = (id) => setChecked(p => ({ ...p, [id]: !p[id] }))
  return (
    <div className="space-y-5">
      {data.map((ex, i) => (
        <div key={i} className="rounded-2xl overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-3 px-5 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
            <span className="text-2xl">{ex.icon}</span>
            <div>
              <p className="font-black text-white text-sm">{ex.title}</p>
              <p className="text-white/40 text-[10px] flex items-center gap-1 mt-0.5"><Clock size={9}/> {ex.duration}</p>
            </div>
          </div>
          <div className="p-5 space-y-2.5">
            {ex.steps.map((step, si) => {
              const k = `${i}-${si}`
              const done = !!checked[k]
              return (
                <button key={si} onClick={() => toggle(k)}
                  className="w-full flex items-start gap-3 text-left group transition-all"
                  style={{ opacity: done ? 0.45 : 1 }}>
                  <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all"
                    style={{ background: done ? color : 'transparent', borderColor: done ? color : 'rgba(255,255,255,0.2)' }}>
                    {done && <CheckCircle size={10} color="white" strokeWidth={3}/>}
                  </div>
                  <span className={`text-xs leading-relaxed ${done ? 'line-through text-white/25' : 'text-white/65'}`}>{step}</span>
                </button>
              )
            })}
          </div>
          <div className="px-5 pb-5">
            <div className="rounded-xl px-4 py-3" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <p className="text-[11px] text-white/55 leading-snug">
                <span className="font-bold text-white/80">Rezultati: </span>{ex.outcome}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function ResourcesTab({ data, color }) {
  const groups = [
    { type: 'paper', label: 'Studime Shkencore (Peer-Reviewed)', Icon: FileText },
    { type: 'book',  label: 'Libra të Rekomanduar', Icon: BookOpen },
    { type: 'video', label: 'Video Edukative', Icon: Play },
  ]
  return (
    <div className="space-y-5">
      {groups.map(({ type, label, Icon }) => {
        const items = data.filter(r => r.type === type)
        if (!items.length) return null
        return (
          <div key={type}>
            <div className="flex items-center gap-2 mb-2.5">
              <Icon size={12} style={{ color }}/>
              <p className="text-[11px] font-bold uppercase tracking-widest text-white/40">{label}</p>
            </div>
            <div className="space-y-2">
              {items.map((r, i) => (
                <a key={i} href={r.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-start gap-3 p-4 rounded-2xl transition-all group block"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: color + '20' }}>
                    <Icon size={13} style={{ color }}/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white text-xs leading-snug">{r.title}</p>
                    <p className="text-white/40 text-[10px] mt-0.5">{r.authors || ''}</p>
                    {r.journal && <p className="text-[10px] font-mono mt-0.5" style={{ color: color + '80' }}>{r.journal}</p>}
                    <p className="text-white/50 text-[10px] mt-1 leading-snug">{r.desc}</p>
                  </div>
                  <ExternalLink size={11} className="text-white/20 group-hover:text-white/50 transition-colors shrink-0 mt-1"/>
                </a>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function ProgressTab({ data, color, gradient }) {
  return (
    <div className="space-y-3">
      <div className="rounded-2xl p-4"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <p className="text-white/55 text-xs leading-relaxed">
          Ky plan progresioni është ndërtuar bazuar në kornizat shkencore të habit formation. Ec me ritmin tënd — qëndrueshmëria (jo shpejtësia) është çelësi i ndryshimit të qëndrueshëm.
        </p>
      </div>
      <div className="relative space-y-3 pl-8 mt-2">
        <div className="absolute left-3 top-2 bottom-2 w-px"
          style={{ background: `linear-gradient(to bottom, ${color}70, transparent)` }}/>
        {data.map((m, i) => (
          <div key={i} className="relative">
            <div className="absolute -left-5 top-4 w-3 h-3 rounded-full border-2"
              style={{ background: i === 0 ? color : 'rgba(255,255,255,0.08)', borderColor: i === 0 ? color : 'rgba(255,255,255,0.15)' }}/>
            <div className="p-4 rounded-2xl"
              style={{
                background: i === 0 ? color + '12' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${i === 0 ? color + '35' : 'rgba(255,255,255,0.06)'}`,
              }}>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1"
                style={{ color: i === 0 ? color : 'rgba(255,255,255,0.3)' }}>{m.week}</p>
              <p className="text-white/70 text-xs leading-relaxed">{m.goal}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── MAIN MODAL ─────────────────────────────────────────────────────────── */
export default function ProblemModal({ problemKey, onClose }) {
  const [tab, setTab] = useState(0)
  const data = PROBLEMS_DATA[problemKey]

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const fn = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', fn)
    }
  }, [onClose])

  if (!data) return null

  return (
    <div
      className="fixed inset-0 z-[250] flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(16px)' }}
      onClick={onClose}>

      <div
        className="w-full sm:max-w-3xl max-h-[95vh] sm:max-h-[88vh] flex flex-col rounded-t-3xl sm:rounded-3xl overflow-hidden"
        style={{
          background: 'linear-gradient(160deg,#0d0520 0%,#130a35 100%)',
          border: '1px solid rgba(255,255,255,0.09)',
          boxShadow: `0 0 0 1px rgba(255,255,255,0.04), 0 40px 100px rgba(0,0,0,0.7), 0 0 120px ${data.glow}`,
          animation: 'slide-up-in 0.38s cubic-bezier(0.34,1.56,0.64,1) both',
        }}
        onClick={e => e.stopPropagation()}>

        {/* ── Header ── */}
        <div className="shrink-0 px-5 pt-5 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          {/* Drag handle for mobile */}
          <div className="w-10 h-1 rounded-full bg-white/15 mx-auto mb-4 sm:hidden"/>
          <div className="flex items-start gap-4">
            <div className="w-13 h-13 w-[52px] h-[52px] rounded-2xl flex items-center justify-center text-2xl shrink-0"
              style={{ background: data.gradient, boxShadow: `0 8px 28px ${data.glow}` }}>
              {data.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: data.color }}>{data.subtitle}</p>
              <h2 className="text-white font-black text-base leading-snug pr-8">{data.title}</h2>
            </div>
            <button onClick={onClose}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all shrink-0"
              style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
              <X size={15}/>
            </button>
          </div>

          {/* Stats */}
          <div className="flex gap-2.5 mt-4">
            {data.stats.map((s, i) => (
              <div key={i} className="flex-1 rounded-2xl px-3.5 py-3"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="font-black text-lg leading-tight" style={{ color: data.color }}>{s.value}</p>
                <p className="text-white/50 text-[10px] leading-snug mt-0.5">{s.label}</p>
                <p className="text-white/22 text-[9px] mt-1 font-mono">src: {s.src}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="shrink-0 flex gap-0.5 px-3 pt-2.5 pb-2 overflow-x-auto"
          style={{ scrollbarWidth: 'none', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          {TABS.map((t, i) => {
            const TI = t.Icon
            return (
              <button key={i} onClick={() => setTab(i)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold transition-all whitespace-nowrap"
                style={{
                  background: tab === i ? data.gradient : 'transparent',
                  color: tab === i ? 'white' : 'rgba(255,255,255,0.38)',
                }}>
                <TI size={11}/>{t.label}
              </button>
            )
          })}
        </div>

        {/* ── Content ── */}
        <div className="flex-1 overflow-y-auto p-5">
          {tab === 0 && <ExplanationTab data={data.explanation} color={data.color}/>}
          {tab === 1 && <TechniquesTab  data={data.techniques}  color={data.color} gradient={data.gradient}/>}
          {tab === 2 && <ExercisesTab   data={data.exercises}   color={data.color}/>}
          {tab === 3 && <ResourcesTab   data={data.resources}   color={data.color}/>}
          {tab === 4 && <ProgressTab    data={data.progress}    color={data.color} gradient={data.gradient}/>}
        </div>
      </div>
    </div>
  )
}
