import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Moon, Sun } from 'lucide-react'
import { getThemeClasses } from '../styles'
import { normalizeLang } from '../utils'

export function Header({ theme, lang, setLang, tr }) {
  const classes = getThemeClasses(theme === 'light')
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef(null)

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

  const languageOptions = [
    { value: 'vi', label: 'VI' },
    { value: 'en', label: 'EN' },
  ]

  return (
    <div className="fixed left-3 top-3 z-20 md:left-5 md:top-5">
      <div
        className={`flex items-center gap-2 rounded-full border px-3 py-2 backdrop-blur shadow-sm ${classes.headerBox}`}
      >
        <label htmlFor="langSelect" className={`text-sm font-semibold ${classes.languageLabel}`}>
          {tr.langLabel}
        </label>
        <span className={`h-5 w-px ${classes.divider}`} aria-hidden="true" />
        <div className="relative" ref={dropdownRef}>
          <button
            id="langSelect"
            aria-label={tr.langAria}
            aria-haspopup="listbox"
            aria-expanded={open ? 'true' : 'false'}
            type="button"
            className={`${classes.langSelect} min-w-[58px] rounded-md border px-2 py-1 text-left transition ${theme === 'light' ? 'border-slate-300 hover:border-emerald-600' : 'border-emerald-700 hover:border-emerald-400'}`}
            onClick={() => setOpen((prev) => !prev)}
          >
            <span>{lang.toUpperCase()}</span>
            <ChevronDown
              size={12}
              className={`pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 ${classes.langSelectArrow}`}
              aria-hidden="true"
            />
          </button>

          {open && (
            <div
              role="listbox"
              aria-label={tr.langAria}
              className={`absolute right-0 top-[calc(100%+8px)] z-40 min-w-[88px] overflow-hidden rounded-lg border shadow-xl ${theme === 'light' ? 'border-slate-300 bg-white' : 'border-emerald-700 bg-[#0a1914]'}`}
            >
              {languageOptions.map((option) => {
                const isActive = lang === option.value
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={isActive ? 'true' : 'false'}
                    className={`block w-full px-3 py-2 text-left text-sm font-semibold transition ${isActive ? (theme === 'light' ? 'bg-emerald-100 text-emerald-900' : 'bg-emerald-500/20 text-emerald-100') : (theme === 'light' ? 'text-slate-700 hover:bg-slate-100' : 'text-emerald-200 hover:bg-emerald-500/10')}`}
                    onClick={() => {
                      setLang(normalizeLang(option.value))
                      setOpen(false)
                    }}
                  >
                    {option.label}
                  </button>
                )
              })}
            </div>
          )}
        </div>
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
