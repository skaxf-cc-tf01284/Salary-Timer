import { useMemo, useEffect } from 'react'
import { COUNTDOWN_I18N } from './i18n'
import { DEFAULT_WORK_END_HOUR, DEFAULT_WORK_END_MIN, TAB_QUERY_KEY, LANG_QUERY_KEY } from './constants'
import { getTzParts, trTpl, normalizeTabId, formatTime } from './utils'
import { calculateSalaryData, calculateWorkData, workEndMinutesFromString, normalizeWorkEndMinutes } from './calculations'
import { getThemeClasses } from './styles'
import { useClockState, useThemeState, useLangState, useActiveTabState, useWorkEndMinutesState, useUrlSync } from './hooks'
import { Header, ThemeToggle } from './components/Header'
import { TabButtons } from './components/TabButtons'
import { WorkTab } from './components/WorkTab'
import { SalaryTab } from './components/SalaryTab'

const TZ = 'Asia/Ho_Chi_Minh'

function App() {
  const now = useClockState()
  const [theme, setTheme] = useThemeState()
  const [lang, setLang] = useLangState()
  const [activeTab, setActiveTab] = useActiveTabState()
  const [workEndMinutes, setWorkEndMinutes] = useWorkEndMinutesState()

  useUrlSync(activeTab, lang)

  const tr = COUNTDOWN_I18N[lang] || COUNTDOWN_I18N.vi
  const pNow = useMemo(() => getTzParts(now, TZ), [now])
  const workEndParts = useMemo(() => {
    const mins = normalizeWorkEndMinutes(workEndMinutes)
    const hour = Math.floor(mins / 60)
    const minute = mins % 60
    return { hour, minute, text: formatTime(hour, minute) }
  }, [workEndMinutes])

  useEffect(() => {
    localStorage.setItem('workEndTime', workEndParts.text)
  }, [workEndParts.text])

  const salaryData = useMemo(() => calculateSalaryData(now, pNow, tr), [now, pNow, tr])
  const workData = useMemo(() => calculateWorkData(now, pNow, tr, workEndParts), [now, pNow, tr, workEndParts])

  useEffect(() => {
    document.title = workData.title
  }, [workData.title])

  const classes = getThemeClasses(theme === 'light')
  const pageWorkHeading = trTpl(tr.workHeadingTemplate || tr.workHeading, { endTime: workEndParts.text })
  const legendAfternoon = trTpl(tr.segmentLegendAfternoonTemplate || tr.segmentLegendAfternoon, { endTime: workEndParts.text })
  const legendAfter = trTpl(tr.segmentLegendAfterTemplate || tr.segmentLegendAfter, { endTime: workEndParts.text })
  const scheduleDefault = trTpl(tr.segmentNoteDefaultTemplate || tr.segmentNoteDefault, { endTime: workEndParts.text })
  const endHint = trTpl(tr.workEndHintTemplate || '', { endTime: workEndParts.text })

  const updateUrlWithTab = (nextTab) => {
    const normalizedTab = normalizeTabId(nextTab)
    const current = new URL(window.location.href)
    current.searchParams.set(TAB_QUERY_KEY, normalizedTab)
    current.searchParams.set(LANG_QUERY_KEY, lang)
    history.pushState({ tab: normalizedTab, lang }, '', `${current.pathname}${current.search}${current.hash}`)
    setActiveTab(normalizedTab)
  }

  return (
    <div className={`relative min-h-screen overflow-x-hidden px-4 py-6 font-mono md:px-6 ${classes.backgroundGradient}`}>
      <div className="pointer-events-none absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(148,163,184,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.15)_1px,transparent_1px)] [background-size:28px_28px]" />
      <div className="pointer-events-none absolute inset-0 opacity-15 [background:radial-gradient(circle_at_top_left,rgba(16,185,129,0.35),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.2),transparent_50%)]" />

      <Header theme={theme} setTheme={setTheme} lang={lang} setLang={setLang} tr={tr} />
      <ThemeToggle theme={theme} setTheme={setTheme} tr={tr} />

      <div className="relative z-10 mx-auto mt-16 w-full max-w-4xl">
        <div className="rounded-[20px] bg-gradient-to-br from-emerald-500/70 via-cyan-400/20 to-slate-500/40 p-[1px]">
          <div className={`rounded-[19px] p-5 md:p-6 ${classes.contentBox}`}>
            <div className="mb-4 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-400" aria-hidden="true" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" aria-hidden="true" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" aria-hidden="true" />
              <span className={`ml-2 text-xs ${classes.textSubtitle}`}>~/workspace/salary-timer</span>
            </div>

            <h1 className={`text-[clamp(1.4rem,2.1vw,2rem)] font-extrabold ${classes.pageTitle}`}>{tr.pageTitle}</h1>
            <div className={`mt-2 text-sm md:text-base ${classes.textSubtitle}`}>{tr.pageSubtitle}</div>

            <TabButtons
              activeTab={activeTab}
              updateUrlWithTab={updateUrlWithTab}
              tr={tr}
              theme={theme}
            />

            <WorkTab
              activeTab={activeTab}
              tr={tr}
              theme={theme}
              workData={workData}
              workEndParts={workEndParts}
              workEndMinutes={workEndMinutes}
              setWorkEndMinutes={setWorkEndMinutes}
              workEndMinutesFromString={workEndMinutesFromString}
              scheduleDefault={scheduleDefault}
              endHint={endHint}
              legendAfternoon={legendAfternoon}
              legendAfter={legendAfter}
              pageWorkHeading={pageWorkHeading}
              DEFAULT_WORK_END_HOUR={DEFAULT_WORK_END_HOUR}
              DEFAULT_WORK_END_MIN={DEFAULT_WORK_END_MIN}
            />

            <SalaryTab activeTab={activeTab} tr={tr} theme={theme} salaryData={salaryData} />

            <div className={`mt-4 border-t pt-3 text-sm ${theme === 'light' ? 'border-slate-300' : 'border-emerald-900/70'} ${classes.textSubtitle}`} dangerouslySetInnerHTML={{ __html: tr.footerHtml }} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
