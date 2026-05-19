// Master manifest of all editable text IDs across the platform.
// Each entry maps to the `id` prop of an <EditableText> component.
// The admin panel reads this to show every text even before it's been edited.
export const SITE_TEXTS = [
  // ── Landing › Hero ────────────────────────────────────────────────────────
  { id: 'hero-badge',        section: 'Landing › Hero',     label: 'Badge tekst',            default: 'Platforma #1 e shëndetit mendor',                                                                                                                     defaultEn: 'Platform #1 for mental health' },
  { id: 'hero-h1-line1',    section: 'Landing › Hero',     label: 'Titull rresht 1',        default: 'Mendo më',                                                                                                                                             defaultEn: 'Think more' },
  { id: 'hero-h1-line2',    section: 'Landing › Hero',     label: 'Titull rresht 2 (ngjyrë)', default: 'qartë.',                                                                                                                                             defaultEn: 'clearly.' },
  { id: 'hero-h1-line3',    section: 'Landing › Hero',     label: 'Titull rresht 3',        default: 'Ndihu më',                                                                                                                                             defaultEn: 'Feel' },
  { id: 'hero-h1-line4',    section: 'Landing › Hero',     label: 'Titull rresht 4 (ngjyrë)', default: 'mirë.',                                                                                                                                              defaultEn: 'better.' },
  { id: 'hero-subtitle',    section: 'Landing › Hero',     label: 'Nëntitull',              default: 'NeuroSpace bashkon psikologji klinike, AI dhe gjurmim të humorit — mbështetje e vërtetë mendore, çdo ditë, në shqip.',                                defaultEn: 'NeuroSpace combines clinical psychology, AI and mood tracking — real mental support, every day, in Albanian.' },
  { id: 'hero-cta1',        section: 'Landing › Hero',     label: 'Buton CTA 1',           default: 'Fillo falas — sot',                                                                                                                                    defaultEn: 'Start free — today' },
  { id: 'hero-cta2',        section: 'Landing › Hero',     label: 'Buton CTA 2',           default: 'Rezervo takim',                                                                                                                                        defaultEn: 'Book appointment' },
  { id: 'hero-social-proof',section: 'Landing › Hero',     label: 'Social proof',           default: 'Bashkuar nga 25,000+ njerëz',                                                                                                                         defaultEn: 'Joined by 25,000+ people' },

  // ── Landing › Hero Stats ──────────────────────────────────────────────────
  { id: 'hero-stat-0-value',section: 'Landing › Hero Stats', label: 'Stat 1 vlera',        default: '10K+',                                                                                                                                                 defaultEn: '10K+' },
  { id: 'hero-stat-0-label',section: 'Landing › Hero Stats', label: 'Stat 1 etiketa',      default: 'Artikuj & Burime',                                                                                                                                     defaultEn: 'Articles & Resources' },
  { id: 'hero-stat-1-value',section: 'Landing › Hero Stats', label: 'Stat 2 vlera',        default: '50+',                                                                                                                                                  defaultEn: '50+' },
  { id: 'hero-stat-1-label',section: 'Landing › Hero Stats', label: 'Stat 2 etiketa',      default: 'Eksperimente Labs',                                                                                                                                    defaultEn: 'Labs Experiments' },
  { id: 'hero-stat-2-value',section: 'Landing › Hero Stats', label: 'Stat 3 vlera',        default: '25K+',                                                                                                                                                 defaultEn: '25K+' },
  { id: 'hero-stat-2-label',section: 'Landing › Hero Stats', label: 'Stat 3 etiketa',      default: 'Anëtarë Aktivë',                                                                                                                                      defaultEn: 'Active Members' },
  { id: 'hero-stat-3-value',section: 'Landing › Hero Stats', label: 'Stat 4 vlera',        default: '4.9★',                                                                                                                                                 defaultEn: '4.9★' },
  { id: 'hero-stat-3-label',section: 'Landing › Hero Stats', label: 'Stat 4 etiketa',      default: 'Vlerësim mesatar',                                                                                                                                     defaultEn: 'Average rating' },

  // ── Landing › Trust Bar ───────────────────────────────────────────────────
  { id: 'trust-0-label',    section: 'Landing › Trust Bar', label: 'Besimi 1',             default: 'Konfidenciale 100%',                                                                                                                                   defaultEn: '100% Confidential' },
  { id: 'trust-1-label',    section: 'Landing › Trust Bar', label: 'Besimi 2',             default: '25,000+ anëtarë',                                                                                                                                      defaultEn: '25,000+ members' },
  { id: 'trust-2-label',    section: 'Landing › Trust Bar', label: 'Besimi 3',             default: 'Vlerësim 4.9/5',                                                                                                                                       defaultEn: 'Rating 4.9/5' },
  { id: 'trust-3-label',    section: 'Landing › Trust Bar', label: 'Besimi 4',             default: 'Psikologë të licencuar',                                                                                                                               defaultEn: 'Licensed psychologists' },

  // ── Landing › Problem Section ─────────────────────────────────────────────
  { id: 'problem-h2',        section: 'Landing › Problemi',  label: 'Titulli rresht 1',     default: 'Informacion pa sistem =',                                                                                                                              defaultEn: 'Information without a system =' },
  { id: 'problem-h2-accent', section: 'Landing › Problemi',  label: 'Titulli rresht 2 (kuq)', default: 'kaos kognitiv',                                                                                                                                    defaultEn: 'cognitive chaos' },
  { id: 'problem-sub',      section: 'Landing › Problemi',  label: 'Nëntitulli',           default: 'Shumë njerëz kanë akses në informacion, por pak dijnë si ta shndërrojnë atë në aftësi të vërteta.',                                                  defaultEn: 'Many people have access to information, but few know how to turn it into real skills.' },
  { id: 'problem-item-0',   section: 'Landing › Problemi',  label: 'Problemi 1',           default: 'Mëson shumë, por nuk mban mend asgjë',                                                                                                                defaultEn: 'You learn a lot, but remember nothing after a few days.' },
  { id: 'problem-item-1',   section: 'Landing › Problemi',  label: 'Problemi 2',           default: 'Distraktimet marrin 70% të ditës',                                                                                                                    defaultEn: 'Distractions take up 70% of your day.' },
  { id: 'problem-item-2',   section: 'Landing › Problemi',  label: 'Problemi 3',           default: 'Ka burime kudo — askush nuk të tregon si t\'i filtrojë',                                                                                             defaultEn: 'Resources are everywhere, but no one tells you how to filter them.' },
  { id: 'problem-item-3',   section: 'Landing › Problemi',  label: 'Problemi 4',           default: 'Motivimi vjen e shkon — nuk ka sistem',                                                                                                               defaultEn: 'Motivation comes and goes — there is no sustainable system.' },

  // ── Landing › Categories ──────────────────────────────────────────────────
  { id: 'cats-h2',          section: 'Landing › Kategoritë', label: 'Titulli rresht 1',    default: 'Gjithçka që nevojitet,',                                                                                                                              defaultEn: 'Everything you need,' },
  { id: 'cats-h2-accent',   section: 'Landing › Kategoritë', label: 'Titulli rresht 2 (gradient)', default: 'në një vend',                                                                                                                                defaultEn: 'in one place' },
  { id: 'cats-sub',         section: 'Landing › Kategoritë', label: 'Nëntitulli',          default: 'Nga neuroshkenca bazë te eksperimentet avancuara — struktura e ndërtuar sipas mënyrës si funksionon truri.',                                           defaultEn: 'From basic neuroscience to advanced experiments — structure built around how the brain works.' },

  // ── Landing › How It Works ────────────────────────────────────────────────
  { id: 'how-h2',           section: 'Landing › Si Funksionon', label: 'Titulli rresht 1',  default: '3 hapa drejt',                                                                                                                                        defaultEn: '3 steps toward' },
  { id: 'how-h2-accent',    section: 'Landing › Si Funksionon', label: 'Titulli rresht 2 (gradient)', default: 'zhvillimit real',                                                                                                                          defaultEn: 'real development' },
  { id: 'how-0-title',      section: 'Landing › Si Funksionon', label: 'Hapi 1 titulli',   default: 'Zgjidh fushën tënde',                                                                                                                                  defaultEn: 'Choose your field' },
  { id: 'how-0-desc',       section: 'Landing › Si Funksionon', label: 'Hapi 1 description', default: 'Fillo me kategorinë që të intereson më shumë — nga neuroshkenca te produktiviteti.',                                                                 defaultEn: 'Start with the category that interests you most — from neuroscience to productivity.' },
  { id: 'how-1-title',      section: 'Landing › Si Funksionon', label: 'Hapi 2 titulli',   default: 'Mëso sipas shkencës',                                                                                                                                  defaultEn: 'Learn through science' },
  { id: 'how-1-desc',       section: 'Landing › Si Funksionon', label: 'Hapi 2 description', default: 'Çdo përmbajtje ndërtohet mbi kërkime të vërteta shkencore, jo mite apo klishe.',                                                                    defaultEn: 'Every piece of content is built on real scientific research, not myths or clichés.' },
  { id: 'how-2-title',      section: 'Landing › Si Funksionon', label: 'Hapi 3 titulli',   default: 'Gjurmo progresin tënd',                                                                                                                                defaultEn: 'Track your progress' },
  { id: 'how-2-desc',       section: 'Landing › Si Funksionon', label: 'Hapi 3 description', default: 'Streak ditor, sfida dhe community mbajnë motivimin tuaj gjithmonë lart.',                                                                            defaultEn: 'Daily streaks, challenges and community keep your motivation always high.' },

  // ── Landing › Differentiators ─────────────────────────────────────────────
  { id: 'diff-badge',       section: 'Landing › Pse NeuroSpace', label: 'Badge tekst',        default: 'Pse NeuroSpace',                                                                                                                              defaultEn: 'Why NeuroSpace' },
  { id: 'diff-h2-line1',   section: 'Landing › Pse NeuroSpace', label: 'Titull rresht 1',    default: 'Jo vetëm',                                                                                                                                            defaultEn: 'Not just' },
  { id: 'diff-h2-line2',   section: 'Landing › Pse NeuroSpace', label: 'Titull rresht 2 (ngjyrë)', default: 'përmbajtje —',                                                                                                                                  defaultEn: 'content —' },
  { id: 'diff-h2-line3',   section: 'Landing › Pse NeuroSpace', label: 'Titull rresht 3',    default: 'por transformim',                                                                                                                                      defaultEn: 'but transformation' },
  { id: 'diff-h2',          section: 'Landing › Pse NeuroSpace', label: 'Titulli seksionit', default: 'Jo vetëm përmbajtje — por transformim',                                                                                                              defaultEn: 'Not just content — but transformation' },
  { id: 'diff-sub',         section: 'Landing › Pse NeuroSpace', label: 'Nëntitulli',       default: 'Portalet tjera ofrojnë artikuj. NeuroSpace ofron një sistem të plotë — nga teoria te praktika, nga leximi te zakoni i qëndrueshëm.',                  defaultEn: 'Other portals offer articles. NeuroSpace offers a complete system — from theory to practice, from reading to lasting habit.' },
  { id: 'diff-cta',         section: 'Landing › Pse NeuroSpace', label: 'Buton CTA',        default: 'Fillo pa kushte',                                                                                                                                     defaultEn: 'Start with no strings attached' },
  { id: 'diff-item-0-title',section: 'Landing › Pse NeuroSpace', label: 'Avantazhi 1 titulli', default: 'Neural Learning Paths',                                                                                                                            defaultEn: 'Neural Learning Paths' },
  { id: 'diff-item-0-desc', section: 'Landing › Pse NeuroSpace', label: 'Avantazhi 1 description', default: 'Rrugë mësimi të personalizuara bazuar në parimet e neuroplasticitetit — jo kurse lineare, por sisteme adaptive.',                              defaultEn: 'Personalized learning paths based on neuroplasticity principles — not linear courses, but adaptive systems.' },
  { id: 'diff-item-1-title',section: 'Landing › Pse NeuroSpace', label: 'Avantazhi 2 titulli', default: 'Interactive Labs',                                                                                                                                 defaultEn: 'Interactive Labs' },
  { id: 'diff-item-1-desc', section: 'Landing › Pse NeuroSpace', label: 'Avantazhi 2 description', default: 'Ushtrime dhe eksperimente të vërteta — jo vetëm lexim, por veprim i dokumentuar me rezultate të matshme.',                                     defaultEn: 'Real exercises and experiments — not just reading, but documented action with measurable results.' },
  { id: 'diff-item-2-title',section: 'Landing › Pse NeuroSpace', label: 'Avantazhi 3 titulli', default: 'Spaced Repetition Engine',                                                                                                                         defaultEn: 'Spaced Repetition Engine' },
  { id: 'diff-item-2-desc', section: 'Landing › Pse NeuroSpace', label: 'Avantazhi 3 description', default: 'Sistemi ynë i brendshëm i kujtesës siguron që çfarë mëson sot, e mban edhe pas 6 muajsh.',                                                    defaultEn: 'Our internal memory system ensures what you learn today, you retain even after 6 months.' },
  { id: 'diff-item-3-title',section: 'Landing › Pse NeuroSpace', label: 'Avantazhi 4 titulli', default: 'Community-Powered Learning',                                                                                                                       defaultEn: 'Community-Powered Learning' },
  { id: 'diff-item-3-desc', section: 'Landing › Pse NeuroSpace', label: 'Avantazhi 4 description', default: 'Grupe studimi, sfida kolektive dhe mentorë realë — sepse mësohet më mirë bashkë.',                                                             defaultEn: 'Study groups, collective challenges and real mentors — because learning together works better.' },
  { id: 'diff-item-4-title',section: 'Landing › Pse NeuroSpace', label: 'Avantazhi 5 titulli', default: 'AI Tutor Personal',                                                                                                                                defaultEn: 'Personal AI Tutor' },
  { id: 'diff-item-4-desc', section: 'Landing › Pse NeuroSpace', label: 'Avantazhi 5 description', default: 'Rekomandime të personalizuara bazuar në interesat, historikun dhe qëllimet e çdo anëtari.',                                                   defaultEn: 'Personalized recommendations based on the interests, history and goals of each member.' },

  // ── Landing › Testimonials ────────────────────────────────────────────────
  { id: 'testimonials-h2',        section: 'Landing › Dëshmi',    label: 'Titulli rresht 1',      default: 'Çfarë thonë',                                                                                                                                   defaultEn: 'What' },
  { id: 'testimonials-h2-accent', section: 'Landing › Dëshmi',    label: 'Titulli rresht 2 (gradient)', default: 'anëtarët tanë',                                                                                                                            defaultEn: 'our members say' },
  { id: 'testimonial-0-text',   section: 'Landing › Dëshmi',    label: 'Dëshmi 1 teksti',         default: 'NeuroSpace ndryshoi mënyrën time të studimit. Rezultatet u dyfishuan brenda 3 javësh me teknikat e tyre të bazuara në neuroshkencë.',            defaultEn: 'NeuroSpace changed the way I study. Results doubled within 3 weeks with their neuroscience-based techniques.' },
  { id: 'testimonial-0-name',   section: 'Landing › Dëshmi',    label: 'Dëshmi 1 emri',           default: 'Arjeta M.',                                                                                                                                     defaultEn: 'Arjeta M.' },
  { id: 'testimonial-0-role',   section: 'Landing › Dëshmi',    label: 'Dëshmi 1 roli',           default: 'Studente Mjekësie',                                                                                                                             defaultEn: 'Medical Student' },
  { id: 'testimonial-1-text',   section: 'Landing › Dëshmi',    label: 'Dëshmi 2 teksti',         default: 'Si entrepreneur, "Deep Work" dhe sistemet e fokusit nga NeuroSpace u bënë fondamenti i çdo dite produktive. Jashtzakonisht praktike.',          defaultEn: 'As an entrepreneur, "Deep Work" and focus systems from NeuroSpace became the foundation of every productive day. Incredibly practical.' },
  { id: 'testimonial-1-name',   section: 'Landing › Dëshmi',    label: 'Dëshmi 2 emri',           default: 'Blerim K.',                                                                                                                                     defaultEn: 'Blerim K.' },
  { id: 'testimonial-1-role',   section: 'Landing › Dëshmi',    label: 'Dëshmi 2 roli',           default: 'Themelues Startup',                                                                                                                             defaultEn: 'Startup Founder' },
  { id: 'testimonial-2-text',   section: 'Landing › Dëshmi',    label: 'Dëshmi 3 teksti',         default: 'Eksperimentet e Labs janë unik. Nuk ke ku gjet kurrë kaq shumë material praktik dhe shkencor bashkë në gjuhën shqipe.',                         defaultEn: 'The Labs experiments are unique. You won\'t find anywhere so much practical and scientific material together in the Albanian language.' },
  { id: 'testimonial-2-name',   section: 'Landing › Dëshmi',    label: 'Dëshmi 3 emri',           default: 'Drita H.',                                                                                                                                     defaultEn: 'Drita H.' },
  { id: 'testimonial-2-role',   section: 'Landing › Dëshmi',    label: 'Dëshmi 3 roli',           default: 'Mësuese & Trainer',                                                                                                                             defaultEn: 'Teacher & Trainer' },

  // ── Landing › CTA ─────────────────────────────────────────────────────────
  { id: 'cta-h2',           section: 'Landing › CTA',       label: 'CTA titulli',            default: 'Gati të fillosh?',                                                                                                                                   defaultEn: 'Ready to start?' },
  { id: 'cta-sub',          section: 'Landing › CTA',       label: 'CTA nëntitulli',         default: 'Mbi 25,000 njerëz tashmë po zhvillojnë mendjen e tyre me NeuroSpace. Sot mund të fillosh edhe ti.',                                                  defaultEn: 'Over 25,000 people are already developing their minds with NeuroSpace. Today you can start too.' },
  { id: 'cta-btn',          section: 'Landing › CTA',       label: 'CTA buton',              default: 'Fillo falas tani',                                                                                                                                   defaultEn: 'Start free now' },
  { id: 'cta-perk-0',       section: 'Landing › CTA',       label: 'Perk 1',                 default: 'Pa kartë krediti',                                                                                                                                   defaultEn: 'No credit card' },
  { id: 'cta-perk-1',       section: 'Landing › CTA',       label: 'Perk 2',                 default: 'Akses i plotë 14 ditë',                                                                                                                              defaultEn: 'Full access 14 days' },
  { id: 'cta-perk-2',       section: 'Landing › CTA',       label: 'Perk 3',                 default: 'Anulo kur të duash',                                                                                                                                 defaultEn: 'Cancel anytime' },

  // ── Landing › Footer ──────────────────────────────────────────────────────
  { id: 'footer-brand',     section: 'Landing › Footer',    label: 'Brand emri',             default: 'NeuroSpace',                                                                                                                                         defaultEn: 'NeuroSpace' },
  { id: 'footer-tagline',   section: 'Landing › Footer',    label: 'Footer tagline',         default: 'Platforma e parë shqiptare e zhvillimit të mendjes bazuar në neuroshkencë. Mëso si funksionon truri yt.',                                             defaultEn: 'The first Albanian platform for mind development based on neuroscience. Learn how your brain works.' },
  { id: 'footer-copyright', section: 'Landing › Footer',    label: 'Copyright',              default: 'NeuroSpace. Të gjitha të drejtat e rezervuara.',                                                                                                     defaultEn: 'NeuroSpace. All rights reserved.' },

  // ── Landing › Nav ─────────────────────────────────────────────────────────
  { id: 'nav-brand',        section: 'Landing › Nav',       label: 'Brand emri',             default: 'NeuroSpace',                                                                                                                                         defaultEn: 'NeuroSpace' },
  { id: 'nav-library',      section: 'Landing › Nav',       label: 'Nav: Biblioteka',        default: 'Biblioteka',                                                                                                                                         defaultEn: 'Library' },
  { id: 'nav-ask',          section: 'Landing › Nav',       label: 'Nav: Ekspertë',          default: 'Ekspertë',                                                                                                                                           defaultEn: 'Experts' },
  { id: 'nav-book',         section: 'Landing › Nav',       label: 'Nav: Rezervo Takim',     default: 'Rezervo Takim',                                                                                                                                      defaultEn: 'Book Appointment' },
  { id: 'nav-tests',        section: 'Landing › Nav',       label: 'Nav: Testet',            default: 'Testet',                                                                                                                                             defaultEn: 'Tests' },
  { id: 'nav-parenting',    section: 'Landing › Nav',       label: 'Nav: Prindërit',         default: 'Prindërit',                                                                                                                                          defaultEn: 'Parenting' },
  { id: 'nav-pricing',      section: 'Landing › Nav',       label: 'Nav: Çmimet',            default: 'Çmimet',                                                                                                                                             defaultEn: 'Pricing' },
  { id: 'nav-login',        section: 'Landing › Nav',       label: 'Nav: Hyr',               default: 'Hyr',                                                                                                                                                defaultEn: 'Log in' },
  { id: 'nav-register',     section: 'Landing › Nav',       label: 'Nav: Regjistrohu',       default: 'Regjistrohu falas',                                                                                                                                  defaultEn: 'Sign up free' },

  // ── Sidebar ───────────────────────────────────────────────────────────────
  { id: 'sidebar-home',         section: 'Sidebar',         label: 'Home',                   default: 'Home',                                                                                                                                               defaultEn: 'Home' },
  { id: 'sidebar-chat',         section: 'Sidebar',         label: 'AI Chat',                default: 'AI Chat',                                                                                                                                            defaultEn: 'AI Chat' },
  { id: 'sidebar-mood',         section: 'Sidebar',         label: 'Humori',                 default: 'Humori',                                                                                                                                             defaultEn: 'Mood' },
  { id: 'sidebar-techniques',   section: 'Sidebar',         label: 'Teknikat',               default: 'Teknikat',                                                                                                                                           defaultEn: 'Techniques' },
  { id: 'sidebar-journal',      section: 'Sidebar',         label: 'Journal',                default: 'Journal',                                                                                                                                            defaultEn: 'Journal' },
  { id: 'sidebar-community',    section: 'Sidebar',         label: 'Komuniteti',             default: 'Komuniteti',                                                                                                                                         defaultEn: 'Community' },
  { id: 'sidebar-blog',         section: 'Sidebar',         label: 'Artikuj',                default: 'Artikuj',                                                                                                                                            defaultEn: 'Articles' },
  { id: 'sidebar-tests',        section: 'Sidebar',         label: 'Testet',                 default: 'Testet',                                                                                                                                             defaultEn: 'Tests' },
  { id: 'sidebar-parenting',    section: 'Sidebar',         label: 'Prindërit',              default: 'Prindërit',                                                                                                                                          defaultEn: 'Parenting' },
  { id: 'sidebar-appointments', section: 'Sidebar',         label: 'Takimet',                default: 'Takimet',                                                                                                                                            defaultEn: 'Appointments' },
  { id: 'sidebar-mainsite',     section: 'Sidebar',         label: 'Faqja kryesore',         default: 'Faqja kryesore',                                                                                                                                     defaultEn: 'Main site' },
  { id: 'sidebar-pricing',      section: 'Sidebar',         label: 'Planet & Çmimet',        default: 'Planet & Çmimet',                                                                                                                                    defaultEn: 'Plans & Pricing' },
  { id: 'sidebar-admin',        section: 'Sidebar',         label: 'Paneli Admin',           default: 'Paneli Admin',                                                                                                                                       defaultEn: 'Admin Panel' },
  { id: 'sidebar-streak-sub',   section: 'Sidebar',         label: 'Streak nëntitulli',      default: 'Vazhdo kështu!',                                                                                                                                     defaultEn: 'Keep it up!' },

  // ── Pricing ───────────────────────────────────────────────────────────────
  { id: 'pricing-h1',           section: 'Pricing',         label: 'Titulli kryesor',        default: 'Zgjidhni planin tuaj',                                                                                                                               defaultEn: 'Choose your plan' },
  { id: 'pricing-sub',          section: 'Pricing',         label: 'Nëntitulli',             default: 'Filloni falas dhe kaloni në Pro kur të jeni gati. Pa kartë krediti.',                                                                                defaultEn: 'Start free and upgrade to Pro when you\'re ready. No credit card.' },
  { id: 'pricing-annual-note',  section: 'Pricing',         label: 'Nota vjetore',           default: 'Kurseni 17% me planin vjetor',                                                                                                                       defaultEn: 'Save 17% with the annual plan' },
  { id: 'pricing-toggle-monthly',section:'Pricing',         label: 'Toggle: Mujor',          default: 'Mujor',                                                                                                                                              defaultEn: 'Monthly' },
  { id: 'pricing-toggle-annual', section:'Pricing',         label: 'Toggle: Vjetor',         default: 'Vjetor',                                                                                                                                             defaultEn: 'Annual' },
  { id: 'pricing-table-label',  section: 'Pricing',         label: 'Etiketa tabele krahasimi', default: 'Krahasim i plotë i planeve',                                                                                                                       defaultEn: 'Full plan comparison' },
  { id: 'pricing-faq-title',    section: 'Pricing',         label: 'FAQ titulli',            default: 'Pyetje të shpeshta',                                                                                                                                 defaultEn: 'Frequently asked questions' },
  { id: 'pricing-faq-0-q',      section: 'Pricing',         label: 'FAQ 1 pyetja',           default: 'A mund ta anuloj kur të dua?',                                                                                                                      defaultEn: 'Can I cancel whenever I want?' },
  { id: 'pricing-faq-0-a',      section: 'Pricing',         label: 'FAQ 1 përgjigja',        default: 'Po, mund të anuloni abonimin tuaj në çdo kohë pa asnjë penalitet.',                                                                                  defaultEn: 'Yes, you can cancel your subscription at any time without any penalty.' },
  { id: 'pricing-faq-1-q',      section: 'Pricing',         label: 'FAQ 2 pyetja',           default: 'A ka provë falas?',                                                                                                                                  defaultEn: 'Is there a free trial?' },
  { id: 'pricing-faq-1-a',      section: 'Pricing',         label: 'FAQ 2 përgjigja',        default: 'Plani Free është gjithmonë falas dhe nuk kërkon kartë krediti.',                                                                                     defaultEn: 'The Free plan is always free and requires no credit card.' },
  { id: 'pricing-faq-2-q',      section: 'Pricing',         label: 'FAQ 3 pyetja',           default: 'Si funksionon faturimi?',                                                                                                                            defaultEn: 'How does billing work?' },
  { id: 'pricing-faq-2-a',      section: 'Pricing',         label: 'FAQ 3 përgjigja',        default: 'Faturoheni çdo muaj ose çdo vit, varësisht nga plani i zgjedhur.',                                                                                  defaultEn: 'You are billed monthly or annually, depending on the plan you choose.' },

  // ── Home (app) ─────────────────────────────────────────────────────────────
  { id: 'home-greeting-morning',  section: 'Home',          label: 'Përshëndetje mëngjes',   default: 'Mëngjes i mirë',                                                                                                                                     defaultEn: 'Good morning' },
  { id: 'home-greeting-noon',     section: 'Home',          label: 'Përshëndetje pasdite',   default: 'Mirë u pafshim',                                                                                                                                     defaultEn: 'Good afternoon' },
  { id: 'home-greeting-evening',  section: 'Home',          label: 'Përshëndetje mbrëmje',   default: 'Mbrëmje e mirë',                                                                                                                                     defaultEn: 'Good evening' },
  { id: 'home-greeting-night',    section: 'Home',          label: 'Përshëndetje natë',      default: 'Natë e qetë',                                                                                                                                        defaultEn: 'Good night' },
  { id: 'home-neuro-msg-0',       section: 'Home',          label: 'Mesazh Neuro 1',         default: 'Përqendrimi yt ka qenë i mirë këtë javë! Provo të bësh një seancë fokus 25-minutëshe tani për të mbajtur ritmin. 💪',                               defaultEn: 'Your focus has been great this week! Try doing a 25-minute focus session now to keep the momentum. 💪' },
  { id: 'home-neuro-msg-1',       section: 'Home',          label: 'Mesazh Neuro 2',         default: 'Mos e harro — trupi i yt ka nevojë për pushim po aq sa ka për veprim. Bëj 5 minuta stretch sot. 🧘',                                                defaultEn: 'Don\'t forget — your body needs rest as much as it needs action. Do 5 minutes of stretching today. 🧘' },
  { id: 'home-neuro-msg-2',       section: 'Home',          label: 'Mesazh Neuro 3',         default: 'Ke bërë progres të jashtëzakonshëm! Vazhdimi i shërbimit të rregullt të trurit do të japë rezultate afatgjata. 🚀',                                  defaultEn: 'You have made exceptional progress! Continuing regular brain training will yield long-term results. 🚀' },

  // ── Services Carousel ─────────────────────────────────────────────────────
  { id: 'carousel-h2',         section: 'Carousel Shërbimeve', label: 'Titulli seksionit',  default: 'Çdo gjë që ke nevojë,',                                                                                                                               defaultEn: 'Everything you need,' },
  { id: 'carousel-h2-accent',  section: 'Carousel Shërbimeve', label: 'Titulli accent',     default: 'në një platformë',                                                                                                                                    defaultEn: 'in one platform' },
  { id: 'carousel-sub',        section: 'Carousel Shërbimeve', label: 'Nëntitulli',         default: '6 module të integruara — nga AI Chat te takimet me psikologë të licensuar.',                                                                          defaultEn: '6 integrated modules — from AI Chat to appointments with licensed psychologists.' },
  { id: 'carousel-slide-0-title', section: 'Carousel Shërbimeve', label: 'Slide 1 titulli', default: 'AI Chat Terapeutik',                                                                                                                                  defaultEn: 'Therapeutic AI Chat' },
  { id: 'carousel-slide-0-desc',  section: 'Carousel Shërbimeve', label: 'Slide 1 description', default: 'Bisedoni me asistentin tonë AI të trajnuar në psikologji klinike. Mbështetje 24/7 në gjuhën shqipe.',                                             defaultEn: 'Chat with our AI assistant trained in clinical psychology. Support 24/7 in your language.' },
  { id: 'carousel-slide-1-title', section: 'Carousel Shërbimeve', label: 'Slide 2 titulli', default: 'Moduli Prindëror',                                                                                                                                    defaultEn: 'Parenting Module' },
  { id: 'carousel-slide-1-desc',  section: 'Carousel Shërbimeve', label: 'Slide 2 description', default: 'Udhëzim të bazuar në shkencë për prindërit — nga foshnjëria deri te adoleshenca.',                                                                defaultEn: 'Science-based guidance for parents — from infancy through adolescence.' },
  { id: 'carousel-slide-2-title', section: 'Carousel Shërbimeve', label: 'Slide 3 titulli', default: 'Teste Psikologjike',                                                                                                                                  defaultEn: 'Psychological Tests' },
  { id: 'carousel-slide-2-desc',  section: 'Carousel Shërbimeve', label: 'Slide 3 description', default: 'Teste klinike të validuara — personaliteti, humori dhe funksionimi kognitiv.',                                                                    defaultEn: 'Validated clinical tests — personality, mood and cognitive functioning.' },
  { id: 'carousel-slide-3-title', section: 'Carousel Shërbimeve', label: 'Slide 4 titulli', default: 'Rezervo Takim',                                                                                                                                       defaultEn: 'Book Appointment' },
  { id: 'carousel-slide-3-desc',  section: 'Carousel Shërbimeve', label: 'Slide 4 description', default: 'Lidhuni me psikologë të licensuar. Seanca online ose fizike, fleksibël me orarin tuaj.',                                                         defaultEn: 'Connect with licensed psychologists. Online or in-person sessions, flexible with your schedule.' },
  { id: 'carousel-slide-4-title', section: 'Carousel Shërbimeve', label: 'Slide 5 titulli', default: 'Teknikat & Rritja',                                                                                                                                   defaultEn: 'Techniques & Growth' },
  { id: 'carousel-slide-4-desc',  section: 'Carousel Shërbimeve', label: 'Slide 5 description', default: 'Teknika mindfulness, CBT dhe neurofeedback të adaptuara për jetën moderne.',                                                                      defaultEn: 'Mindfulness, CBT and neurofeedback techniques adapted for modern life.' },
  { id: 'carousel-slide-5-title', section: 'Carousel Shërbimeve', label: 'Slide 6 titulli', default: 'Gjurmim & Analitikë',                                                                                                                                 defaultEn: 'Tracking & Analytics' },
  { id: 'carousel-slide-5-desc',  section: 'Carousel Shërbimeve', label: 'Slide 6 description', default: 'Gjurmoni humorin, gjumin dhe energjinë çdo ditë. Analizë vizuale e progresit tuaj.',                                                             defaultEn: 'Track your mood, sleep and energy every day. Visual analysis of your progress.' },

  // ── Hero Carousel ─────────────────────────────────────────────────────────
  { id: 'carousel-module-0-title', section: 'Landing › Hero Carousel', label: 'Module 1 titulli', default: 'AI Assistant',                                                         defaultEn: 'AI Assistant' },
  { id: 'carousel-module-0-desc',  section: 'Landing › Hero Carousel', label: 'Module 1 description', default: 'Asistent i personalizuar AI për mirëqenien mendore — 24/7, pa gjykim.', defaultEn: 'Personalized AI assistant for mental wellbeing — 24/7, non-judgmental.' },
  { id: 'carousel-module-1-title', section: 'Landing › Hero Carousel', label: 'Module 2 titulli', default: 'Rezervo Takim',                                                        defaultEn: 'Book Appointment' },
  { id: 'carousel-module-1-desc',  section: 'Landing › Hero Carousel', label: 'Module 2 description', default: 'Psikolog i licencuar të gatshëm brenda 60 sekondave.',                defaultEn: 'Licensed psychologist ready within 60 seconds.' },
  { id: 'carousel-module-2-title', section: 'Landing › Hero Carousel', label: 'Module 3 titulli', default: 'Menaxhim Pacientësh',                                                  defaultEn: 'Patient Management' },
  { id: 'carousel-module-2-desc',  section: 'Landing › Hero Carousel', label: 'Module 3 description', default: 'Historiku i plotë, sesionet dhe progresi i çdo pacienti.',             defaultEn: 'Complete history, sessions and progress for each patient.' },
  { id: 'carousel-module-3-title', section: 'Landing › Hero Carousel', label: 'Module 4 titulli', default: 'Gjurmim Humori',                                                        defaultEn: 'Mood Tracking' },
  { id: 'carousel-module-3-desc',  section: 'Landing › Hero Carousel', label: 'Module 4 description', default: 'Analiza e humorit çdo ditë me insight-e nga AI.',                    defaultEn: 'Daily mood analysis with AI-powered insights.' },
  { id: 'carousel-module-4-title', section: 'Landing › Hero Carousel', label: 'Module 5 titulli', default: 'Sesione Video',                                                         defaultEn: 'Video Sessions' },
  { id: 'carousel-module-4-desc',  section: 'Landing › Hero Carousel', label: 'Module 5 description', default: 'Terapi online me cilësi HD direkt nga shtëpia jote.',                 defaultEn: 'Online therapy in HD quality directly from your home.' },
  { id: 'carousel-module-5-title', section: 'Landing › Hero Carousel', label: 'Module 6 titulli', default: 'Raporte & Analitikë',                                                   defaultEn: 'Reports & Analytics' },
  { id: 'carousel-module-5-desc',  section: 'Landing › Hero Carousel', label: 'Module 6 description', default: 'Progresi yt mendor — raporte javore dhe mujore.',                    defaultEn: 'Your mental progress — weekly and monthly reports.' },
]

