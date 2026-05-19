export const DAILY_TIPS = [
  { id: 1, title: 'Rregulli 5-4-3-2-1',      text: 'Emërto 5 gjëra që sheh, 4 që ndien, 3 zëra, 2 aroma, 1 shije. Grounding i shpejtë.',            tag: 'Ankth'      },
  { id: 2, title: 'Frymëmarrja 4-7-8',        text: 'Merr frymë 4 sekonda, mbaj 7, nxirr 8. Aktivizon sistemin parasimptetik brenda 90 sekondave.', tag: 'Qetësi'     },
  { id: 3, title: 'Shënoje një mendim',        text: 'Shkruaj mendimin anxiozues pa gjykum. Jashtëzakonisht efektiv për të reduktuar intensitetin.', tag: 'CBT'         },
  { id: 4, title: 'Lëvizja 2-minutëshe',       text: 'Dy minuta lëvizje (eci, kërce, stret) çliron endorfina dhe ndërpret ciklin e stresit.',         tag: 'Stres'      },
  { id: 5, title: 'Kufizimi i ekranit',        text: 'Lëri telefonin 30 min para gjumit. Melantonina fillon të funksionojë normalisht.',               tag: 'Gjumë'      },
  { id: 6, title: 'Falenderimi 3-gjëra',       text: 'Shkruaj 3 gjëra të vogla pozitive nga dita. Ricalibrzon trurin drejt pozitivitetit.',            tag: 'Mirënjohje' },
]

export const TECHNIQUES = [
  {
    id: 'anx-breath', category: 'anxiety',
    title: 'Box Breathing', emoji: '🌬️', duration: '4 min',
    description: 'Teknikë e përdorur nga Navy SEALs për kontrollin e ankthit në situata presioni të lartë.',
    steps: ['Merr frymë 4 sek', 'Mbaj 4 sek', 'Nxirr 4 sek', 'Mbaj 4 sek', 'Përsërit 4 herë'],
  },
  {
    id: 'anx-grounding', category: 'anxiety',
    title: '5-4-3-2-1 Grounding', emoji: '🌿', duration: '3 min',
    description: 'Teknika e grounding-ut çon vëmendjen tek e tashmja, duke ndërprerë spiralen e ankthit.',
    steps: ['5 gjëra që sheh', '4 gjëra që prek', '3 zëra që dëgjon', '2 aroma', '1 shije'],
  },
  {
    id: 'str-pmr', category: 'stress',
    title: 'PMR – Relaksim Progresiv', emoji: '💆', duration: '8 min',
    description: 'Tensiono dhe relakso grupe muskulore systematikisht për të çliruar stresin fizik.',
    steps: ['Shtrire i qetë', 'Tërhiq grushtat 5 sek', 'Lëro papritur', 'Vazhdo me krahët', 'Zbriti deri tek këmbët'],
  },
  {
    id: 'str-cold', category: 'stress',
    title: 'Efekti i Ujit të Ftohtë', emoji: '🧊', duration: '2 min',
    description: 'Shpëlaja fytyrën me ujë të ftohtë aktivizon refleksin e zhytjes dhe ngadalëson zemrën.',
    steps: ['Mbush lavamanen me ujë të ftohtë', 'Zhyti fytyrën 15-30 sek', 'Mbaj frymën', 'Nxirr ngadalë', 'Përsërit 2 herë'],
  },
  {
    id: 'ot-defusion', category: 'overthinking',
    title: 'ACT Defusion', emoji: '🧠', duration: '5 min',
    description: 'Vëzhgo mendimin si një zë i jashtëm, jo si realitet. Çlironë nga identifikimi me mendjet.',
    steps: ['Identifiko mendimin', 'Thuaj: "Kam mendimin se..."', 'Imagjino si re kalimtare', 'Lëre të kalojë', 'Kthehu tek frymëmarrja'],
  },
  {
    id: 'conf-affirmation', category: 'confidence',
    title: 'Afirmime CBT', emoji: '⭐', duration: '3 min',
    description: 'Afirmimet e bazuara në CBT ricalibrrojnë besimet negative automatike (ANTs).',
    steps: ['Identifiko besimin negativ', 'Gjej evidence kundër tij', 'Formulo afirmimin alternativ', 'Thuaje me zë', 'Shkruaje'],
  },
]

