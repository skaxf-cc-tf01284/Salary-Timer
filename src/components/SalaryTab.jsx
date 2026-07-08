import { useEffect, useRef, useState } from 'react'
import { Fireworks } from './Fireworks'
import { getThemeClasses } from '../styles'

export function SalaryTab({ activeTab, tr, theme, salaryData }) {
  const classes = getThemeClasses(theme === 'light')
  const [hitFx, setHitFx] = useState(false)
  const prevReachedRef = useRef(false)
  const isReached = salaryData.d === 0 && salaryData.h === '00' && salaryData.m === '00' && salaryData.s === '00'

  useEffect(() => {
    if (!prevReachedRef.current && isReached) {
      setHitFx(true)
      const timer = setTimeout(() => setHitFx(false), 1300)
      prevReachedRef.current = true
      return () => clearTimeout(timer)
    }

    if (!isReached) {
      prevReachedRef.current = false
      setHitFx(false)
    }
  }, [isReached])

  return (
    <section className={activeTab === 'salaryTab' ? 'relative mt-4 block' : 'hidden'} role="tabpanel">
      <Fireworks active={hitFx} theme={theme} />
      <h2 className={`text-xl font-bold ${theme === 'light' ? 'text-slate-900' : 'text-emerald-300'}`}>{tr.salaryHeading}</h2>
      <div
        className={`mt-2 text-sm ${classes.textLight}`}
        dangerouslySetInnerHTML={{ __html: tr.salarySubHtml }}
      />

      <div className={`mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4 ${hitFx ? 'countdown-hit' : ''}`}>
        <div className={classes.statBox}>
          <div className={`text-4xl font-extrabold ${theme === 'light' ? 'text-emerald-700' : 'text-emerald-300'}`}>{salaryData.d}</div>
          <div className="text-sm opacity-80">{tr.dayLabel}</div>
        </div>
        <div className={classes.statBox}>
          <div className={`text-4xl font-extrabold ${theme === 'light' ? 'text-emerald-700' : 'text-emerald-300'}`}>{salaryData.h}</div>
          <div className="text-sm opacity-80">{tr.hourLabel}</div>
        </div>
        <div className={classes.statBox}>
          <div className={`text-4xl font-extrabold ${theme === 'light' ? 'text-emerald-700' : 'text-emerald-300'}`}>{salaryData.m}</div>
          <div className="text-sm opacity-80">{tr.minuteLabel}</div>
        </div>
        <div className={classes.statBox}>
          <div className={`text-4xl font-extrabold ${theme === 'light' ? 'text-emerald-700' : 'text-emerald-300'}`}>{salaryData.s}</div>
          <div className="text-sm opacity-80">{tr.secondLabel}</div>
        </div>
      </div>

      {hitFx && (
        <div
          className={`countdown-hit-tag mt-2 inline-flex rounded-md border px-2 py-1 text-xs font-bold tracking-[0.08em] ${theme === 'light' ? 'border-emerald-400 bg-emerald-50 text-emerald-700' : 'border-emerald-500/60 bg-emerald-500/10 text-emerald-200'}`}
        >
          {'>> PAYDAY HIT <<'}
        </div>
      )}

      <div className={`mt-3 ${classes.panelBox}`} dangerouslySetInnerHTML={{ __html: salaryData.nextPayHtml }} />
      <div className={`mt-3 ${classes.panelBox}`} dangerouslySetInnerHTML={{ __html: salaryData.todayHtml }} />
    </section>
  )
}
