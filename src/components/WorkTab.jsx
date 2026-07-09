import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Fireworks } from './Fireworks'
import { getThemeClasses } from '../styles'
import { trTpl as trTplUtil } from '../utils'

export function WorkTab({
  activeTab,
  tr,
  theme,
  workData,
  workEndParts,
  setWorkEndMinutes,
  workEndMinutesFromString,
  scheduleDefault,
  endHint,
  legendAfternoon,
  legendAfter,
  pageWorkHeading,
  DEFAULT_WORK_END_HOUR,
  DEFAULT_WORK_END_MIN,
}) {
  const classes = getThemeClasses(theme === 'light')
  const [workEndText, setWorkEndText] = useState(workEndParts.text)
  const [hitFx, setHitFx] = useState(false)
  const prevReachedRef = useRef(false)
  const isReached = Boolean(workData.isReached)

  useLayoutEffect(() => {
    queueMicrotask(() => {
      setWorkEndText(prev => {
        if (prev !== workEndParts.text) {
          return workEndParts.text
        }
        return prev
      })
    })
  }, [workEndParts.text])

  useEffect(() => {
    if (!prevReachedRef.current && isReached) {
      setHitFx(true)
      const timer = setTimeout(() => setHitFx(false), 8000)
      prevReachedRef.current = true
      return () => clearTimeout(timer)
    }

    if (!isReached) {
      prevReachedRef.current = false
      queueMicrotask(() => {
        setHitFx(prev => {
          if (prev !== false) {
            return false
          }
          return prev
        })
      })
    }
  }, [isReached])

  return (
    <section className={activeTab === 'workTab' ? 'relative mt-4 block' : 'hidden'} role="tabpanel">
      <Fireworks active={hitFx} theme={theme} />
      <h2 className={`text-xl font-bold ${theme === 'light' ? 'text-slate-900' : 'text-emerald-300'}`}>{pageWorkHeading}</h2>
      <div
        className={`mt-2 text-sm ${classes.textLight}`}
        dangerouslySetInnerHTML={{ __html: workData.milestoneHtml || tr.workMilestonePlaceholder }}
      />

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <label htmlFor="workEndInput" className="text-sm font-bold">
          {tr.workEndLabel}
        </label>
        <input
          id="workEndInput"
          type="text"
          inputMode="numeric"
          autoComplete="off"
          placeholder="HH:MM"
          className={`${classes.control} w-[7.2rem] tracking-[0.08em]`}
          value={workEndText}
          onChange={(event) => {
            const normalized = event.target.value.replace(/[^0-9:]/g, '').slice(0, 5)
            if (!/^\d{0,2}(:\d{0,2})?$/.test(normalized)) return
            setWorkEndText(normalized)

            if (/^\d{2}:\d{2}$/.test(normalized)) {
              const nextMinutes = workEndMinutesFromString(normalized)
              if (nextMinutes !== null) setWorkEndMinutes(nextMinutes)
            }
          }}
          onBlur={() => {
            const nextMinutes = workEndMinutesFromString(workEndText)
            if (nextMinutes !== null) {
              setWorkEndMinutes(nextMinutes)
              return
            }
            setWorkEndText(workEndParts.text)
          }}
        />
        <button
          type="button"
          className={classes.control}
          onClick={() => setWorkEndMinutes(DEFAULT_WORK_END_HOUR * 60 + DEFAULT_WORK_END_MIN)}
        >
          {tr.workEndReset}
        </button>
      </div>

      <div className={`mt-2 text-sm ${classes.textLight}`} dangerouslySetInnerHTML={{ __html: endHint }} />

      <div className={`mt-3 grid grid-cols-3 gap-3 ${hitFx ? 'countdown-hit' : ''}`}>
        <div className={classes.statBox}>
          <div className={`text-4xl font-extrabold ${theme === 'light' ? 'text-emerald-700' : 'text-emerald-300'}`}>{workData.wh}</div>
          <div className="text-sm opacity-80">{tr.hourLabel}</div>
        </div>
        <div className={classes.statBox}>
          <div className={`text-4xl font-extrabold ${theme === 'light' ? 'text-emerald-700' : 'text-emerald-300'}`}>{workData.wm}</div>
          <div className="text-sm opacity-80">{tr.minuteLabel}</div>
        </div>
        <div className={classes.statBox}>
          <div className={`text-4xl font-extrabold ${theme === 'light' ? 'text-emerald-700' : 'text-emerald-300'}`}>{workData.ws}</div>
          <div className="text-sm opacity-80">{tr.secondLabel}</div>
        </div>
      </div>

      {hitFx && (
        <div
          className={`countdown-hit-tag mt-2 inline-flex rounded-md border px-2 py-1 text-xs font-bold tracking-[0.08em] ${theme === 'light' ? 'border-emerald-400 bg-emerald-50 text-emerald-700' : 'border-emerald-500/60 bg-emerald-500/10 text-emerald-200'}`}
        >
          {'>> TARGET REACHED <<'}
        </div>
      )}

      <div className={`mt-3 ${classes.panelBox}`} dangerouslySetInnerHTML={{ __html: workData.infoHtml }} />

      <SegmentVisualization
        workData={workData}
        workEndParts={workEndParts}
        tr={tr}
        theme={theme}
        scheduleDefault={scheduleDefault}
        legendAfternoon={legendAfternoon}
        legendAfter={legendAfter}
      />
    </section>
  )
}