export const BLOG_ARTICLES = [
  {
    id: 1,
    title:    'Çfarë ndodh në tru gjatë ankthit?',
    subtitle: 'Neuroshkenca e frikës dhe si ta menaxhosh atë',
    category: 'Neuroshkencë',
    readTime: '5 min',
    emoji:    '🧠',
    color:    'from-purple-500 to-indigo-500',
    content: [
      { type: 'p', text: 'Amigdala, strukturë e vogël në formë bajameje brenda trurit, është "alarmi" i sistemit tënd. Kur ndjen rrezik — real apo i imagjinuar — ajo aktivizohet brenda 12 milisekondave.' },
      { type: 'exercise', title: 'Ushtrim: Identifiko aktivizimin', text: 'Mendoji herën e fundit që u ndjetë anksioze. Çfarë e aktivizoi amigdalën tënde?' },
      { type: 'p', text: 'Cortizoli dhe adrenalina fluturojnë në gjakun tënd, duke i "hijackuar" korteksin prefrontal — pjesën e trurit që mendon racionalisht. Kjo është arsyeja pse ankthi të bën të mendosh irracionalile.' },
    ],
    interactive: true,
  },
  {
    id: 2,
    title:    'CBT: Ndryshimi i mendimeve negative',
    subtitle: 'Si funksionon terapia kognitive-sjelluese',
    category: 'Terapia',
    readTime: '7 min',
    emoji:    '💭',
    color:    'from-blue-500 to-cyan-500',
    content: [
      { type: 'p', text: 'Terapia Kognitive-Sjelluese (CBT) bazohet në idenë se mendimet, emocionet dhe sjellja janë të ndërlidhura. Duke ndryshuar mendimet, ndryshon emocionet.' },
      { type: 'exercise', title: 'Ushtrim: Sfida e mendimit', text: 'Shkruaj një mendim negativ. Pastaj gjej 3 prova kundër tij. Si ndihet tani?' },
    ],
    interactive: true,
  },
  {
    id: 3,
    title:    'Gjumi dhe shëndeti mendor',
    subtitle: 'Lidhja e pazëshme mes gjumit dhe emocioneve',
    category: 'Gjumë',
    readTime: '6 min',
    emoji:    '🌙',
    color:    'from-indigo-500 to-purple-500',
    content: [
      { type: 'p', text: 'Studimet tregojnë se 6 orë gjumë rrit reaksionin emocional negativ me 60% krahasuar me 8 orë. Truri pa gjumë të mjaftueshëm është truri anxioz.' },
      { type: 'exercise', title: 'Ushtrim: Rutina e gjumit', text: 'Cakto një orë gjumi fikse për 7 ditë. Çfarë vëren pas javës?' },
    ],
    interactive: true,
  },
  {
    id: 4,
    title:    'Mindfulness për fillestarë',
    subtitle: '8 javë program i provuar shkencërisht',
    category: 'Mindfulness',
    readTime: '4 min',
    emoji:    '🧘',
    color:    'from-green-500 to-teal-500',
    content: [
      { type: 'p', text: 'MBSR (Mindfulness-Based Stress Reduction) reduktoi stresin me 40% në studime klinike. Por mindfulness nuk do të thotë "mos mendon" — do të thotë vëzhgo pa gjykum.' },
      { type: 'exercise', title: 'Ushtrim: 1 minutë mindfulness', text: 'Mbyll sytë. Fokusohu tek frymëmarrja tënde për 60 sekonda. Mos lufto mendimet — vetëm vëzhgoji.' },
    ],
    interactive: true,
  },
]

export const CHAT_ROOMS = [
  { id: 'anxiety',    name: 'Ankth & Frika',     emoji: '😰', members: 234, description: 'Hapësirë e sigurt për ata që luftojnë me ankthit', active: true  },
  { id: 'school',     name: 'Shkollë & Presion',  emoji: '📚', members: 189, description: 'Stres akademik, ekzaminime, pritshmëri',          active: true  },
  { id: 'confidence', name: 'Vetëbesim',          emoji: '⭐', members: 156, description: 'Rritja e vetëbesimit dhe vetëvlerësimit',          active: false },
  { id: 'sleep',      name: 'Gjumë & Lodhje',     emoji: '🌙', members: 98,  description: 'Insomnia, lodhje kronike, ritmet e gjumit',       active: false },
  { id: 'grief',      name: 'Humbja & Zi',        emoji: '🕊️', members: 67,  description: 'Procesimi i humbjes dhe trishtimit',              active: false },
]

export const ROOM_MESSAGES = {
  anxiety: [],
}

export const AI_INITIAL_MESSAGES = [
  {
    id:   1,
    from: 'ai',
    text: 'Mirëdita! Jam NeuroAI, shoqëruesi yt për mirëqenien mendore. 🧠\n\nJam këtu me ty — pa gjykime, me vëmendje të plotë.\n\nSi ndihesh sot?',
    time: new Date().toLocaleTimeString('sq-AL', { hour: '2-digit', minute: '2-digit' }),
  },
]

export const QUICK_REPLIES = [
  'Jam pak anxioz sot',
  'Nuk mund të fle',
  'Ndihem i trishtë',
  'Dua teknikë relaksimi',
  'Dua të flasim',
]

export const AI_RESPONSES = {
  anxious: [
    'Kuptoj plotësisht. Ankthi mund të ndihet si një valë e madhe. 🌊\n\nDo të bëjmë bashkë teknikën e box breathing:\n▸ Merr frymë: 4 sekonda\n▸ Mbaj: 4 sekonda\n▸ Nxirr: 4 sekonda\n▸ Mbaj: 4 sekonda\n\nFillo tani. Jam me ty.',
    'Faleminderit që ma tregove. Çfarë mendon se e shkaktoi ankthin sot?',
  ],
  sleep: [
    'Gjumi i vështirësuar mund të lidhet me mendime anxiozuese. 🌙\n\nDisa gjëra që ndihmojnë:\n▸ Ekrani OFF 30 min para gjumit\n▸ Teknika 4-7-8 (frymëmarrja)\n▸ Shkruaj mendimet para se të flesh\n\nCilës do t\'i probosh sonte?',
  ],
  sad: [
    'Trishtimi është një emocion i vlefshëm, jo dobësi. 💙\n\nA dëshiron të flasim për çfarë ndodhi, apo preferon të provosh diçka praktike?',
  ],
  default: [
    'Jam këtu dhe dëgjoj. 💜\n\nMë trego më shumë — çfarë po kalon?',
    'Faleminderit që e ndave me mua. Çfarë ndie tani, fizikisht dhe emocionalisht?',
  ],
}
