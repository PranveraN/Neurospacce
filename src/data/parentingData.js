// ── PARENT CATEGORIES ────────────────────────────────────────────────────────
export const PARENT_CATEGORIES = [
  {
    id: 'first-time', label: 'Prindërit e Parë', emoji: '👶',
    color: '#ec4899', soft: '#fdf2f8', gradient: 'linear-gradient(135deg,#ec4899,#f43f5e)',
    desc: 'Udhëzim për prindërit që presin ose kanë fëmijë nën 3 vjeç.',
    challenges: ['Gjumi i parregullt dhe lodhja', 'Ankthi nga inexperienca', 'Lidhja emocionale me foshnjën', 'Ushqyerja dhe rutina ditore'],
  },
  {
    id: 'kids-6-12', label: 'Fëmijët 6–12 vjeç', emoji: '🧒',
    color: '#f97316', soft: '#fff7ed', gradient: 'linear-gradient(135deg,#f97316,#fb923c)',
    desc: 'Moshë kritike: shkolla, miqtë, rregullat dhe identiteti.',
    challenges: ['Probleme me detyrat e shtëpisë', 'Konflikte me shokë', 'Ekranet dhe teknologjia', 'Vetëbesimi dhe performanca'],
  },
  {
    id: 'teens', label: 'Adoleshentët', emoji: '🧑',
    color: '#7c3aed', soft: '#f5f3ff', gradient: 'linear-gradient(135deg,#7c3aed,#6d28d9)',
    desc: 'Komunikim, kufijtë dhe mbështetja gjatë viteve të vështira.',
    challenges: ['Komunikimi i vështirë', 'Presioni i bashkëmoshatarëve', 'Identiteti dhe vetëvlerësimi', 'Rrjetet sociale dhe interneti'],
  },
  {
    id: 'bullying', label: 'Bullizmi', emoji: '🛡️',
    color: '#0891b2', soft: '#ecfeff', gradient: 'linear-gradient(135deg,#0891b2,#0e7490)',
    desc: 'Si të mbrojmë dhe ndihmojmë fëmijët të ballafaqohen me bullizmin.',
    challenges: ['Njohja e shenjave të bullizmit', 'Si t\'i flasësh fëmijës', 'Ndërhyrja me shkollën', 'Rindërtimi i vetëbesimit'],
  },
  {
    id: 'special-needs', label: 'Nevoja Speciale', emoji: '🌟',
    color: '#059669', soft: '#ecfdf5', gradient: 'linear-gradient(135deg,#059669,#047857)',
    desc: 'Mbështetje dhe strategji për prindërit e fëmijëve me nevoja të veçanta.',
    challenges: ['Ndërhyrja e hershme', 'Komunikimi alternativ', 'Mbështetja emocionale e prindit', 'Bashkëpunimi me shkollën'],
  },
]

