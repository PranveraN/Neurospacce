// ─── IQ Test — NeuroSphera ─────────────────────────────────────────────────
export const IQ_TEST = {
  id:            'iq',
  title:         'Testi IQ',
  subtitle:      'Kuocienti i Inteligjencës',
  emoji:         '🧠',
  color:         '#4f46e5',
  gradient:      'linear-gradient(135deg, #4f46e5, #7c3aed)',
  softBg:        '#eef2ff',
  duration:      '8 min',
  questionCount: 20,
  time_limit_sec: 480,

  scoring_model: {
    base:              60,
    max:               160,
    accuracy_weight:   0.7,
    speed_weight:      0.3,
    difficulty_bonus:  true,
  },

  iq_classification: [
    {
      min: 130, max: 160,
      label: 'Shumë i Lartë',
      desc:  'Aftësi kognitive jashtëzakonisht të zhvilluara. Arsyetim i shpejtë, analizë thellë dhe zgjidhje krijuese problemesh.',
      color: '#7c3aed',
    },
    {
      min: 115, max: 129,
      label: 'Mbi Mesatar',
      desc:  'Inteligjencë mbi normën. Konceptet komplekse kuptohen me lehtësi dhe arsyetohet me saktësi e shpejtësi.',
      color: '#2563eb',
    },
    {
      min: 85, max: 114,
      label: 'Mesatar',
      desc:  'Nivel tipik i inteligjencës. Shumica e njerëzve (68%) bien në këtë interval. Aftësi të mira për zgjidhjen e problemeve.',
      color: '#059669',
    },
    {
      min: 60, max: 84,
      label: 'Nën Mesatar',
      desc:  'Aftësi kognitive bazë. Me praktikë dhe stërvitje mendore mund të përmirësohet ndjeshëm performanca.',
      color: '#d97706',
    },
  ],

  questions: [
    // ── PATTERN RECOGNITION (4 q) ────────────────────────────────────────────
    {
      id: 'iq_p1', domain: 'pattern', difficulty: 1,
      text: 'Cili numër plotëson vargun: 2, 4, 8, 16, __?',
      options: ['24', '32', '30', '20'],
      correct: '32',
      explanation: 'Çdo term shumëzohet me 2: 2×2=4, 4×2=8, 8×2=16, 16×2=32.',
    },
    {
      id: 'iq_p2', domain: 'pattern', difficulty: 2,
      text: 'Cila shkronjë vjen në vazhdim: A, D, H, M, __?',
      options: ['Q', 'S', 'R', 'T'],
      correct: 'S',
      explanation: 'Hapësirat ndërmjet shkronjave rriten me 1 çdo herë: A+3=D, D+4=H, H+5=M, M+6=S.',
    },
    {
      id: 'iq_p3', domain: 'pattern', difficulty: 2,
      text: 'Cili numër plotëson vargun e Fibonacci-t: 1, 1, 2, 3, 5, 8, __?',
      options: ['11', '13', '12', '10'],
      correct: '13',
      explanation: 'Çdo term është shuma e dy termave të mëparshëm: 5+8=13.',
    },
    {
      id: 'iq_p4', domain: 'pattern', difficulty: 3,
      text: 'Cili numër plotëson vargun: 3, 6, 11, 18, 27, __?',
      options: ['36', '38', '40', '35'],
      correct: '38',
      explanation: 'Diferenca ndërmjet numrave rritet me 2 çdo herë: +3, +5, +7, +9, +11. Pra 27+11=38.',
    },

    // ── NUMERICAL REASONING (4 q) ────────────────────────────────────────────
    {
      id: 'iq_n1', domain: 'numerical', difficulty: 1,
      text: 'Nëse 5 punëtorë kryejnë një punë në 8 ditë, sa ditë do t\'u duhen 10 punëtorëve?',
      options: ['4', '3', '6', '5'],
      correct: '4',
      explanation: 'Raport i zhdrejtë: 5×8=10×d → d=4 ditë.',
    },
    {
      id: 'iq_n2', domain: 'numerical', difficulty: 1,
      text: 'Sa është 15% e 240?',
      options: ['30', '36', '24', '40'],
      correct: '36',
      explanation: '15% × 240 = 0.15 × 240 = 36.',
    },
    {
      id: 'iq_n3', domain: 'numerical', difficulty: 2,
      text: '(48 ÷ 6 + 4) × 3 − 10 = ?',
      options: ['26', '30', '32', '28'],
      correct: '26',
      explanation: '48÷6=8, 8+4=12, 12×3=36, 36−10=26.',
    },
    {
      id: 'iq_n4', domain: 'numerical', difficulty: 3,
      text: 'Arjeta blen 3 libra me 1 200 lekë. Sa libra mund të blejë me 2 800 lekë?',
      options: ['6', '7', '8', '5'],
      correct: '7',
      explanation: 'Çmimi për libër: 1200÷3=400 lekë. 2800÷400=7 libra.',
    },

    // ── LOGICAL DEDUCTION (4 q) ──────────────────────────────────────────────
    {
      id: 'iq_l1', domain: 'logical', difficulty: 1,
      text: 'Të gjitha macet janë kafshë. Flutura është kafshë. Çfarë mund të konkludojmë?',
      options: [
        'Flutura është mace',
        'Flutura nuk mund të jetë mace',
        'Nuk mund të konkludojmë se flutura është mace',
        'Macet dhe flutura janë të njëjta',
      ],
      correct: 'Nuk mund të konkludojmë se flutura është mace',
      explanation: 'Jo të gjitha kafshët janë mace. Flutura mund të jetë kafshë pa qenë mace.',
    },
    {
      id: 'iq_l2', domain: 'logical', difficulty: 2,
      text: 'Maria është më e gjatë se Ana. Ana është më e gjatë se Gerta. Blerti është më i gjatë se Maria. Kush renditet i dyti nga gjatësia?',
      options: ['Maria', 'Ana', 'Gerta', 'Blerti'],
      correct: 'Maria',
      explanation: 'Renditja: Blerti > Maria > Ana > Gerta. Vendi i dytë: Maria.',
    },
    {
      id: 'iq_l3', domain: 'logical', difficulty: 2,
      text: 'Kur bie shi → qëndroj brenda. Kur nuk bie shi → shëtis. Sot nuk shëtita. Çfarë ndodhi?',
      options: ['Doli shi', 'Nuk doli shi', 'Ndoshta doli shi', 'Asgjë nuk mund të thuhet'],
      correct: 'Doli shi',
      explanation: 'Kontrapozitiv: "nuk shëtita" → "doli shi" (sipas rregullave të dhëna).',
    },
    {
      id: 'iq_l4', domain: 'logical', difficulty: 3,
      text: 'Nga 100 studentë: 60 studiojnë Matematikë, 50 Fizikë, dhe 30 studiojnë të dyja lëndët. Sa nuk studiojnë asnjërën?',
      options: ['10', '20', '15', '25'],
      correct: '20',
      explanation: 'Bashkim: 60+50−30=80 studiojnë së paku njërën lëndë. Jashtë bashkimit: 100−80=20.',
    },

    // ── SPATIAL / ABSTRACT (4 q) ─────────────────────────────────────────────
    {
      id: 'iq_s1', domain: 'spatial', difficulty: 1,
      text: 'Cili numër NUK i takon grupit: 4, 9, 16, 25, 35, 36?',
      options: ['25', '35', '36', '16'],
      correct: '35',
      explanation: 'Të gjithë numrat e tjerë janë katrore të plota (2², 3², 4², 5², 6²). 35 nuk është katrore e plotë.',
    },
    {
      id: 'iq_s2', domain: 'spatial', difficulty: 2,
      text: 'Trekëndësh : Piramidë = Katror : ?',
      options: ['Kub', 'Sferë', 'Cilindër', 'Kon'],
      correct: 'Kub',
      explanation: 'Ekuivalenti tridimensional i trekëndëshit është piramida; ekuivalenti tridimensional i katrorit është kubi.',
    },
    {
      id: 'iq_s3', domain: 'spatial', difficulty: 2,
      text: 'Nëse vargu ABCD rrotullohet 180°, cili opsion tregon rezultatin e saktë?',
      options: ['DCBA', 'CDAB', 'BADC', 'ABCD'],
      correct: 'DCBA',
      explanation: 'Rrotullimi 180° kthen rendin plotësisht: A↔D, B↔C → DCBA.',
    },
    {
      id: 'iq_s4', domain: 'spatial', difficulty: 3,
      text: 'Matricë 3×3 — Rreshti 1: [2, 4, 8], Rreshti 2: [3, 9, 27], Rreshti 3: [4, 16, ?].',
      options: ['32', '64', '48', '56'],
      correct: '64',
      explanation: 'Çdo rresht: n¹, n², n³. Rreshti 3: 4¹=4, 4²=16, 4³=64.',
    },

    // ── WORKING MEMORY (4 q) ─────────────────────────────────────────────────
    {
      id: 'iq_m1', domain: 'memory', difficulty: 1,
      text: 'Gjej shumën e numrave tek nga lista: 7, 12, 3, 18, 5, 9, 14',
      options: ['24', '28', '26', '21'],
      correct: '24',
      explanation: 'Numrat tek: 7, 3, 5, 9. Shuma: 7+3+5+9=24.',
    },
    {
      id: 'iq_m2', domain: 'memory', difficulty: 2,
      text: 'Lista e shkronjave: K, A, P, I, T, A, L. Cila shkronjë ndodhet në pozicionin e 4-të?',
      options: ['I', 'P', 'T', 'A'],
      correct: 'I',
      explanation: 'K(1), A(2), P(3), I(4), T(5), A(6), L(7). Pozicioni 4: shkronja I.',
    },
    {
      id: 'iq_m3', domain: 'memory', difficulty: 2,
      text: 'Vargu ndjek rregullin alternativ ×2 dhe −1: 3, 6, 5, 10, 9, 18, __',
      options: ['17', '15', '16', '14'],
      correct: '17',
      explanation: 'Rregulla alternon: ×2, −1, ×2, −1, ×2, −1. 18−1=17.',
    },
    {
      id: 'iq_m4', domain: 'memory', difficulty: 3,
      text: 'Duke përdorur kodin A=1, B=2, …, Z=26: çfarë fjale formohet nga 14, 5, 21, 18, 15?',
      options: ['NEURO', 'NEURA', 'NEURC', 'NEURS'],
      correct: 'NEURO',
      explanation: 'N=14, E=5, U=21, R=18, O=15 → NEURO.',
    },
  ],
}

