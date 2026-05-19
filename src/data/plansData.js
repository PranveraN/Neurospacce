// ─── Plan definitions ──────────────────────────────────────────────────────
export const PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    nameSq: 'Falas',
    price: 0,
    currency: 'EUR',
    period: 'muaj',
    color: '#64748b',
    gradient: 'linear-gradient(135deg, #64748b, #475569)',
    badge: null,
    tagline: 'Fillo pa pagesë — gjithçka bazë e lirë',
    description: 'Të gjitha mjetet e mirëqenies mendore — falas gjithmonë. Pa kartelë kreditore.',
    cta: 'Fillo falas',
    limits: {
      aiMessagesPerDay:      Infinity,
      journalEntries:        Infinity,
      techniques:            Infinity,
      communityPosts:        true,
      moodTracking:          true,
      moodExport:            true,
      voiceInput:            false,
      privateQuestions:      0,        // psych questions = premium only
      miniSessions:          0,        // online sessions = premium only
      bookingAccess:         false,    // booking = premium only
      priorityQueue:         false,
      advancedAnalytics:     true,
      personalizedReports:   true,
      personaMatrixPremium:  true,
      evolutionDashboard:    true,
    },
    features: [
      { label: 'AI Companion pa limit (NeuroAI)',               included: true  },
      { label: 'Gjurmim humori çdo ditë + analitikë',           included: true  },
      { label: 'Journal pa limit + AI analizë',                 included: true  },
      { label: 'Të gjitha teknikat mindfulness & frymëmarrje',  included: true  },
      { label: 'Evolution Dashboard + AI Coach ditor',          included: true  },
      { label: 'PersonaMatrix + raport i plotë',                included: true  },
      { label: 'Të gjitha testet psikologjike',                 included: true  },
      { label: 'Komunitet + artikuj të shëndetit mendor',       included: true  },
      { label: 'Burime emergjence & krizë',                     included: true  },
      { label: 'Konsultime private me psikolog',                included: false },
      { label: 'Sesione online (15 min) me psikolog',           included: false },
      { label: 'Rezervim takimesh me psikolog',                 included: false },
    ],
  },

  pro: {
    id: 'pro',
    name: 'Pro',
    nameSq: 'Pro',
    price: 9.99,
    currency: 'EUR',
    period: 'muaj',
    color: '#7c3aed',
    gradient: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
    badge: 'Rekomanduar',
    tagline: 'Akses te psikologë të verifikuar',
    description: 'Gjithçka falas + konsultime private dhe sesione online me psikologë klinikë.',
    cta: 'Fillo Pro',
    limits: {
      aiMessagesPerDay:      Infinity,
      journalEntries:        Infinity,
      techniques:            Infinity,
      communityPosts:        true,
      moodTracking:          true,
      moodExport:            true,
      voiceInput:            false,
      privateQuestions:      15,       // 15 pyetje private / muaj
      miniSessions:          2,        // 2 sesione 15-min / muaj
      bookingAccess:         true,
      priorityQueue:         true,     // përgjigje <24h
      advancedAnalytics:     true,
      personalizedReports:   true,
      personaMatrixPremium:  true,
      evolutionDashboard:    true,
    },
    features: [
      { label: 'Gjithçka nga plani Free',                              included: true },
      { label: '15 pyetje private / muaj (deri 3/ditë)',               included: true },
      { label: '2 sesione online 15-min me psikolog / muaj',           included: true },
      { label: 'Rezervim takimesh me psikolog',                        included: true },
      { label: 'Përgjigje brenda 24 orësh (radhë prioritare)',         included: true },
    ],
  },

  premium: {
    id: 'premium',
    name: 'Premium',
    nameSq: 'Premium',
    price: 19.99,
    currency: 'EUR',
    period: 'muaj',
    color: '#d97706',
    gradient: 'linear-gradient(135deg, #d97706, #b45309)',
    badge: 'Intensive',
    tagline: 'Mbështetje e plotë psikologjike',
    description: 'Për ata që kanë nevojë për mbështetje intensive — pyetje pa limit + sesione më të shumta.',
    cta: 'Fillo Premium',
    limits: {
      aiMessagesPerDay:      Infinity,
      journalEntries:        Infinity,
      techniques:            Infinity,
      communityPosts:        true,
      moodTracking:          true,
      moodExport:            true,
      voiceInput:            true,
      privateQuestions:      Infinity,
      miniSessions:          5,        // 5 sesione 15-min / muaj
      bookingAccess:         true,
      priorityQueue:         true,     // garanci <12h
      advancedAnalytics:     true,
      personalizedReports:   true,
      personaMatrixPremium:  true,
      evolutionDashboard:    true,
    },
    features: [
      { label: 'Gjithçka nga Pro',                                     included: true },
      { label: 'Pyetje private pa limit te psikologu',                 included: true },
      { label: '5 sesione online 15-min / muaj',                       included: true },
      { label: 'Garanci përgjigje brenda 12 orësh',                    included: true },
      { label: 'Input me zë (AI)',                                      included: true },
    ],
  },

  admin: {
    id: 'admin',
    name: 'Admin',
    price: 0,
    color: '#dc2626',
    gradient: 'linear-gradient(135deg, #dc2626, #b91c1c)',
    badge: null,
    description: 'Akses administrativ i plotë.',
    cta: '',
    limits: {
      aiMessagesPerDay:      Infinity,
      journalEntries:        Infinity,
      techniques:            Infinity,
      communityPosts:        true,
      moodTracking:          true,
      moodExport:            true,
      voiceInput:            true,
      privateQuestions:      Infinity,
      miniSessions:          Infinity,
      bookingAccess:         true,
      priorityQueue:         true,
      advancedAnalytics:     true,
      personalizedReports:   true,
      personaMatrixPremium:  true,
      evolutionDashboard:    true,
    },
    features: [],
  },
}