// ── PARENTING ARTICLES ────────────────────────────────────────────────────────
export const PARENTING_ARTICLES = [
  // ── First-time parents
  {
    id: 1, categoryId: 'first-time', emoji: '🤱',
    title: 'Si të ndërtosh lidhje të sigurt me foshnjën tënde',
    excerpt: 'Teoria e attachment-it tregon se cilësia e lidhjes në muajt e parë ndikon në gjithë jetën e fëmijës. Ja çfarë mund të bësh çdo ditë.',
    readTime: '3 min', tags: ['Lidhje', 'Foshnjë', 'Zhvillim'],
    content: [
      'Çdo herë që i përgjigjesh qarjes së foshnjës, e merr në krah, e ushqen, i flet me zë të butë, truri i saj regjistron: "bota është e sigurt dhe dikush kujdeset." Ky proces, i quajtur "serve-and-return", është themeli biologjik i lidhjes së sigurt. Nuk kërkon perfekcion, por prezencë të qëndrueshme.',
      'Kontakti fizik i drejtpërdrejtë luan rol të madh: lëkura-me-lëkurë pas lindjes, mbajtja në krah gjatë ushqyerjes, kontakti i syve gjatë bisedës. Studime mbi fëmijët e lindur para kohe tregojnë se kontakti "kangaroo" (mbajtja në gjoks) rregullon rrahjet e zemrës, frymëmarrjen dhe temperaturën, edhe më efektivisht se inkubatori.',
      'Nëse ndihet e lodhur dhe jo gjithmonë e disponueshme, kjo është normale. Lidhja e sigurt nuk do të thotë t\'i përgjigjesh çdo sekondë, por që shumica e herëve kur foshnja ka nevojë, dikush është aty. Madje edhe riparimi pas momenteve të vështira (kur qetësohesh dhe i kthehesh fëmijës) mëson diçka të vlefshme: marrëdhëniet mund të shërohen.',
    ],
  },
  {
    id: 2, categoryId: 'first-time', emoji: '😴',
    title: 'Rutina e gjumit: Pse është jetike dhe si ta vendosësh',
    excerpt: 'Fëmijët me rutinë gjumi të strukturuar kanë nivel më të ulët kortizoli. Ja hapat praktikë për të çuar fëmijën në gjumë pa betejë.',
    readTime: '4 min', tags: ['Gjumi', 'Rutinë', 'Shëndet'],
    content: [
      'Truri i fëmijës funksionon me parashikueshmëri. Kur çdo natë ndodhin të njëjtat gjëra në të njëjtin rend, banja, libri, gjumi, truri fillon ta "presë" gjumin si hapin tjetër natyror. Pas 10-14 ditësh, kortizoli (hormoni i stresit) bie automatikisht në atë orë dhe melatonina rritet. Beteja bëhet bashkëpunim.',
      'Sekuenca ideale është e thjeshtë: dritë e dobët 30 minuta para gjumit, banjë e ngrohtë (ul temperaturën e trupit, sinjal biologjik gjumi), libër ose këngë e qetë, pastaj gjumë. Ekrani para gjumit bllokon melatoninën deri në 2 orë, pra zëvendësoje me rutinën fizike.',
      'Kur rutina prishet, udhëtim, sëmundje apo ndryshim shtëpie, rikthejeni hap pas hapi pa presion. Fëmijët tregojnë rezistencë maksimale kur janë të lodhur tej mase. Shikoni "dritaren e gjumit", momentin kur fëmija fërkon sytë ose bëhet i qetë papritur, dhe veproni pikërisht atëherë.',
    ],
  },
  {
    id: 3, categoryId: 'first-time', emoji: '😰',
    title: 'Ankthi i prindit të ri: Normal, i menaxhueshëm, kalues',
    excerpt: 'Mbi 70% e prindërve të rinj raportojnë nivele të larta ankthi. Kuptoje pse ndodh dhe si të mbash qetësinë kur gjithçka ndihet e re.',
    readTime: '3 min', tags: ['Ankth', 'Vetëkujdes', 'Psikologji'],
    content: [
      'Pas lindjes, truri i prindit kalon ndryshime reale neurologjike: amigdala, qendra e alarmit, bëhet hiperaktive. Ky është mekanizëm evolucionar mbrojtës: do të të mbajë vigjilent ndaj rreziqeve. Por në botën moderne, ky alarm shpesh dërgon sinjale false si katastrofizim, mendime obsesive për shëndetin e foshnjës dhe frika nga gjumi.',
      'Dallimi midis ankthit normal dhe atij klinik: ankthi normal kalon me pushim, mbështetje dhe kohë. Ankthi klinik (PPD, depresioni postnatal ose ankthi postnatal) është i vazhdueshëm, parandalon funksionimin normal dhe nuk lehtësohet me pushim. Nëse simptomat zgjasin mbi 2 javë ose janë intensive, konsulto mjekun: nuk është dobësi, është shëndet.',
      'Tre gjëra që ndihmojnë: (1) Gjumi: madje edhe 4 orë të pandërhyra janë restauruese. (2) Lëvizja: ecja 20 minuta ul kortizolin më shumë se çdo teknikë tjetër. (3) Lidhja sociale: izolimi amplifikon ankthin. Flisni me partnerët, familjen, grupe prindërish. Nuk duhet ta bëni vetëm.',
    ],
  },

  // ── Kids 6-12
  {
    id: 4, categoryId: 'kids-6-12', emoji: '📚',
    title: 'Si t\'i ndihmosh fëmijës me detyrat pa bërtitur',
    excerpt: 'Beteja e detyrave është reale, por zgjidhja nuk është presioni. Ja si të krijosh një ambient ku fëmija mëson me dëshirë.',
    readTime: '3 min', tags: ['Detyra', 'Motivim', 'Shkollë'],
    content: [
      'Fëmijët që vijnë nga shkolla kanë kaluar 6-7 orë duke u përpjekur të kontrollojnë sjelljen, vëmendjen dhe emocionet. Truri i tyre është i lodhur. Kur prindi kërkon menjëherë detyrat, kjo ndesh me rezervat e fundit të energjisë kognitive. Zgjidhja nuk është këmbëngulja, por pushimi i planifikuar: 20-30 minuta lojë e lirë pas shkollës, pastaj detyrat.',
      'Ambienti fizik ka rëndësi: i njëjti vend çdo ditë (tavolina, jo divani), pa ekrane anës, dritë natyrale kur është e mundur. Fëmijët punojnë më mirë kur ata vetë vendosin rendin e detyrave, gjë që u jep ndjenjën e kontrollit. Prindi është prezent si "burim", jo si mbikëqyrës, duke kuptuar dhe besuar.',
      'Nëse konfliktet vazhdojnë, pyesni: a është detyra shumë e vështirë (nevoja për mbështetje shkollore), a ka vështirësi specifike mësimi (ADHD, disleksi), apo ka diçka tjetër që e shqetëson? Beteja e detyrave shpesh është simptomë e diçkaje tjetër. Kontakti me mësuesin dhe psikologun shkollor mund të zbulojë rrënjën.',
    ],
  },
  {
    id: 5, categoryId: 'kids-6-12', emoji: '🤥',
    title: 'Kur fëmija gënjen: Psikologjia pas gënjeshtrës dhe si të reagosh',
    excerpt: 'Gënjeshtra te fëmijët 6-12 vjeç shpesh tregon zhvillim normal të autonomisë. Ja si të reagosh pa dëmtuar besimin.',
    readTime: '4 min', tags: ['Sjellje', 'Gënjeshtrë', 'Besim'],
    content: [
      'Gënjeshtra te fëmijët 4-6 vjeç shpesh është imagjinatë e padiferencuar nga realiteti. Te fëmijët 7-12 vjeç, gënjeshtra ka qëllim: të shmangin ndëshkimin, të mbrojnë autonominë ose të ruajnë marrëdhënien me prindërit. Studiuesi Paul Ekman tregon se fëmijët që gënjejnë tek prindërit që ndëshkojnë ashpër, gënjejnë më shumë, jo më pak.',
      'Reagimi efektiv: qëndroni i qetë dhe i hapur. "E di që je i shqetësuar nga ndëshkimi, por dëshiroj të kuptoj çfarë ndodhi vërtet." Kjo frazë hap dialogun pa gjykim. Ndëshkimi i ashpër mëson të gënjejë më mirë; kureshtja dhe qetësia mësojnë ndershmërinë si vlerë.',
      'Ndërtoni besim afatgjatë duke mos reaguar me shumë zemërim kur fëmija tregon të vërtetën e vështirë. Çdo herë që prindi mban qetësinë kur fëmija rrëfen gabimin, fëmija mëson: "mund t\'i tregoj gjërat e vështira." Kjo lidhje është investimi më i madh për adoleshencën kur lajmet mund të jenë shumë more serioze.',
    ],
  },
  {
    id: 6, categoryId: 'kids-6-12', emoji: '📱',
    title: 'Ekranet dhe fëmijët: Kufijtë e shëndetshëm bazuar në shkencë',
    excerpt: 'Jo të gjitha kohët e ekranit janë njëlloj. Kuptoje ndryshimin midis kohës pasive dhe aktive, dhe si të vendosësh kufij pa konflikte.',
    readTime: '3 min', tags: ['Teknologji', 'Kufij', 'Shëndet'],
    content: [
      'Shkenca bën dallim të rëndësishëm: koha pasive (scrolling, video pasive, reklama) është e dëmshme për zhvillimin, redukton vëmendjen dhe rrit nervozizmin. Koha aktive (lojëra me strategji, kodim, video-thirrje me familjen, krijim) ka efekte neutrale ose pozitive. Pyetja nuk është "sa kohë" por "çfarë lloji".',
      'Rregullat që funksionojnë janë ato të krijuara bashkërisht. Vendosni "Kushtetutën e Familjes për Ekranet": çfarë lejohet, çfarë jo, cilat janë "zonat pa ekran" (dhoma e gjumit, tryeza e darkës). Kur fëmija ka marrë pjesë në vendim, respekton rregullin shumë më shpesh se kur prindi vendos vetëm.',
      'Kur fëmija refuzon të lëshojë ekranin, problemi zakonisht nuk është varësia, por tranzicioni i vështirë. Truri adoleshent dhe fëmijëror ka vështirësi me ndërprerjet e papritura. Zgjidhja: paralajmërim 10 minuta para ("edhe 10 minuta"), pastaj 5, pastaj 2. Kjo lejon trurin të fillojë tranzicionin emocionalisht.',
    ],
  },

  // ── Teens
  {
    id: 7, categoryId: 'teens', emoji: '💬',
    title: 'Si të komunikosh me adoleshentin kur ai nuk dëgjon asgjë',
    excerpt: 'Truri i adoleshentit është neurologjikisht i ndryshëm. Kuptoje shkencën dhe ndryshoje mënyrën si i flet fëmijës tënd.',
    readTime: '4 min', tags: ['Komunikim', 'Adoleshentë', 'Neuroshkencë'],
    content: [
      'Korteksi prefrontal, pjesa e trurit që mendon afatgjatë dhe kontrollon impulset, nuk mbarohet të zhvillohet deri në moshën 25 vjeç. Adoleshenti nuk "zgjedh" të jetë i papërgjegjshëm: truri i tij është gjysëm i ndërtuar. Amigdala (emocionet) drejton; korteksi (arsyeja) mbetet prapa. Kjo e bën të dobishëm qasjen emocionale para asaj racionale.',
      'Bisedatat e mira me adoleshentët rrallë ndodhin "ballë-për-ballë" me kontakt të drejtpërdrejtë të syve, pasi kjo ndihet si marrje në pyetje. Ndodhin "anash": gjatë drejtimit të makinës, gatimit bashkë, ecjes. Pyetjet e hapura funksionojnë ("çfarë mendove?"), ndërsa pyetjet mbyllëse ("a ishte mirë shkolla?") marrin vetëm "po" ose "jo".',
      'Para se të jepni këshillë, pyesni: "Doni të dëgjoj apo të ndihmoj?" Kjo pyetje e thjeshtë e ndryshon dinamikën: adoleshenti ndihet i respektuar si person me autonomi, jo si problem për tu zgjidhur. Nëse përgjigja është "vetëm dëgjom", dëgjoni pa ndërhyrë. Zakonisht këshilla e duhur vjen vetë kur ndihet i kuptuar.',
    ],
  },
  {
    id: 8, categoryId: 'teens', emoji: '💔',
    title: 'Adoleshenti dhe vetëvlerësimi i ulët: Shenjat dhe ndihma',
    excerpt: 'Vetëvlerësimi i ulët te adoleshentët shpesh fshihet pas agresionit ose tërheqjes. Ja shenjat dhe hapat për të ndihmuar.',
    readTime: '5 min', tags: ['Vetëbesim', 'Emocione', 'Mbështetje'],
    content: [
      'Vetëvlerësimi i ulët shpesh nuk duket si depresion i qartë. Shfaqet si: agresion i papritur (mbrojtje ndaj kritikës), perfeksionizëm ekstrem (frika nga dështimi), tërheqje sociale, refuzim i aktiviteteve të reja, krahasim i vazhdueshëm me të tjerët, ose shprehje si "jam i paaftë", "askush nuk e don" të thuara me ton "gjysmë-serioz".',
      'Çfarë prindërit bëjnë pa e kuptuar që dëmton: krahasimi me vëllezërit ose shoqërinë ("shiko sa mirë bën Argjendi"), kritika pas çdo gabimi, mungesa e pranimit kur nota nuk është e lartë. Çfarë ndihmon: pranimi i kushtëzuar nga arritja kundrejt pranimit të pakushtëzuar si person. "Jam krenar për ty" vs. "Jam krenar sepse more 10".',
      'Hapat praktikë: (1) Gjeni diçka që adoleshenti bën mirë dhe jepini hapësirë të zhvillohet: kompetenca ndërton vetëbesim. (2) Modeloni vetë-mëshirën: kur gaboni, mos u dënoni publikisht, tregoni si e trajtoni gabimin. (3) Nëse shenjat janë intensive ose zgjasin mbi 3 muaj, konsultoni psikologun: ndërhyrja e hershme ndryshon trajektoren.',
    ],
  },
  {
    id: 9, categoryId: 'teens', emoji: '🔓',
    title: 'Kufijt me adoleshentët: Jo kontrolli, por liria e strukturuar',
    excerpt: 'Adoleshentët kanë nevojë për autonomi, por edhe strukturë. Ja si të gjesh ekuilibrin që mbron pa izoluar.',
    readTime: '3 min', tags: ['Kufij', 'Autonomi', 'Besim'],
    content: [
      'Adoleshentët shtyjnë kufijt biologjikisht, pasi truri i tyre është i programuar të kërkojë autonomi si hap drejt maturimit. Prindi që i reziston kësaj plotësisht rrezikon dy rezultate: adoleshentin tepër të varur ose adoleshentin rebel. Prindi që i dorëzohet plotësisht rrezikon adoleshentin pa strukturë dhe pa aftësi vendim-marrjeje.',
      'Liria e strukturuar do të thotë: kufij të negociuar, jo të imponuar. "Deri kur do të jesh jashtë të premten?" dhe jo thjesht "ora 22:00 dhe pikë." Kur adoleshenti merr pjesë në vendosjen e kufijve, i respekton shumë më shumë. Çdo kufi duhet të ketë arsye, jo vetëm rregull. "Sepse e thashë unë" është receta e rebelimit.',
      'Besimi ndërtohet gradualisht: filloni me liri të vogla, respektoni marrëveshjet, shtoni liri kur adoleshenti tregon përgjegjësi. Kur prindi thotë "u besova dhe e mbajte fjalën, herën tjetër mund të qëndrosh edhe 30 minuta later", ky veprim ndërton karakter dhe lidhje. Kontrolli ekstrem mëson fshehje; besimi gradual mëson llogaridhënie.',
    ],
  },

  // ── Bullying
  {
    id: 10, categoryId: 'bullying', emoji: '🔍',
    title: 'Si ta njohësh nëse fëmija yt po viktimzohet në shkollë',
    excerpt: 'Shumica e fëmijëve nuk flasin hapur. Ja 12 shenjat që tregojnë se diçka po ndodh dhe si t\'i trajtosh me kujdes.',
    readTime: '3 min', tags: ['Njohje', 'Shenja', 'Vigjilencë'],
    content: [
      'Vetëm 30% e fëmijëve të viktimizuar u tregojnë prindërve. Arsyeja: turpi, frika se nuk do të besohen, frika se prindi do t\'i bëjë gjërat worse, ose besimi se duhet ta zgjidhin vetë. Kjo do të thotë prindërit duhet të lexojnë shenjat e sjelljes, jo të presin rrëfimin verbal.',
      'Shenjat kryesore: ndryshim i papritur i humorit pas shkollës, ankth i shtuar para të hënave, refuzim i shkollës pa arsye të qartë, objekte ose para që humbin pa shpjegim, plagë ose veshje e dëmtuar, largim nga shoqëria dhe aktivitetet e dashura, vështirësi gjumi ose endrra të këqija të shpeshta, humbje appetite, rënie e notave papritur.',
      'Si të hapësh bisedën pa e shtyrë: mos pyesni drejtpërdrejt "a të bën dikush keq?", pasi kjo merr "jo" si refleks mbrojtës. Provoni: "Kam vërejtur që... A ka diçka të shqetëson?" Ose tregoni një histori nga fëmijëria juaj ku dikush ju bëri keq; adoleshentët shpesh hapen kur shohin se prindi ka kaluar nëpër të ngjashme.',
    ],
  },
  {
    id: 11, categoryId: 'bullying', emoji: '🗣️',
    title: 'Çfarë të thuash (dhe çfarë jo) kur fëmija tregon bullizmin',
    excerpt: 'Reagimi i parë i prindit është vendimtar. Shumë prindër pa dëshirë e ndalojnë fëmijën të flasë sërish. Ja si të bësh ndryshe.',
    readTime: '4 min', tags: ['Komunikim', 'Mbështetje', 'Reagim'],
    content: [
      'Reagimet që bllokojnë komunikimin e ardhshëm: "Pse nuk u mbrojte?", "Injoroji", "Bëhu i fortë", "Nuk është aq keq sa mendon". Këto fraza, edhe nëse dalin nga dashuria, i dërgojnë fëmijës mesazhin: "Gabova që fola. Nuk është keq sa mendova. Duhet ta zgjidhja vetë." Fëmija nuk do të flasë sërish.',
      'Çfarë funksionon: (1) Dëgjoni plotësisht pa ndërhyrë, rezistoni impulsin për të vepruar menjëherë. (2) Vërtëtoni: "Kjo është e gabuar dhe nuk duhet të ndodhë." (3) Falënderoni: "Jam krenare që ma tregove: duhej guxim." (4) Pyesni çfarë do fëmija: "Çfarë do të doje të bëja unë tani?", mos supozoni.',
      'Hapat praktikë: dokumentoni çdo incident (data, vendi, çfarë ndodhi, dëshmitarë), kontaktoni shkollën me ton bashkëpunues jo akuzues, kërkoni plan konkret nga drejtoria. Nëse shkolla nuk vepron, njohni të drejtat tuaja ligjore. Ndërkohë, mbani fëmijën të lidhur me aktivitete jashtë shkollës ku mund të ndërtojë miq pozitivë.',
    ],
  },
  {
    id: 12, categoryId: 'bullying', emoji: '💪',
    title: 'Rindërtimi i vetëbesimit pas bullizmit: Hapat praktikë',
    excerpt: 'Bullizmi lë shenja. Por truri është plastik dhe me mbështetjen e duhur, fëmijët rimëkëmben. Ja procesi hap pas hapi.',
    readTime: '5 min', tags: ['Shërim', 'Vetëbesim', 'Psikologji'],
    content: [
      'Bullizmi i zgjatur dëmton tre gjëra kryesore: vetëvlerësimin ("jam i keq"), besimin tek të tjerët ("njerëzit janë të rrezikshëm") dhe ndjenjën e kontrollit ("nuk mund të bëj asgjë"). Shërimi adreson të tre gradualisht: nuk ka rrugë të shkurtër, por ka rrugë.',
      'Faza 1, Siguria: sigurohuni që bullizmi ka ndaluar fizikisht (ndrro klasë, shkollë nëse nevojitet). Fëmija nuk mund të shërohet ndërkohë që kërcënimi vazhdon. Faza 2, Lidhja: rindërtoni lidhjet sociale pozitive nëpërmjet aktiviteteve jashtë shkollës (sport, art, muzikë) ku fëmija mund të njohë njerëz të rinj. Faza 3, Kompetenca: gjeni diçka ku fëmija excel, edhe diçka e vogël ndërton ndjenjën e aftësisë.',
      'Kur të kërkoni ndihmë profesionale: nëse fëmija tregon shenja depresioni (humbje interesi, shprehje negativiste intensive), ankth të gjeneralizuar, apo nëse bullizmi ka qenë i zgjatur ose i dhunshëm, psikologu fëmijësh mund të ofrojë terapi CBT ose play therapy. Shërimi i fëmijëve është shumë i mundshëm me mbështetje të duhur.',
    ],
  },

  // ── Special needs
  {
    id: 13, categoryId: 'special-needs', emoji: '💙',
    title: 'Diagnoze e re: Çfarë të ndjesh dhe çfarë të bësh tani',
    excerpt: 'Marrja e një diagnoze është moment transformues. Dhimbja, faji dhe shpresa janë të gjitha normale. Ja ku të fillosh.',
    readTime: '4 min', tags: ['Diagnozë', 'Emocione', 'Fillim'],
    content: [
      'Prindërit që marrin diagnozën e fëmijës kalojnë faza emocionale të ngjashme me zi: mohim, zemërim, pazarim, trishtim, pranim. Këto nuk janë lineare, vijnë dhe shkojnë, ngandonjëherë brenda të njëjtës ditë. Të gjitha janë të vlefshme dhe normale. Faji ("çfarë bëra gabim?") është pothuajse universal dhe pothuajse gjithmonë i pabazuar.',
      'Hapi i parë praktik: informacioni i besueshëm. Shmangni googling-un e pakontrolluar pasi çon në ankth maksimal. Kërkoni burime nga organizata të specializuara, mjeku juaj ose psikologu fëmijësh. Pyesni: "Çfarë duket si jeta e mirë për fëmijën tim?", jo "çfarë nuk mund të bëjë." Fëmijët me nevoja speciale kanë jetë të pasura dhe të kuptimplota.',
      'Ndërtoni ekipin tuaj: terapeuti i të folurit, fizioterapisti, psikologu, mësuesi i edukimit special, pediatri, pa i koordinuar vetëm. Bashkohuni me grupe prindërish me eksperiencë të ngjashme: ata kanë dije praktike që asnjë manual nuk e zëvendëson. Dhe mos harroni: prindi i kujdesshëm, i pranishëm dhe i informuar është faktori nr.1 i rezultateve pozitive.',
    ],
  },
  {
    id: 14, categoryId: 'special-needs', emoji: '📅',
    title: 'Rutina dhe parashikueshmëria: Çelësi për fëmijët me nevoja speciale',
    excerpt: 'Struktura e parashikueshme redukton ankthin dhe rrit bashkëpunimin. Ja si të ndërtosh ditë të qëndrueshme.',
    readTime: '3 min', tags: ['Rutinë', 'Strukturë', 'Ankth'],
    content: [
      'Për fëmijët me autizëm, ADHD ose ankth, panjohja është burim stresi real. Truri që nuk mund të parashikojë "çfarë vjen tjetër" mbetet në gjendje alarmi konstant, gjë që shpjegon pse ndryshimet e vogla shkaktojnë reagime të mëdha. Rutina e qëndrueshme nuk është rigjiditet, por siguri neurologjike.',
      'Si të ndërtoni rutinën efektive: (1) Vizualizoni atë: orari me fotografi ose piktura funksionon shumë mirë për fëmijët me komunikim verbal të kufizuar. (2) Paralajmëroni tranzicionet: "pas 5 minutash do kalojmë te..." (3) Mbani sekuencën bazë konstante edhe kur detajet ndryshojnë. (4) Kur rutina duhet ndryshuar, shpjegojeni paraprakisht, sa herë të mundeni.',
      'Tranzicionet (midis aktiviteteve, midis vendeve) janë pikat më të vështira. Strategjia "first-then" funksionon mirë: "Fillimisht këpucët, pastaj parkun." Shpërblimet vizuale ose tabela e suksesit ndërtojnë motivim pozitiv. Mos e konsideroni rutinën si kufizim: konsiderojeni si çelësin që hap dyer, pasi kur fëmija ndjehet i sigurt, mëson, bashkëpunon dhe lulëzon.',
    ],
  },
  {
    id: 15, categoryId: 'special-needs', emoji: '🌸',
    title: 'Si të kujdesesh për veten si prind i lodhur',
    excerpt: 'Burnout-i i kujdestarëve është real dhe serioze. Pa kujdesin e prindit, nuk ka kujdes të qëndrueshëm për fëmijën.',
    readTime: '4 min', tags: ['Vetëkujdes', 'Burnout', 'Shëndet mendor'],
    content: [
      'Burnout-i i kujdestarëve ka simptoma specifike: lodhje fizike dhe emocionale kronike, ndjenjë e zbrazëtisë, apatia ndaj fëmijës (e ndjekur nga faji i madh), irritim i shtuar, humbje e identitetit personal jashtë rolit të kujdestarit. Nëse ju gjeni veten duke numëruar orët deri sa fëmija fle, kjo nuk është shenjë që jeni prind i keq. Është shenjë që keni nevojë për mbështetje.',
      'Vetëkujdesi real nuk është spa ose pushim luksoz, por gjëra të vogla dhe të vazhdueshme: 15 minuta në ditë plotësisht për veten (libër, muzikë, heshtje), gjumi i optimizuar kur është e mundur, ushqim i rregullt, lëvizje e lehtë. Hulumtimet tregojnë se prindërit që kujdesen për veten kanë reagime emocionale shumë më të rregulluara ndaj fëmijës.',
      'Kërkimi i ndihmës është forcë, jo dobësi: ndani kujdesin me partnerin, familjen, apo kujdestarë profesionalë, edhe nëse vetëm 2 orë në javë. Terapia individuale për prindërit e fëmijëve me nevoja speciale është investim real, jo luks. Ju nuk mund të jepni nga rezerva boshe. Kujdesi për veten është kujdes për fëmijën tuaj.',
    ],
  },
]

