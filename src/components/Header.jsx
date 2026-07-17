import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Check, Globe, Moon, Sun } from 'lucide-react'
import { getThemeClasses } from '../styles'
import { normalizeLang } from '../utils'

const LANG_META = {
  vi: { flag: '🇻🇳', label: 'Tiếng Việt', short: 'VI' },
  en: { flag: '🇬🇧', label: 'English', short: 'EN' },
}

export function Header({ theme, lang, setLang, tr }) {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef(null)
  const isLight = theme === 'light'
  const currentMeta = LANG_META[lang] || LANG_META.vi

  useEffect(() => {
    function handleOutsideClick(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false)
      }
    }

    function handleEscape(event) {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', handleOutsideClick)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  return (
    <div className="fixed left-3 top-3 z-20 md:left-5 md:top-5">
      <div ref={dropdownRef} className="relative">
        <button
          id="langSelect"
          aria-label={tr.langAria}
          aria-haspopup="listbox"
          aria-expanded={open ? 'true' : 'false'}
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className={`flex items-center gap-1.5 rounded-full border px-3 py-2 text-sm font-semibold backdrop-blur shadow-sm transition ${
            isLight
              ? 'border-slate-300 bg-white/90 text-slate-700 hover:border-emerald-500 hover:shadow-emerald-100'
              : 'border-emerald-700 bg-[#08140f]/90 text-emerald-100 hover:border-emerald-400'
          }`}
        >
          <Globe size={14} aria-hidden="true" className={isLight ? 'text-slate-400' : 'text-emerald-500'} />
          <span>{currentMeta.flag}</span>
          <span>{currentMeta.short}</span>
          <ChevronDown
            size={13}
            aria-hidden="true"
            className={`transition-transform duration-200 ${open ? 'rotate-180' : ''} ${isLight ? 'text-slate-400' : 'text-emerald-500'}`}
          />
        </button>

        {open && (
          <div
            role="listbox"
            aria-label={tr.langAria}
            className={`absolute left-0 top-[calc(100%+6px)] z-40 min-w-[156px] overflow-hidden rounded-xl border shadow-2xl ${
              isLight
                ? 'border-slate-200 bg-white shadow-slate-200/80'
                : 'border-emerald-700/70 bg-[#0a1914] shadow-black/40'
            }`}
          >
            <div className={`border-b px-3 py-2 text-[10px] font-bold uppercase tracking-widest ${
              isLight ? 'border-slate-100 text-slate-400' : 'border-emerald-800/60 text-emerald-600'
            }`}>
              {tr.langLabel}
            </div>
            {Object.entries(LANG_META).map(([value, meta]) => {
              const isActive = lang === value
              return (
                <button
                  key={value}
                  type="button"
                  role="option"
                  aria-selected={isActive ? 'true' : 'false'}
                  onClick={() => {
                    setLang(normalizeLang(value))
                    setOpen(false)
                  }}
                  className={`flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm font-semibold transition ${
                    isActive
                      ? isLight
                        ? 'bg-emerald-50 text-emerald-800'
                        : 'bg-emerald-500/15 text-emerald-100'
                      : isLight
                        ? 'text-slate-600 hover:bg-slate-50'
                        : 'text-emerald-200 hover:bg-emerald-500/10'
                  }`}
                >
                  <span className="text-base leading-none">{meta.flag}</span>
                  <span className="flex-1">{meta.label}</span>
                  {isActive && (
                    <Check size={13} aria-hidden="true" className={isLight ? 'text-emerald-600' : 'text-emerald-400'} />
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export function ThemeToggle({ theme, setTheme, tr }) {
  const classes = getThemeClasses(theme === 'light')

  return (
    <button
      className={`fixed right-3 top-3 z-20 grid h-11 w-11 place-items-center rounded-full border text-lg transition md:right-5 md:top-5 ${classes.themeButton}`}
      type="button"
      title={tr.themeToggleTitle}
      onClick={() => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))}
    >
      {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  )
}