// ─── Feature access matrix ─────────────────────────────────────────────────
// Premium-only = psychologist consultations & online sessions ONLY
export const FEATURES = {
  // AI Chat — free for all
  aiChat:             { free: true,  pro: true,  premium: true  },
  aiVoice:            { free: false, pro: false, premium: true  },

  // Mood — free for all
  moodTracking:       { free: true,  pro: true,  premium: true  },
  moodExport:         { free: true,  pro: true,  premium: true  },
  moodInsights:       { free: true,  pro: true,  premium: true  },

  // Tests — free for all
  testPersonality:    { free: true,  pro: true,  premium: true  },
  testMood:           { free: true,  pro: true,  premium: true  },
  testCognitive:      { free: true,  pro: true,  premium: true  },
  testIQ:             { free: true,  pro: true,  premium: true  },
  testPersonaMatrix:  { free: true,  pro: true,  premium: true  },
  testHistory:        { free: true,  pro: true,  premium: true  },
  personaMatrixPremiumReport: { free: true, pro: true, premium: true },

  // Journal — write is free, AI Reflect and full history are Pro+
  journalWrite:       { free: true,  pro: true,  premium: true  },
  journalAI:          { free: false, pro: true,  premium: true  },
  journalUnlimited:   { free: false, pro: true,  premium: true  },

  // Psychologist — PREMIUM ONLY (Pro+)
  askPsychologist:    { free: false, pro: true,  premium: true  },
  privateQuestions:   { free: false, pro: true,  premium: true  },
  miniSessions:       { free: false, pro: true,  premium: true  },
  bookAppointment:    { free: false, pro: true,  premium: true  },
  priorityBooking:    { free: false, pro: true,  premium: true  },

  // Community — free for all
  communityRead:      { free: true,  pro: true,  premium: true  },
  communityPost:      { free: true,  pro: true,  premium: true  },

  // Techniques — free for all
  techniquesBasic:    { free: true,  pro: true,  premium: true  },
  techniquesAll:      { free: true,  pro: true,  premium: true  },

  // Parenting — free for all
  parentingRead:      { free: true,  pro: true,  premium: true  },
  parentingAI:        { free: true,  pro: true,  premium: true  },

  // Blog / Articles — free for all
  blogRead:           { free: true,  pro: true,  premium: true  },

  // Analytics & Reports — free for all
  advancedAnalytics:  { free: true,  pro: true,  premium: true  },
  weeklyReports:      { free: true,  pro: true,  premium: true  },
  evolutionDashboard: { free: true,  pro: true,  premium: true  },
}

// ─── Upgrade prompt messages ───────────────────────────────────────────────
export const UPGRADE_MESSAGES = {
  bookAppointment: {
    title: 'Konsultimet janë pjesë e Pro',
    desc:  'Rezervo takim me psikolog të verifikuar — sesione 45-60 min. Disponueshme me planin Pro.',
    feature: 'Rezervim takimesh',
    tone: 'warm',
    cta: 'Zbulo Pro',
  },
  askPsychologist: {
    title: 'Konsultimet janë pjesë e Pro',
    desc:  'Dërgo pyetje private te psikologu dhe merr përgjigje brenda 24 orësh. Me Pro ke 15 pyetje/muaj.',
    feature: 'Pyetje private te psikologu',
    tone: 'warm',
  },
  privateQuestions: {
    title: 'Pyetjet private janë Pro',
    desc:  'Me Pro ke 15 pyetje private çdo muaj — deri 3 në ditë. Psikologu përgjigjet brenda 24 orësh.',
    feature: '15 pyetje/muaj · <24h',
    tone: 'warm',
  },
  miniSessions: {
    title: 'Sesionet online janë Pro',
    desc:  '2 sesione 15-minutëshe me psikolog çdo muaj — me video, konfidenciale, të sigurta.',
    feature: '2 sesione online/muaj',
    tone: 'warm',
  },
  aiVoice: {
    title: 'Inputi me zë — Premium',
    desc:  'Fol me asistentin AI — disponueshme me planin Premium.',
    feature: 'Zë + AI',
    tone: 'soft',
  },
  journalAI: {
    title: 'AI Reflect — Pro',
    desc:  'Zbulo emocionet, mendimet dhe merr sugjerime nga AI mbi shkrimin tënd. E disponueshme me planin Pro.',
    feature: 'AI Reflect i personalizuar',
    tone: 'warm',
    cta: 'Zbulo Pro',
  },
  journalUnlimited: {
    title: 'Histori e plotë — Pro',
    desc:  'Me planin Free shikon 5 hyrjet e fundit. Me Pro ke akses të plotë, AI Reflect, dhe eksport.',
    feature: 'Journal pa limit + AI',
    tone: 'warm',
    cta: 'Zbulo Pro',
  },
}