// ── PARENTING TECHNIQUES ──────────────────────────────────────────────────────
export const PARENTING_TECHNIQUES = [
  {
    id: 1, categoryId: 'kids-6-12', emoji: '⚖️',
    title: 'Teknika e Zgjedhjes',
    situation: 'Fëmija refuzon të bëjë gjëra të thjeshta si të vishet apo të pastrojë dhomën.',
    wrongApproach: 'Prindi urdhëron dhe kur fëmija refuzon, ndëshkimi ose debati i gjatë.',
    steps: [
      'Ofro 2 opsione konkrete, jo komanda: "Vishësh tani apo pas mëngjesit?"',
      'Tono zërin qetë: oferta e sinqertë, jo rrethanë e rreme',
      'Lëre të zgjedhë dhe respekto zgjedhjen pa komentuar',
      'Falënderoje për vendimin dhe ndërtoi ndjenjën e kompetencës',
    ],
    example: '"Doni të pastrosh lodrat para darkës apo pas?" Ky formulim u jep fëmijëve ndjenjën e kontrollit.',
    tip: 'Opsionet duhet të jenë të dyja të pranueshme për ty. Kurrë mos ofroj zgjedhje false.',
  },
  {
    id: 2, categoryId: 'first-time', emoji: '🏷️',
    title: 'Emërtimi Emocional',
    situation: 'Foshnja apo fëmija i vogël bërtet, qan apo ka krizë dhe prindi nuk di si të reagojë.',
    wrongApproach: 'Thënia "mos qaj" ose "nuk ka gjë" mohon emocionin dhe dobëson besimin.',
    steps: [
      'Ulet te niveli i fëmijës dhe vendosi emrin emocionit: "Ti je i mërzitur tani."',
      'Vërteto ndjenjën: "E kuptoj, të donte të luaje edhe pak."',
      'Qëndro i pranishëm: prania fizike rregullon sistemin nervor',
      'Ofro zgjidhje vetëm pasi fëmija është qetësuar: "Çfarë do të ndihmonte tani?"',
    ],
    example: 'Kur Arti bëhet 4 vjeç dhe qan se lodra u thye, thuaj: "Je i trishtuar dhe i zemëruar, kjo ka kuptim." Pastaj qëndro.',
    tip: 'Emërtimi i emocioneve ndërton inteligjencën emocionale, aftësinë më të vlefshme sociale.',
  },
  {
    id: 3, categoryId: 'teens', emoji: '👂',
    title: 'Dëgjimi Aktiv pa Gjykim',
    situation: 'Adoleshenti fillon të tregojë diçka por prindi ndërhyn me këshilla ose kriticizëm.',
    wrongApproach: 'Ndërhyrja e shpejtë: "Duhej të kishe bërë..." bën që adoleshenti të mbyllë veten.',
    steps: [
      'Vëndos gjithçka mënjanë dhe drejto trupin kah fëmija',
      'Dëgjo pa ndërhyrë, vetëm "po", "kuptoj", "vazhdo"',
      'Para se të japësh mendim, pyet: "Doni që të dëgjoj apo të ndihmoj?"',
      'Nëse kërkon ndihmë, paraqit një ide me ton pyetës, jo urdhëror',
    ],
    example: 'Kur Besa thotë "nuk dua të shkoj në shkollë", mos pyt "pse?" menjëherë. Thuaj: "Tregomë më shumë."',
    tip: 'Adoleshentët ndërtojnë identitetin duke folur. Prindi që dëgjon bëhet besimtari numër 1.',
  },
  {
    id: 4, categoryId: 'bullying', emoji: '📋',
    title: 'Protokolli i Raportimit Korrekt',
    situation: 'Fëmija ka treguar raste bullizmi dhe prindi nuk di si të veprojë me shkollën.',
    wrongApproach: 'Thirrja e drejtpërdrejtë agresive te shkolla ose minimizimi i situatës.',
    steps: [
      'Dokumento çdo incident me datë, vend, persona dhe çfarë ndodhi saktësisht',
      'Kërko takim me mësuesin drejtues, jo me drejtuesin menjëherë',
      'Shpreh shqetësimin me faktet, jo me emocione: "Kjo ka ndodhur 3 herë..."',
      'Kërko plan konkret: kush monitoron, çfarë ndryshon, kur bëjmë vlerësimin',
    ],
    example: 'Mani i thotë mësuesit: "Keni datat. Mund të flasim se çfarë masash do të merren brenda kësaj jave?"',
    tip: 'Bashkëpunimi me shkollën është efektiv vetëm kur prindi qëndron faktik dhe i orientuar drejt zgjidhjes.',
  },
  {
    id: 5, categoryId: 'kids-6-12', emoji: '⏰',
    title: 'Koha e Veçantë 1-me-1',
    situation: 'Fëmija kërkon vëmendje vazhdimisht ose ka sjellje problematike për të tërhequr vëmendjen.',
    wrongApproach: 'Prindi jep vëmendje vetëm kur sjellja është negative dhe kështu e përforcon pa e ditur.',
    steps: [
      'Cakto 15-20 minuta çdo ditë vetëm me atë fëmijë, pa telefon',
      'Lëre atë të zgjedhë aktivitetin brenda kufijve të arsyeshëm',
      'Ndiq udhëheqjen e tij/saj, mos mëso, mos korrekto',
      'Emërto pozitivisht: "Shumë argëtuese kjo kohë me ty"',
    ],
    example: 'Dita "Koha e Teës" çdo të hënë pas shkollës: vetëm ajo zgjedh si e kalon. Brenda 2 javësh sjelljet kërkuese ulen.',
    tip: 'Edhe 15 minuta cilësore janë më të fuqishme se 3 orë vëmendje gjysmake.',
  },
  {
    id: 6, categoryId: 'teens', emoji: '📝',
    title: 'Kontrata e Bashkëpunimit',
    situation: 'Debat i vazhdueshëm rreth rregullave: ora e kthimit, telefoni, detyrat.',
    wrongApproach: 'Prindi imponon rregullat njëanshëm dhe adoleshenti i sheh si armik.',
    steps: [
      'Propozoni bashkë-krijimin: "Le të shkruajmë se çfarë funksionon për të dy"',
      'Lëre adoleshentin të propozojë kushtet e tij/saj: shumë janë të arsyeshme',
      'Negocioji ato që nuk pranohen me arsye, jo me autoritet',
      'Shkruaj kontratën dhe nënshkruani të dy. Rishikoni çdo muaj.',
    ],
    example: 'Ora e kthimit e propozuar nga Aldi: 22:30. E jja e prindërve: 22:00. Kompromisi: 22:15 me njoftim nëse vonon.',
    tip: 'Adoleshentët zbatojnë rregullat që kanë ndihmuar t\'i krijojnë: kjo është psikologji e thjeshtë.',
  },
  {
    id: 7, categoryId: 'special-needs', emoji: '🖼️',
    title: 'Sistemet Vizuale të Komunikimit',
    situation: 'Fëmija ka vështirësi të ndjekë udhëzimet verbale dhe bëhet i frustuar.',
    wrongApproach: 'Prindi ripërsërit udhëzimet me zë më të lartë dhe rrit ankthin.',
    steps: [
      'Krijo tabela vizuale për rutina: figura ose foto të aktiviteteve',
      'Përdor lista "bëj-bëra" me kutiza që fëmija mund t\'i shënojë',
      'Para tranzicioneve, paralajmëro me kohra: "Pas 5 minutash...", "2 minuta..."',
      'Vlerëso çdo hap, jo vetëm rezultatin final',
    ],
    example: 'Rutina e mëngjesit e Elgës: 6 foto të laminuara në mur: zgjohem, lahem, vishem, haj, çantë, dalim. Asnjë fjalë e nevojshme.',
    tip: 'Sistemet vizuale nuk janë vetëm për fëmijët me nevoja speciale: funksionojnë për të gjithë.',
  },
  {
    id: 8, categoryId: 'first-time', emoji: '🧘',
    title: 'Teknika 5-5-5 e Qetësimit',
    situation: 'Prindi humbet kontrollin emocional kur fëmija bërtet apo ka krizë.',
    wrongApproach: 'Prindi reagon menjëherë me frustracion dhe eskalon situatën.',
    steps: [
      'Ndalo dhe bëj 5 frymëmarrje të thella (4 sek brenda, 4 sek jashtë)',
      'Pyet veten 5 sekonda: "A do të ketë rëndësi kjo pas 5 vitesh?"',
      'Zgjidh 5 fjalë qetësuese për veten: "Mund ta bëj. Fëmija ka nevojë për mua të qetë."',
      'Kthehu te fëmija vetëm kur je i/e gatshëm: fëmijët ndjejnë energjinë',
    ],
    example: 'Kur Rikaldo bërtet për 20 minuta, Arjana del 2 minuta, bën frymëmarrjet dhe kthehet me "Hej, shoh se je shumë i frustruar."',
    tip: 'Rregullimi yt emocional është rregullimi i fëmijës tënd. Nuk mund të japësh çfarë nuk ke.',
  },
]

