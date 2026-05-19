import { supabase } from '../lib/supabase'

export const EXPERTS = [
  {
    id: 'elsa-krasniqi',
    name: 'Dr. Elsa Krasniqi',
    title: 'Psikolog Klinik & Neuropsikolog',
    education: 'PhD · Universiteti i Tiranës · Specializim Vjenë',
    shortBio: 'Specialiste në ankthin klinik, traumën dhe CBT me mbi 12 vjet eksperiencë. Ka bashkëpunuar me OBSH-në në projekte rajonale.',
    fullBio: `Dr. Elsa Krasniqi është psikolog klinik dhe neuropsikolog me mbi 12 vjet eksperiencë në trajtimin e çrregullimeve të ankthit, traumës dhe depresionit. Ka doktoruar në Psikologji Klinike pranë Universitetit të Tiranës dhe ka vijuar specializim të avancuar në Psikoterapinë Kognitive-Sjellore (CBT) pranë Institutit Alfred Adler në Vjenë, Austri.

Gjatë karrierës së saj, ka bashkëpunuar me Organizatën Botërore të Shëndetësisë (OBSH) në disa projekte rajonale të shëndetit mendor (2021–2023) dhe ka publikuar mbi 18 artikuj shkencorë në revista ndërkombëtare peer-reviewed, duke përfshirë "Journal of Anxiety Disorders" dhe "European Journal of Psychotherapy".

Si terapiste CBT e certifikuar dhe praktikuese EMDR (Eye Movement Desensitization and Reprocessing), Dr. Krasniqi specializohet veçanërisht në trajtimin e PTSD, çrregullimeve të panikut dhe fobive sociale. Aktualisht është lektor i asociuar pranë Departamentit të Psikologjisë, Universiteti i Tiranës.`,
    specialties: ['Ankth', 'Trauma & PTSD', 'CBT', 'Depresion', 'Fobia Sociale'],
    email: 'info@neurospace.com',
    image: null,
    avatarGrad: 'linear-gradient(155deg,#6d28d9,#7c3aed,#4c1d95)',
    rating: 4.9,
    reviewCount: 128,
    answeredQuestions: 342,
    responseTime: 'Brenda 24h',
    status: 'online',
    education_detail: [
      { degree: 'PhD Psikologji Klinike', institution: 'Universiteti i Tiranës', year: '2012' },
      { degree: 'Specializim CBT & EMDR', institution: 'Institut Alfred Adler, Vjenë', year: '2014' },
      { degree: 'MA Neuropsikologji', institution: 'Universiteti i Prishtinës', year: '2009' },
    ],
    experience: [
      { role: 'Psikolog Klinik Senior', org: 'Qendra e Shëndetit Mendor, Tiranë', period: '2019 – sot' },
      { role: 'Këshilltar Shkencor', org: 'OBSH – Zyra Rajonale për Europën', period: '2021 – 2023' },
      { role: 'Lektor i Asociuar', org: 'Departamenti Psikologjisë, UT', period: '2017 – sot' },
    ],
  },
  {
    id: 'mentor-gashi',
    name: 'Dr. Mentor Gashi',
    title: 'Psikiatër & Specialist Gjumit',
    education: 'MD · Universiteti i Prishtinës · Rezidencë Frankfurt',
    shortBio: 'Psikiatër klinik me fokus në depresionin kronik, çrregullimet bipolare dhe insomninë. 15 vjet praktikë spitalore dhe ambulatore.',
    fullBio: `Dr. Mentor Gashi është psikiatër i certifikuar me specializim të dyfishtë: psikiatri klinike dhe mjekësinë e gjumit (sleep medicine). Ka mbaruar studimet e mjekësisë pranë Fakultetit të Mjekësisë, Universiteti i Prishtinës, dhe ka vijuar rezidencën 4-vjeçare në psikiatri pranë Universitetit Goethe në Frankfurt, Gjermani.

Mbi 15 vjet eksperiencë spitalore dhe ambulatore, duke trajtuar mbi 3,000 pacientë me çrregullime depresive, bipolare dhe çrregullime të gjumit. Dr. Gashi është pionier i protokollit CBT-I (Terapia Kognitive-Sjellore për Insomninë) në Kosovë dhe ka trajnuar mbi 40 profesionistë shëndetësorë.

Është anëtar aktiv i Shoqatës Europiane të Psikiatrisë (EPA) dhe Shoqatës Ndërkombëtare të Studimeve të Gjumit (WASM). Besimi i tij: "Gjumi nuk është luksi, por neurokirurgjia natyrale e trurit."`,
    specialties: ['Depresion', 'Çrregullim Bipolar', 'Insomnia', 'Psikofarmakologji', 'Stres Kronik'],
    email: 'info@neurospace.com',
    image: null,
    avatarGrad: 'linear-gradient(155deg,#1e40af,#3b82f6,#1d4ed8)',
    rating: 4.8,
    reviewCount: 97,
    answeredQuestions: 289,
    responseTime: 'Brenda 48h',
    status: 'busy',
    education_detail: [
      { degree: 'MD Mjekësi e Përgjithshme', institution: 'Universiteti i Prishtinës', year: '2005' },
      { degree: 'Rezidencë Psikiatri (4 vjet)', institution: 'Universiteti Goethe, Frankfurt', year: '2009' },
      { degree: 'Diplomë Sleep Medicine', institution: 'European Sleep Research Society', year: '2015' },
    ],
    experience: [
      { role: 'Psikiatër Klinik', org: 'QKUK – Klinika Psikiatrike, Prishtinë', period: '2010 – sot' },
      { role: 'Drejtor Qendres CBT-I', org: 'Qendra e Gjumit Kosovë', period: '2018 – sot' },
      { role: 'Trajner Ndërkombëtar', org: 'EPA (European Psychiatric Association)', period: '2020 – 2023' },
    ],
  },
  {
    id: 'arjeta-berisha',
    name: 'Psik. Arjeta Berisha',
    title: 'Psikolog Konsultativ & Terapist',
    education: 'MSc Psikologji · Universiteti i Tetovës · Certifikim DBT',
    shortBio: 'Specialiste në marrëdhëniet ndërpersonale, vetëbesimin dhe menaxhimin e stresit. Aplikon DBT dhe teknika mindfulness të bazuara shkencërisht.',
    fullBio: `Psikologja Arjeta Berisha ka mbi 9 vjet eksperiencë si terapiste dhe konsulente psikologjike, me fokus kryesor në marrëdhëniet ndërpersonale, vetëbesimin dhe çrregullimet e emocioneve. Ka mbaruar studimet Master pranë Universitetit të Tetovës dhe ka vijuar certifikimin ndërkombëtar në Terapinë Dialektike Sjellore (DBT), zhvilluar nga Dr. Marsha Linehan.

Psik. Berisha ka punuar gjerësisht me grupe të ndryshme popullsie: të rinj 18–30 vjeç me ankthi social, çiftet me probleme komunikimi, dhe profesionistë me burnout. Ka krijuar programin "Rikuperim i Shpejtë", 8 sesione të strukturuara për menaxhimin e stresit akut.

Angazhimi i saj me komunitetin include workshope mujore falas dhe kolumna javore psikologjike në media shqiptare. "Nuk ka njeri 'të thyer', por njerëz që nuk kanë gjetur ende mjetet e duhura."`,
    specialties: ['Marrëdhënie', 'Vetëbesim', 'DBT', 'Stres & Burnout', 'Mindfulness'],
    email: 'info@neurospace.com',
    image: null,
    avatarGrad: 'linear-gradient(155deg,#065f46,#059669,#0d9488)',
    rating: 4.9,
    reviewCount: 203,
    answeredQuestions: 518,
    responseTime: 'Brenda 12h',
    status: 'online',
    education_detail: [
      { degree: 'MSc Psikologji Klinike', institution: 'Universiteti i Tetovës', year: '2014' },
      { degree: 'Certifikim DBT', institution: 'Behavioral Tech Institute, SH.B.A.', year: '2017' },
      { degree: 'Certifikim MBSR', institution: 'UMass Medical School (Online)', year: '2019' },
    ],
    experience: [
      { role: 'Psikolog Konsultativ', org: 'Qendra "Bilbil", Tetovë', period: '2015 – sot' },
      { role: 'Ligjëruese Workshop', org: 'Fondacioni për Shëndet Mendor, MK', period: '2018 – sot' },
      { role: 'Psikolog Online', org: 'Platforma Psych-AL', period: '2020 – 2023' },
    ],
  },
  {
    id: 'blerim-hoxha',
    name: 'Dr. Blerim Hoxha',
    title: 'Psikolog Kognitiv & Neuroshkencëtar',
    education: 'PhD Neuroshkencë Kognitive · Universiteti i Lubjanës',
    shortBio: 'Ekspert i neuroshkencës kognitive dhe psikologjisë së performancës. Specializohet në optimizimin e fokusin, kujtesës dhe aftësive mësimore.',
    fullBio: `Dr. Blerim Hoxha është neuroshkencëtar kognitiv dhe psikolog i performancës me doktoratë pranë Universitetit të Lubjanës, Slloveni. Hulumtimet e tij fokusohen mbi mekanizmat neurobiologjikë të vëmendjes, kujtesës dhe mësimit, me aplikime praktike si për studentët ashtu edhe për profesionistët e lartë.

Ka punuar si hulumtues post-doktoral pranë Institutit Max Planck për Neuroshkencë Kognitive dhe Cerebrale (Leipzig, Gjermani) dhe si konsulent për kompanitë Fortune 500 në optimizimin e performancës kognitive të punonjësve.

Autor i librit "Truri Optimal" (2022, botimi shqip) dhe mbi 25 artikujve shkencorë. Bashkëthemelues i "NeuroPerform Academy", program onlijn për optimizimin kognitiv me mbi 8,000 studentë. "Intelekti nuk është fikse. Është muskul."`,
    specialties: ['Fokus & Vëmendje', 'Kujtesa', 'Produktivitet', 'ADHD (të rritur)', 'Psikologji Sportive'],
    email: 'info@neurospace.com',
    image: null,
    avatarGrad: 'linear-gradient(155deg,#312e81,#4f46e5,#7c3aed)',
    rating: 4.8,
    reviewCount: 156,
    answeredQuestions: 421,
    responseTime: 'Brenda 24h',
    status: 'online',
    education_detail: [
      { degree: 'PhD Neuroshkencë Kognitive', institution: 'Universiteti i Lubjanës', year: '2013' },
      { degree: 'Post-Doc Research Fellow', institution: 'Institut Max Planck, Leipzig', year: '2015' },
      { degree: 'MSc Psikologji Eksperimentale', institution: 'Universiteti i Sarajevës', year: '2010' },
    ],
    experience: [
      { role: 'Hulumtues Post-Doktoral', org: 'Max Planck Institut, Leipzig', period: '2013 – 2015' },
      { role: 'Konsulent Performancë Kognitive', org: 'McKinsey & Co. (kontratë)', period: '2016 – 2020' },
      { role: 'Bashkëthemelues & Drejtor Shkencor', org: 'NeuroPerform Academy', period: '2020 – sot' },
    ],
  },
  {
    id: 'lara-osmani',
    name: 'Psik. Lara Osmani',
    title: 'Psikolog Fëmijësh & Adoleshentësh',
    education: 'MSc Psikologji Zhvillimi · Universiteti i Shkupit',
    shortBio: 'Specialiste në psikologjinë e fëmijëve dhe adoleshentëve, ADHD dhe dinamikat familjare. Mbi 8 vjet punë klinike me fëmijë 6–18 vjeç.',
    fullBio: `Psikologja Lara Osmani specializohet ekskluzivisht në psikologjinë e fëmijëve dhe adoleshentëve, me eksperiencë klinike mbi 8 vjet. Ka formim të specializuar në Terapinë Lumore (Play Therapy), Terapinë Sistemike Familjare, dhe Vlerësimin Psikoeducativ (testimi IQ, ADHD, Spektri Autik).

Psik. Osmani ka punuar në kontekstin shkollor si psikolog i inkorporuar në 3 shkolla fillore dhe të mesme, duke ndihmuar mbi 500 fëmijë dhe familjet e tyre. Bashkëpunon ngushtë me pediatrikët, neurologët pediatrikë dhe mësuesit e edukimit special.

Ka ndjekur trajnime të avancuara në identifikimin e hershëm të spektrit autik, çrregullimeve të të ngrënit tek adoleshentët dhe trajtimin e traumës ndaj fëmijëve. "Fëmija që sillete 'keq' është zakonisht fëmija që vuante heshtazi."`,
    specialties: ['ADHD Fëmijë', 'Spektri Autik', 'Ankth Fëmijësh', 'Terapia Familjare', 'Bullying'],
    email: 'info@neurospace.com',
    image: null,
    avatarGrad: 'linear-gradient(155deg,#9f1239,#e11d48,#db2777)',
    rating: 5.0,
    reviewCount: 87,
    answeredQuestions: 234,
    responseTime: 'Brenda 24h',
    status: 'online',
    education_detail: [
      { degree: 'MSc Psikologji Zhvillimi & Edukative', institution: 'Universiteti Shën Kirili, Shkup', year: '2015' },
      { degree: 'Diplomë Play Therapy', institution: 'British Association of Play Therapists', year: '2018' },
      { degree: 'Trajnim Terapia Sistemike Familjare', institution: 'Institut Helm Stierlin, Heidelberg', year: '2020' },
    ],
    experience: [
      { role: 'Psikolog Shkollor', org: 'Shkolla Fillore "Liria", Shkup', period: '2015 – 2019' },
      { role: 'Psikolog Klinik Fëmijësh', org: 'Qendra Terapeutike "Ylberi", Shkup', period: '2019 – sot' },
      { role: 'Lektor Trajnimesh', org: 'Fondacioni UNICEF Maqedoni', period: '2021 – sot' },
    ],
  },
  {
    id: 'drita-halili',
    name: 'Psik. Drita Halili',
    title: 'Terapiste Çiftesh & Familjeje',
    education: 'MSc Psikologji · Universiteti i Tiranës · EFT Certifikuar',
    shortBio: 'Specialiste ndërkombëtare në Emotionally Focused Therapy (EFT) për çifte. 10 vjet eksperiencë në terapinë e marrëdhënieve dhe trajtimin e krizave familjare.',
    fullBio: `Psik. Drita Halili është terapiste çiftesh dhe familjeje me certifikim ndërkombëtar në Emotionally Focused Therapy (EFT), metodë e zhvilluar nga Dr. Sue Johnson e bazuar mbi teorinë e lidhjes. EFT ka efektivitetin shkencor më të lartë të dokumentuar për terapinë e çifteve: 70-75% e çifteve raportojnë rimëkëmbje të marrëdhënies pas 12–20 sesioneve.

Me mbi 10 vjet eksperiencë, Psik. Halili ka ndihmuar mbi 200 çifte dhe familje të lundrojnë kriza serioze: divorc, tradhtim, humbje, komunikim i çregulluar, dhe konflikte prindër–fëmijë. Angazhimi i saj i veçantë është me çiftet që kalojnë tranzicione të mëdha jetësore (lindja e fëmijës, dalja në pension, lëvizja jashtë vendit).

Psik. Halili ofron edhe sesione intensive 2-ditore për çiftet me mundësi të kufizuara kohe, format unik në rajon.`,
    specialties: ['Terapi Çiftesh (EFT)', 'Komunikimi', 'Divorc & Ndarje', 'Tradhtimi', 'Terapia Familjare'],
    email: 'info@neurospace.com',
    image: null,
    avatarGrad: 'linear-gradient(155deg,#92400e,#d97706,#ea580c)',
    rating: 4.9,
    reviewCount: 142,
    answeredQuestions: 378,
    responseTime: 'Brenda 36h',
    status: 'busy',
    education_detail: [
      { degree: 'MSc Psikologji Klinike', institution: 'Universiteti i Tiranës', year: '2011' },
      { degree: 'Certifikim EFT (Nivel 2)', institution: 'International Centre for Excellence in EFT', year: '2016' },
      { degree: 'Trajnim Terapia Sistemike', institution: 'Institut për Terapi Sistemike, Beograd', year: '2014' },
    ],
    experience: [
      { role: 'Terapiste Çiftesh & Familjeje', org: 'Praktikë Private, Tiranë', period: '2013 – sot' },
      { role: 'Psikolog Konsultativ', org: 'OJQ "Gratë për Gratë", Tiranë', period: '2011 – 2015' },
      { role: 'Trajnere EFT', org: 'ICEEFT – Affiliate Trainer Balkans', period: '2019 – sot' },
    ],
  },
  {
    id: 'ilir-sejdini',
    name: 'Dr. Ilir Sejdini',
    title: 'Neuropsikolog Klinik',
    education: 'PhD Neuropsikologji · Universiteti i Bolonjës',
    shortBio: 'Specialist i neuropsikologjisë klinike me fokus mbi vlerësimin kognitiv, demencat dhe rehabilitimin pas lëndimeve cerebrale. Punon me popullata 40–80 vjeç.',
    fullBio: `Dr. Ilir Sejdini është neuropsikolog klinik me doktoratë pranë Universitetit të Bolonjës, Itali, njëri nga qendrat kryesore europiane të neuropsikologjisë. Specializimi i tij kryesor: vlerësimi neuropsikologjik (testimi kognitiv gjithëpërfshirës), diagnostikimi i hershëm i demencave, dhe rehabilitimi kognitiv pas goditjeve cerebrale (stroke) dhe lëndimeve craniocerebrale.

Dr. Sejdini ka zhvilluar baterinë "CognAlb", battery e pare e standardizuar e testimit neuropsikologjik në gjuhën shqipe, aktualisht në përdorim nga 12 spitale në Shqipëri dhe Kosovë. Autori i 31 publikimeve shkencore, 3 kapitujve të librave ndërkombëtarë.

Angazhimi i tij aktual: programi "Truri Aktiv", intervenime bazuara shkencërisht për ruajtjen e shëndetit kognitiv te të moshuarit aktiv (60–80 vjeç).`,
    specialties: ['Vlerësim Neuropsikologjik', 'Demenca e Hershme', 'Rehabilitim Kognitiv', 'Stroke Recovery', 'Plakja Kognitive'],
    email: 'info@neurospace.com',
    image: null,
    avatarGrad: 'linear-gradient(155deg,#0c4a6e,#0891b2,#2563eb)',
    rating: 4.7,
    reviewCount: 64,
    answeredQuestions: 187,
    responseTime: 'Brenda 48h',
    status: 'offline',
    education_detail: [
      { degree: 'PhD Neuropsikologji Klinike', institution: 'Università di Bologna, Itali', year: '2011' },
      { degree: 'Specializim Neurorehabilitim', institution: 'IRCCS Santa Lucia, Romë', year: '2013' },
      { degree: 'MSc Psikologji Klinike', institution: 'Universiteti i Tiranës', year: '2007' },
    ],
    experience: [
      { role: 'Neuropsikolog Klinik', org: 'Spitali Universitar "Nënë Tereza", Tiranë', period: '2013 – sot' },
      { role: 'Hulumtues Asociuar', org: 'Instituti i Shëndetit Publik, Tiranë', period: '2015 – sot' },
      { role: 'Konsulent Neuropsikologjik', org: 'Spitali Amerikan 2, Tiranë', period: '2018 – sot' },
    ],
  },
  {
    id: 'valbona-curri',
    name: 'Psik. Valbona Curri',
    title: 'Psikolog Sportiv & Trainer Mendor',
    education: 'MSc Psikologji Sportive · Universiteti i Zagrebit',
    shortBio: 'Specialiste në psikologjinë e performancës sportive dhe burnout profesional. Ka punuar me sportistë kombëtarë dhe ekipe korporative.',
    fullBio: `Psik. Valbona Curri është psikolog sportiv dhe trainer mendor me Master të specializuar pranë Universitetit të Zagrebit, Kroaci, me njërin nga programet kryesore të psikologjisë sportive në rajon. Eksperienca e saj ndahet mes dy botëve: sportistët elite (ku aplikon teknika vizualizimi, rutinave mentoqe dhe menaxhimit të presionit) dhe profesionistët korporativi (menaxhimi i burnout-it dhe resilience training).

Ka punuar si psikolog mbështetës me ekipin nacional të atletikës të Shqipërisë dhe Kosovës, si dhe me disa ekipe futbolli të Superligës. Në sferën korporative, programet e saj "Peak State" i kanë ndihmuar mbi 1,200 profesionistë të rikuperojnë performancën pas burnout-it.

Certifikuar në WOOP (Wish-Outcome-Obstacle-Plan) nga Prof. Gabriele Oettingen (NYU) dhe programin "Mental Toughness" nga AQR International.`,
    specialties: ['Psikologji Sportive', 'Burnout', 'Menaxhim Presioni', 'Resilience', 'Motivim & Qëllime'],
    email: 'info@neurospace.com',
    image: null,
    avatarGrad: 'linear-gradient(155deg,#6b21a8,#9333ea,#ec4899)',
    rating: 4.8,
    reviewCount: 91,
    answeredQuestions: 256,
    responseTime: 'Brenda 24h',
    status: 'online',
    education_detail: [
      { degree: 'MSc Psikologji Sportive & Performancë', institution: 'Universiteti i Zagrebit, Kroaci', year: '2014' },
      { degree: 'Certifikim Mental Toughness', institution: 'AQR International, UK', year: '2017' },
      { degree: 'Certifikim WOOP (NYU)', institution: 'New York University Online', year: '2021' },
    ],
    experience: [
      { role: 'Psikolog Kombëtar Atletikë', org: 'Federata Atletikës Shqipëri & Kosovë', period: '2016 – sot' },
      { role: 'Trainer Mendor Korporativ', org: 'Peak State Consulting', period: '2019 – sot' },
      { role: 'Psikolog Sportiv', org: 'FK Skënderbeu (Superliga)', period: '2015 – 2019' },
    ],
  },
]

