import { Brain } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Privacy() {
  return (
    <div className="min-h-screen"
      style={{ background: 'linear-gradient(160deg,#030711 0%,#0e0525 50%,#030711 100%)' }}>

      {/* Header */}
      <div className="border-b border-white/5">
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)' }}>
              <Brain size={16} color="white" strokeWidth={1.8} />
            </div>
            <span className="text-white font-black text-base">NeuroSphera</span>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-black text-white mb-2">Politika e Privatësisë</h1>
        <p className="text-white/30 text-sm mb-10">Përditësuar: Maj 2025</p>

        <div className="space-y-8 text-white/60 text-sm leading-relaxed">

          <Section title="1. Hyrje">
            NeuroSphera ("ne", "platforma") është e angazhuar të mbrojë privatësinë tuaj.
            Kjo politikë shpjegon se çfarë të dhënash mbledhim, si i përdorim dhe si i mbrojmë.
          </Section>

          <Section title="2. Të dhënat që mbledhim">
            <ul className="list-disc list-inside space-y-1.5 mt-2">
              <li><strong className="text-white/70">Informacion llogarie:</strong> emri, email-i, avatari</li>
              <li><strong className="text-white/70">Të dhëna shëndetësore:</strong> regjistrimet e humorit, ditari personal, rezultatet e testeve</li>
              <li><strong className="text-white/70">Të dhëna të përdorimit:</strong> faqet e vizituara, bisedat me AI-in</li>
              <li><strong className="text-white/70">Google OAuth:</strong> nëse kyqeni me Google, marrim emrin dhe email-in nga llogaria juaj Google</li>
            </ul>
          </Section>

          <Section title="3. Si i përdorim të dhënat">
            <ul className="list-disc list-inside space-y-1.5 mt-2">
              <li>Për të ofruar shërbimet e platformës</li>
              <li>Për të personalizuar përvojën tuaj</li>
              <li>Për të përmirësuar produktin</li>
              <li>Nuk shesim kurrë të dhënat tuaja te palë të treta</li>
            </ul>
          </Section>

          <Section title="4. Ruajtja dhe siguria e të dhënave">
            Të dhënat ruhen në serverët e Supabase me enkriptim të plotë.
            Përdorim autentifikim JWT dhe Row Level Security (RLS) për të siguruar
            që çdo përdorues ka qasje vetëm në të dhënat e veta.
          </Section>

          <Section title="5. Të dhënat e fëmijëve">
            NeuroSphera nuk është e destinuar për personat nën 16 vjeç.
            Nëse jeni prind dhe besoni se fëmija juaj ka krijuar llogari,
            na kontaktoni për fshirjen e llogarisë.
          </Section>

          <Section title="6. Të drejtat tuaja">
            <ul className="list-disc list-inside space-y-1.5 mt-2">
              <li>E drejta e qasjes — shihni të dhënat tuaja në çdo kohë</li>
              <li>E drejta e fshirjes — fshini llogarinë nga profili</li>
              <li>E drejta e korrigjimit — ndryshoni të dhënat nga cilësimet</li>
              <li>E drejta e portabilitetit — kërkoni eksportimin e të dhënave</li>
            </ul>
          </Section>

          <Section title="7. Cookies">
            Përdorim cookies vetëm për sesionin e autentifikimit.
            Nuk përdorim cookies reklamuese apo tracking të palëve të treta.
          </Section>

          <Section title="8. Ndryshime në politikë">
            Mund të përditësojmë këtë politikë herë pas here.
            Do t'ju njoftojmë me email për ndryshime të rëndësishme.
          </Section>

          <Section title="9. Na kontaktoni">
            Për çdo pyetje lidhur me privatësinë:{' '}
            <a href="mailto:info@myneurosphera.com"
              className="text-violet-400 hover:text-violet-300 transition-colors">
              info@myneurosphera.com
            </a>
          </Section>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5">
          <Link to="/" className="text-sm text-white/30 hover:text-violet-400 transition-colors font-semibold">
            ← Kthehu në faqen kryesore
          </Link>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div>
      <h2 className="text-base font-black text-white mb-3">{title}</h2>
      <div>{children}</div>
    </div>
  )
}