// ─── Scoring ───────────────────────────────────────────────────────────────
export function scoreIQ(answers, timeMs) {
  const qs = IQ_TEST.questions
  let correct = 0
  let weightedScore = 0
  const totalWeight = qs.reduce((s, q) => s + q.difficulty, 0)

  for (const q of qs) {
    if (answers[q.id] === q.correct) {
      correct++
      weightedScore += q.difficulty
    }
  }

  const accuracy    = weightedScore / totalWeight
  const timeLimitMs = IQ_TEST.time_limit_sec * 1000
  const elapsed     = Math.min(timeMs, timeLimitMs)
  const speedRatio  = 1 - elapsed / timeLimitMs

  const rawScore = 0.7 * accuracy + 0.3 * speedRatio
  const iq       = Math.round(Math.max(60, Math.min(160, 60 + rawScore * 100)))

  const band =
    IQ_TEST.iq_classification.find(b => iq >= b.min && iq <= b.max) ||
    IQ_TEST.iq_classification[IQ_TEST.iq_classification.length - 1]

  return {
    testId:       'iq',
    iq,
    correct,
    total:        qs.length,
    accuracy:     Math.round((correct / qs.length) * 100),
    timeMs,
    band,
    answers,
    completedAt:  new Date().toISOString(),
    profile: {
      name:  band.label,
      desc:  band.desc,
      emoji: '🧠',
      color: band.color,
    },
  }
}
