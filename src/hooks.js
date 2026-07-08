import { useEffect, useState } from 'react'
import { TAB_QUERY_KEY, LANG_QUERY_KEY, WORK_END_STORAGE_KEY } from './constants'
import { normalizeLang, normalizeTabId } from './utils'
import { workEndMinutesFromString } from './calculations'

export function useClockState() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return now
}

export function useThemeState() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme')
    const initial = saved || 'dark'
    if (initial === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    return initial
  })

  useEffect(() => {
    localStorage.setItem('theme', theme)
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  return [theme, setTheme]
}

export function useLangState() {
  const [lang, setLang] = useState(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.has(LANG_QUERY_KEY)) return normalizeLang(params.get(LANG_QUERY_KEY))
    const savedLang = normalizeLang(localStorage.getItem('lang') || '')
    const browserLang = normalizeLang(navigator.language?.slice(0, 2) || 'vi')
    return savedLang || browserLang || 'vi'
  })

  useEffect(() => {
    localStorage.setItem('lang', lang)
    document.documentElement.lang = lang
  }, [lang])

  return [lang, setLang]
}

export function useActiveTabState() {
  const [activeTab, setActiveTab] = useState(() => {
    const params = new URLSearchParams(window.location.search)
    return normalizeTabId(params.get(TAB_QUERY_KEY))
  })

  return [activeTab, setActiveTab]
}

export function useWorkEndMinutesState() {
  const [workEndMinutes, setWorkEndMinutes] = useState(() => {
    const saved = workEndMinutesFromString(localStorage.getItem(WORK_END_STORAGE_KEY) || '')
    const DEFAULT_WORK_END_HOUR = 17
    const DEFAULT_WORK_END_MIN = 0
    return saved ?? DEFAULT_WORK_END_HOUR * 60 + DEFAULT_WORK_END_MIN
  })

  return [workEndMinutes, setWorkEndMinutes]
}

export function useUrlSync(activeTab, lang) {
  useEffect(() => {
    const current = new URL(window.location.href)
    const oldTab = current.searchParams.get(TAB_QUERY_KEY)
    const oldLang = current.searchParams.get(LANG_QUERY_KEY)
    current.searchParams.set(TAB_QUERY_KEY, activeTab)
    current.searchParams.set(LANG_QUERY_KEY, lang)
    if (oldTab !== activeTab || oldLang !== lang) {
      history.replaceState(
        { tab: activeTab, lang },
        '',
        `${current.pathname}${current.search}${current.hash}`,
      )
    }
  }, [activeTab, lang])

  useEffect(() => {
    const onPopState = () => {
      // Note: This won't update state directly since setLang/setActiveTab aren't available here
      // State updates will happen through the URL sync above when user navigates
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])
}
