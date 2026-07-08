export function getThemeClasses(isLight) {
  return {
    panelBox: isLight
      ? 'rounded-xl border border-slate-300 bg-[#f8f9fb] px-3 py-3 leading-relaxed text-slate-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]'
      : 'rounded-xl border border-emerald-700/60 bg-[#08140f] px-3 py-3 leading-relaxed text-emerald-100 shadow-[inset_0_1px_0_rgba(16,185,129,0.15)]',

    statBox: isLight
      ? 'rounded-xl border border-slate-300 bg-white px-3 py-4 text-center shadow-[0_8px_20px_rgba(15,23,42,0.08)]'
      : 'rounded-xl border border-emerald-700/60 bg-[#0b1b15] px-3 py-4 text-center shadow-[0_8px_20px_rgba(5,46,22,0.5)]',

    tabBase: isLight
      ? 'grid w-full min-h-[42px] grid-cols-[1.5em_minmax(0,1fr)_1.5em] items-center gap-1 rounded-lg border px-4 py-2 text-sm font-bold transition border-slate-300 bg-white text-slate-700 hover:border-emerald-600 hover:-translate-y-0.5'
      : 'grid w-full min-h-[42px] grid-cols-[1.5em_minmax(0,1fr)_1.5em] items-center gap-1 rounded-lg border px-4 py-2 text-sm font-bold transition border-emerald-700 bg-[#0c1913] text-emerald-100 hover:border-emerald-400 hover:-translate-y-0.5',

    tabActive: isLight
      ? 'border-emerald-700 bg-emerald-50 text-slate-900 shadow-[0_8px_20px_rgba(5,150,105,0.22)]'
      : 'border-emerald-400 bg-emerald-500/15 text-emerald-50 shadow-[0_8px_20px_rgba(5,150,105,0.28)]',

    langSelect: isLight
      ? 'appearance-none bg-transparent py-1 pl-1 pr-5 text-sm font-semibold text-slate-700 outline-none'
      : 'appearance-none bg-transparent py-1 pl-1 pr-5 text-sm font-semibold text-emerald-50 outline-none',

    control: isLight
      ? 'rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/25'
      : 'rounded-lg border border-emerald-700 bg-[#0b1a14] px-3 py-2 text-sm text-emerald-50 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/25',

    backgroundGradient: isLight
      ? 'bg-[linear-gradient(145deg,#f2f4f8_0%,#e2e8f0_55%,#cbd5e1_100%)] text-slate-800'
      : 'bg-[linear-gradient(145deg,#020a07_0%,#03140f_50%,#052019_100%)] text-emerald-100',

    headerBox: isLight
      ? 'border-slate-300 bg-white/90'
      : 'border-emerald-700 bg-[#08140f]/90',

    headerBoxHover: isLight ? 'hover:border-emerald-600' : 'hover:border-emerald-400',

    languageLabel: isLight ? 'text-slate-700' : 'text-emerald-100',

    divider: isLight ? 'bg-slate-300' : 'bg-emerald-700',

    langSelectArrow: isLight ? 'text-slate-500' : 'text-emerald-300',

    themeButton: isLight
      ? 'border-slate-300 bg-white/90 hover:border-emerald-600'
      : 'border-emerald-700 bg-[#08140f]/90 hover:border-emerald-400',

    contentBox: isLight ? 'bg-white/95' : 'bg-[#06110d]/85',

    pageTitle: isLight ? 'text-slate-900' : 'text-emerald-300',

    pageSubtitle: isLight ? 'text-slate-500' : 'text-emerald-300/80',

    segmentBar: isLight ? 'border-slate-300 bg-slate-100' : 'border-emerald-700 bg-[#0a1914]',

    segmentBarBorder: isLight ? 'border-slate-900/20' : 'border-emerald-950/60',

    legendItem: isLight
      ? 'border-slate-300 bg-white text-slate-600'
      : 'border-emerald-700 bg-[#0a1914] text-emerald-200',

    textSubtitle: isLight ? 'text-slate-500' : 'text-emerald-300/80',

    textLight: isLight ? 'text-slate-500' : 'text-emerald-300/80',
  }
}