// All unique section names for filtering
export const SECTIONS = [...new Set(SITE_TEXTS.map(t => t.section))]

// Helper: load the current value for an id from localStorage
const LS_KEY = 'ns_editable'
export function getStoredTexts() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '{}') } catch { return {} }
}

export function setStoredText(id, value) {
  try {
    const store = getStoredTexts()
    localStorage.setItem(LS_KEY, JSON.stringify({ ...store, [id]: value }))
  } catch {}
}

export function resetStoredText(id) {
  try {
    const store = getStoredTexts()
    delete store[id]
    localStorage.setItem(LS_KEY, JSON.stringify(store))
  } catch {}
}

export function resetAllTexts() {
  try { localStorage.removeItem(LS_KEY) } catch {}
}

// ── Version history helpers ────────────────────────────────────────────────
const HIST_KEY = 'ns_editable_history'
export function addToHistory(id, lang, prevValue) {
  try {
    const h = JSON.parse(localStorage.getItem(HIST_KEY) || '{}')
    const hKey = lang === 'en' ? `${id}__en` : id
    const prev = Array.isArray(h[hKey]) ? h[hKey] : []
    h[hKey] = [{ value: prevValue, ts: Date.now() }, ...prev].slice(0, 3)
    localStorage.setItem(HIST_KEY, JSON.stringify(h))
  } catch {}
}
export function getHistory(id, lang) {
  try {
    const h = JSON.parse(localStorage.getItem(HIST_KEY) || '{}')
    const hKey = lang === 'en' ? `${id}__en` : id
    return Array.isArray(h[hKey]) ? h[hKey] : []
  } catch { return [] }
}
export function getStoredForLang(lang) {
  const key = lang === 'en' ? 'ns_editable_en' : LS_KEY
  try { return JSON.parse(localStorage.getItem(key) || '{}') } catch { return {} }
}
export function setStoredForLang(lang, id, value) {
  const key = lang === 'en' ? 'ns_editable_en' : LS_KEY
  try {
    const store = JSON.parse(localStorage.getItem(key) || '{}')
    localStorage.setItem(key, JSON.stringify({ ...store, [id]: value }))
  } catch {}
}
export function resetStoredForLang(lang, id) {
  const key = lang === 'en' ? 'ns_editable_en' : LS_KEY
  try {
    const store = JSON.parse(localStorage.getItem(key) || '{}')
    delete store[id]
    localStorage.setItem(key, JSON.stringify(store))
  } catch {}
}
export function resetAllForLang(lang) {
  const key = lang === 'en' ? 'ns_editable_en' : LS_KEY
  try { localStorage.removeItem(key) } catch {}
}