function SegmentVisualization({
  workData,
  workEndParts,
  tr,
  theme,
  scheduleDefault,
  legendAfternoon,
  legendAfter,
}) {
  const classes = getThemeClasses(theme === 'light')

  return (
    <div className={`mt-3 rounded-xl border p-3 ${theme === 'light' ? 'border-slate-300 bg-slate-50' : 'border-emerald-700/60 bg-[#08140f]'}`}>
      <div className={`mb-2 text-sm ${classes.textLight}`}>{tr.segmentTitle}</div>
      <div className={`flex h-[18px] overflow-hidden rounded-full border ${classes.segmentBar}`}>
        {[
          { id: 'segBefore', flex: 4, color: 'bg-slate-400' },
          { id: 'segGrace', flex: 1, color: 'bg-fuchsia-500' },
          { id: 'segMorning', flex: 11, color: 'bg-blue-500' },
          { id: 'segLunch', flex: 4, color: 'bg-yellow-400' },
          { id: 'segAfternoon', flex: 20, color: 'bg-lime-500' },
          { id: 'segAfter', flex: 4, color: 'bg-red-500' },
        ].map((segment) => (
          <div
            key={segment.id}
            title={
              segment.id === 'segAfternoon'
                ? trTplUtil(tr.segmentTitleAfternoonTemplate || tr.segmentTitles.segAfternoon, { endTime: workEndParts.text })
                : segment.id === 'segAfter'
                  ? trTplUtil(tr.segmentTitleAfterTemplate || tr.segmentTitles.segAfter, { endTime: workEndParts.text })
                  : tr.segmentTitles[segment.id]
            }
            style={{ flexGrow: segment.flex }}
            className={`${segment.color} border-r transition ${classes.segmentBarBorder} ${workData.currentSegment === segment.id ? 'opacity-100 brightness-110 saturate-150' : 'opacity-45'}`}
          />
        ))}
      </div>

      <div className="mt-2 flex flex-wrap gap-2 text-xs">
        {[
          { color: 'bg-slate-400', label: tr.segmentLegendBefore },
          { color: 'bg-fuchsia-500', label: tr.segmentLegendGrace },
          { color: 'bg-blue-500', label: tr.segmentLegendMorning },
          { color: 'bg-yellow-400', label: tr.segmentLegendLunch },
          { color: 'bg-lime-500', label: legendAfternoon },
          { color: 'bg-red-500', label: legendAfter },
        ].map((legend) => (
          <span
            key={legend.label}
            className={`inline-flex items-center gap-2 rounded-full border px-2 py-1 ${classes.legendItem}`}
          >
            <span className={`h-2 w-2 rounded-full ${legend.color}`} />
            <span>{legend.label}</span>
          </span>
        ))}
      </div>

      <div className="mt-2 text-sm">
        {workData.currentSegment ? workData.currentSegmentLabel : tr.segmentCurrentPlaceholder}
      </div>
      <div
        className={`mt-2 text-sm ${classes.textLight}`}
        dangerouslySetInnerHTML={{ __html: workData.scheduleHtml || scheduleDefault }}
      />
    </div>
  )
}