// ── AI EXAMPLE PROMPTS ────────────────────────────────────────────────────────
export const AI_PROMPTS = [
  'Fëmija im 8 vjeç ka nisur të gënjejë shpesh. Si të reagoj?',
  'Si t\'i flas adoleshentit tim kur nuk dëgjon asgjë?',
  'Fëmija im po viktimzohet në shkollë. Çfarë duhet të bëj?',
  'Si ta ndihmoj fëmijën të bëjë detyrat pa konflikte?',
  'Djali im 5 vjeç ka humbje temperamenti të shpeshta. Normal?',
  'Si të vendos kufijtë me telefonin e adoleshentit tim?',
]

// ── AI RESPONSE GENERATOR ─────────────────────────────────────────────────────
export function generateParentingResponse(prompt) {
  const lower = prompt.toLowerCase()

  if (lower.includes('gënj') || lower.includes('genj')) {
    return {
      empathy: 'E kuptoj shqetësimin: gënjeshtra te fëmijët është një nga sjelljet që vë prindërit në pozitë të vështirë.',
      steps: [
        'Mos reago me zemërim të menjëhershëm: reaksioni i fortë i bën fëmijët të gënjejnë më shumë.',
        'Krijoni hapësirë ku e vërteta nuk ndëshkohet gjithmonë: "Nëse tregon të vëretën, bisedojmë."',
        'Kupto motivin: fëmijët gënjejnë nga frika, jo nga keqdashja.',
      ],
      tip: 'Fëmijët që gënjejnë shpesh kanë mësuar se e vërteta sjell pasoja të rënda. Ndrysho pasojën, jo vetëm sjelljen.',
      followUp: 'Mund të tregosh një situatë konkrete kur ka gënjyer? Kjo do të ndihmojë të japim udhëzim më specifik.',
    }
  }
  if (lower.includes('dëgjon') || lower.includes('degjoj') || lower.includes('adolesh') || lower.includes('teen')) {
    return {
      empathy: 'Komunikimi me adoleshentët është sfida numër 1 e prindëve dhe kjo ka arsye neurologjike, jo vetëm sjellje.',
      steps: [
        'Zgjidh momentin e duhur: jo gjatë emocionit dhe jo kur hyjnë në shtëpi.',
        'Fillo me kuriozitet, jo me kritikë: "Çfarë ndodhi sot?" jo "Pse bëre kështu?"',
        'Pranoje perspektivën e tij/saj para se të japësh të tënden.',
      ],
      tip: 'Truri i adoleshentit proceson kritikën si sulm. Lidhu emocionalisht para se të edukosh.',
      followUp: 'Sa vjeç është fëmija dhe cili është tema kryesore e mosmarrëveshjes?',
    }
  }
  if (lower.includes('bulliz') || lower.includes('viktimiz') || lower.includes('bullying')) {
    return {
      empathy: 'Kjo është nga situatat më të dhimbshme për çdo prind. Instinkti yt mbrojtës është plotësisht normal.',
      steps: [
        'Dëgjo pa ndërhyrë: lëre fëmijën të tregojë gjithçka pa e ndërprerë.',
        'Vërteto: "Bëre mirë që me tregove. Kjo nuk është faji yt."',
        'Dokumento incidentet me detaje: kjo nevojitet nëse ndërhyn shkolla.',
      ],
      tip: 'Mos i thuaj "shpërfille": kjo i dërgon fëmijës mesazhin se problemi nuk ka rëndësi.',
      followUp: 'A e di fëmija se po kërkon ndihmë, apo ka kërkuar të mos flasësh me askënd?',
    }
  }
  if (lower.includes('detyra') || lower.includes('shkollë') || lower.includes('shkolle')) {
    return {
      empathy: 'Beteja e detyrave është ndër problemet më të shpeshta dhe lodhëse për prindërit.',
      steps: [
        'Krijoni "hapësirën e detyrave": vend specifik, pa rrëmujë, çdo ditë në të njëjtën orë.',
        'Mos qëndroni pranë: largohuni pas 5 minutave. Prania e tepërt rrit varësinë.',
        'Vlerësoni përpjekjen, jo rezultatin: "Punove 30 minuta pa ndërprerje, kjo është e rëndësishme."',
      ],
      tip: 'Fëmijët bëjnë detyra më mirë kur ndiejnë kompetencë, jo kur ndiejnë mbikëqyrje.',
      followUp: 'Sa vjeç është fëmija dhe cilat lëndë shkaktojnë më shumë rezistencë?',
    }
  }
  if (lower.includes('humbje temperamenti') || lower.includes('krizë') || lower.includes('bërtit') || lower.includes('tantrum')) {
    return {
      empathy: 'Humbja e temperamentit te fëmijët e vegjël është zhvillim absolutisht normal dhe absolutisht shterues për prindërit.',
      steps: [
        'Qëndro i/e pranishëm fizikisht por mos fol gjatë krizës: truri i vogël nuk proceson fjalë.',
        'Pasi qetësohet (5-10 min), emërto: "Ishe shumë i frustruar. E kuptoj."',
        'Zbulo triggerin: lodhja, uria dhe ndryshimet e papritura janë shkaqet kryesore.',
      ],
      tip: 'Qëllimi nuk është të ndalësh krizën, por të krijosh lidhje të sigurt gjatë saj.',
      followUp: 'Sa shpesh ndodhin dhe në cilat situata zakonisht?',
    }
  }
  if (lower.includes('telefon') || lower.includes('ekran') || lower.includes('internet') || lower.includes('social')) {
    return {
      empathy: 'Teknologjia është sfida e re e prindërisë dhe nuk ka udhëzues të qartë. Nuk jeni vetëm.',
      steps: [
        'Bëni "kontratë familjare" të ekraneve: të gjithë, jo vetëm fëmijët.',
        'Shndërroni kufirin nga "pa telefon" në "kohë aktive vs pasive".',
        'Interesohu çfarë bën online: fëmijët flasin me prindërit kuriozë, jo gjykues.',
      ],
      tip: 'Ndalimi absolut krijon tërhiqje. Edukimi i vetë-rregullimit është investim afatgjatë.',
      followUp: 'Sa vjeç është dhe çfarë përdor kryesisht: lojëra, video, rrjete sociale?',
    }
  }

  return {
    empathy: 'Faleminderit që ndajë këtë situatë. Kjo tregon se je prind i kujdesshëm dhe i angazhuar.',
    steps: [
      'Para çdo ndërhyrjeje, vëzhgo pa gjykuar: çfarë saktësisht po ndodh dhe kur?',
      'Kuptoje nevojën pas sjelljes: të gjitha sjelljet janë komunikim.',
      'Reagoni me qetësi të qëllimshme: truri i fëmijës kalibrohet me tonin tënd.',
    ],
    tip: 'Çdo sjellje e fëmijës ka një nevojë të pathënë pas saj. Gjeni nevojën, jo sjelljen.',
    followUp: 'Mund të tregosh më shumë detaje? Sa shpesh ndodh dhe çfarë zakonisht e paraprin?',
  }
}
