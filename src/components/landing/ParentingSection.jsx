import { Link } from 'react-router-dom'
import { Baby, ChevronRight, BookOpen, Lightbulb, Bot, Shield } from 'lucide-react'
import { PARENT_CATEGORIES, PARENTING_ARTICLES, PARENTING_TECHNIQUES } from '../../data/parentingData'
import EditableText from '../EditableText'

const HIGHLIGHTS = [
  { icon: BookOpen, label: `${PARENTING_ARTICLES.length} Artikuj`, desc: 'Bazuar në psikologji zhvillimore', color: '#7c3aed', soft: '#f5f3ff' },
  { icon: Lightbulb, label: `${PARENTING_TECHNIQUES.length} Teknika`, desc: 'Strategji praktike, hap pas hapi', color: '#ec4899', soft: '#fdf2f8' },
  { icon: Bot, label: 'AI Asistent', desc: 'Mbështetje personale 24/7', color: '#f97316', soft: '#fff7ed' },
  { icon: Shield, label: '5 Kategori', desc: 'Nga foshnja te adoleshenti', color: '#0891b2', soft: '#ecfeff' },
]

export default function ParentingSection() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-violet-50/40">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-violet-50 border border-violet-100 rounded-full px-4 py-2 mb-5">
            <span className="text-lg">👨‍👩‍👧‍👦</span>
            <EditableText as="span" className="text-sm font-bold text-violet-600">Për Prindërit</EditableText>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 leading-tight">
            <EditableText>NeuroSpace për</EditableText>{' '}
            <EditableText as="span" className="bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent">
              Prindërit
            </EditableText>
          </h2>
          <EditableText as="p" multiline className="text-gray-500 max-w-2xl mx-auto text-base leading-relaxed">
            Udhëzim i bazuar në shkencë për çdo fazë të prindërisë — nga foshnjëria te adoleshenca.
            Teknika praktike, artikuj dhe asistent AI gjithmonë pranë.
          </EditableText>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {HIGHLIGHTS.map(({ icon: Icon, label, desc, color, soft }) => (
            <div
              key={label}
              className="rounded-2xl p-4 text-center transition-transform hover:-translate-y-1"
              style={{ background: soft }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
                style={{ background: `${color}22` }}
              >
                <Icon size={20} style={{ color }} strokeWidth={2} />
              </div>
              <p className="text-base font-black text-gray-900">{label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
            </div>
          ))}
        </div>

        {/* Categories grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {PARENT_CATEGORIES.map(cat => {
            const articleCount = PARENTING_ARTICLES.filter(a => a.categoryId === cat.id).length
            return (
              <div
                key={cat.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0"
                    style={{ background: cat.soft }}
                  >
                    {cat.emoji}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{cat.label}</p>
                    <p className="text-[10px] text-gray-400">{articleCount} artikuj</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed mb-3">{cat.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {cat.challenges.slice(0, 2).map(c => (
                    <span
                      key={c}
                      className="text-[10px] px-2 py-1 rounded-full font-semibold"
                      style={{ background: cat.soft, color: cat.color }}
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Featured article preview */}
        <div
          className="rounded-3xl p-6 md:p-8 mb-10 text-white relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg,#4c1d95 0%,#7c3aed 40%,#ec4899 100%)' }}
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/5" />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-3 py-1.5 mb-4">
                <Bot size={14} />
                <EditableText as="span" className="text-xs font-bold">Asistenti AI i Prindërisë</EditableText>
              </div>
              <h3 className="text-xl md:text-2xl font-black mb-3 leading-tight">
                <EditableText>Pyesni çdo gjë rreth fëmijës tuaj</EditableText>
              </h3>
              <EditableText as="p" multiline className="text-white/80 text-sm leading-relaxed mb-5 max-w-md">
                Nga humbja e temperamentit te bullizmi, nga detyrat e shkollës te komunikimi me adoleshentët —
                asistenti ynë ju jep udhëzim të personalizuar, bazuar në psikologji.
              </EditableText>
              <Link
                to="/parenting"
                className="inline-flex items-center gap-2 bg-white text-violet-700 px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:bg-violet-50 active:scale-95 shadow-lg"
              >
                <EditableText>Hap Asistentin AI</EditableText>
                <ChevronRight size={16} />
              </Link>
            </div>

            {/* Mock chat bubble */}
            <div className="w-full md:w-72 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 space-y-3">
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-sm shrink-0">👩</div>
                <div className="bg-white/15 rounded-xl rounded-tl-sm px-3 py-2 text-xs text-white/90 max-w-[200px]">
                  Fëmija im 8 vjeç ka nisur të gënjejë shpesh. Si të reagoj?
                </div>
              </div>
              <div className="flex gap-2 flex-row-reverse">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-400 to-pink-400 flex items-center justify-center shrink-0">
                  <Bot size={14} color="white" />
                </div>
                <div className="bg-white/20 rounded-xl rounded-tr-sm px-3 py-2 text-xs text-white/90 max-w-[200px]">
                  E kuptoj shqetësimin — gënjeshtra te fëmijët zakonisht vjen nga frika, jo keqdashja...
                </div>
              </div>
              <div className="flex gap-1 justify-center pt-1">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            to="/parenting"
            className="inline-flex items-center gap-2.5 text-white px-8 py-3.5 rounded-2xl font-bold text-base transition-all hover:shadow-xl active:scale-95 shadow-lg"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899)' }}
          >
            <span>👨‍👩‍👧‍👦</span>
            <EditableText>Eksploro Modulin e Prindërisë</EditableText>
            <ChevronRight size={18} />
          </Link>
          <EditableText as="p" className="text-gray-400 text-xs mt-3">
            Falas · Pa regjistrim · Bazuar në shkencë
          </EditableText>
        </div>
      </div>
    </section>
  )
}