export const STATUS_LABELS = {
  online:  { label: 'Online',       color: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50' },
  busy:    { label: 'I/E zënë',     color: 'bg-amber-500',   text: 'text-amber-700',   bg: 'bg-amber-50'   },
  offline: { label: 'Jashtë linje', color: 'bg-gray-400',    text: 'text-gray-600',    bg: 'bg-gray-100'   },
}

const LS_EXPERTS_KEY      = 'ns_experts'
const LS_EXPERTS_INIT_KEY = 'ns_experts_initialized'

export function loadExperts() {
  try {
    const existing = localStorage.getItem(LS_EXPERTS_KEY)
    // If any data exists (new or old session), mark initialized and use it as-is
    if (existing) {
      localStorage.setItem(LS_EXPERTS_INIT_KEY, '1')
      return JSON.parse(existing)
    }
    // Truly first load: seed with static list once
    localStorage.setItem(LS_EXPERTS_KEY, JSON.stringify(EXPERTS))
    localStorage.setItem(LS_EXPERTS_INIT_KEY, '1')
    return EXPERTS
  } catch { return [] }
}

export function saveExperts(list) {
  try {
    localStorage.setItem(LS_EXPERTS_KEY, JSON.stringify(list))
    localStorage.setItem(LS_EXPERTS_INIT_KEY, '1')
  } catch {}
}

// ─── Supabase persistence ──────────────────────────────────────────────────
const DB_TABLE = 'specialists'

export async function fetchExpertsFromDB() {
  try {
    const { data, error } = await supabase
      .from(DB_TABLE)
      .select('id, data, display_order')
      .order('display_order', { ascending: true })
    if (error) throw error
    return data.map(row => ({ ...row.data }))
  } catch {
    return null // signals network/DB failure — caller falls back to localStorage
  }
}

export async function upsertSpecialistToDB(specialist, displayOrder = 0) {
  try {
    // eslint-disable-next-line no-unused-vars
    const { _dbOrder, ...clean } = specialist
    const { error } = await supabase
      .from(DB_TABLE)
      .upsert(
        {
          id:            clean.id,
          data:          clean,
          display_order: displayOrder,
          updated_at:    new Date().toISOString(),
        },
        { onConflict: 'id' }
      )
    if (error) throw error
    return true
  } catch {
    return false
  }
}

export async function deleteSpecialistFromDB(id) {
  try {
    const { error } = await supabase.from(DB_TABLE).delete().eq('id', id)
    if (error) throw error
    return true
  } catch {
    return false
  }
}

export async function seedSpecialistsToDB(list) {
  try {
    const { data: existing } = await supabase
      .from(DB_TABLE)
      .select('id')
      .limit(1)
    if (existing && existing.length > 0) return // already seeded, never overwrite
    const rows = list.map((s, i) => ({
      id:            s.id,
      data:          s,
      display_order: i,
      created_at:    new Date().toISOString(),
      updated_at:    new Date().toISOString(),
    }))
    await supabase.from(DB_TABLE).insert(rows)
  } catch {}
}
