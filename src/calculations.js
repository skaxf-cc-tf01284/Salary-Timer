import {
  SALARY_HOUR,
  LATE_ALLOW_MIN,
  LUNCH_START_HOUR,
  LUNCH_END_HOUR,
  WORK_START_HOUR,
  DEFAULT_WORK_END_HOUR,
  DEFAULT_WORK_END_MIN,
  MIN_WORK_END_MINUTES,
  MAX_WORK_END_MINUTES,
  HOLIDAYS,
} from './constants'
import { pad2, parseTimeString, trTpl } from './utils'

export function normalizeWorkEndMinutes(minutes) {
  if (!Number.isFinite(minutes)) return DEFAULT_WORK_END_HOUR * 60 + DEFAULT_WORK_END_MIN
  const rounded = Math.round(minutes)
  return Math.min(MAX_WORK_END_MINUTES, Math.max(MIN_WORK_END_MINUTES, rounded))
}

export function workEndMinutesFromString(value) {
  const parsed = parseTimeString(value)
  if (!parsed) return null
  return normalizeWorkEndMinutes(parsed.hour * 60 + parsed.minute)
}

export function tzLocalToEpochMs(y, m, d, hh = 0, mm = 0, ss = 0) {
  return Date.UTC(y, m - 1, d, hh - 7, mm, ss, 0)
}

export function isoFromYmd(y, m, d) {
  return `${y}-${pad2(m)}-${pad2(d)}`
}

export function dayOfWeek(y, m, d) {
  const ms = tzLocalToEpochMs(y, m, d, 12, 0, 0)
  return new Date(ms).getUTCDay()
}

export function daysInMonth(y, m) {
  return new Date(Date.UTC(y, m, 0)).getUTCDate()
}

export function isHolidayYMD(y, m, d) {
  return HOLIDAYS.has(isoFromYmd(y, m, d))
}

export function isWeekendYMD(y, m, d) {
  const wd = dayOfWeek(y, m, d)
  return wd === 0 || wd === 6
}

export function isWorkingYMD(y, m, d) {
  return !isWeekendYMD(y, m, d) && !isHolidayYMD(y, m, d)
}

export function nextDay(y, m, d) {
  let nextY = y
  let nextM = m
  let nextD = d + 1
  const dim = daysInMonth(nextY, nextM)
  if (nextD > dim) {
    nextD = 1
    nextM += 1
    if (nextM > 12) {
      nextM = 1
      nextY += 1
    }
  }
  return { y: nextY, m: nextM, d: nextD }
}

export function moveToNextWorkingDay(y, m, d) {
  let cur = { y, m, d }
  while (!isWorkingYMD(cur.y, cur.m, cur.d)) {
    cur = nextDay(cur.y, cur.m, cur.d)
  }
  return cur
}

export function getSalaryDateForMonth(y, m) {
  return moveToNextWorkingDay(y, m, 19)
}

export function compareYmd(a, b) {
  if (a.y !== b.y) return a.y - b.y
  if (a.m !== b.m) return a.m - b.m
  return a.d - b.d
}

export function isPastHour(parts, hour) {
  return parts.hour > hour || (parts.hour === hour && (parts.minute > 0 || parts.second > 0))
}

export function getNextSalaryDate(nowParts) {
  const cur = { y: nowParts.year, m: nowParts.month, d: nowParts.day }
  const thisSalary = getSalaryDateForMonth(cur.y, cur.m)
  const isAfterSalaryTimeToday = compareYmd(cur, thisSalary) === 0 && isPastHour(nowParts, SALARY_HOUR)

  if (compareYmd(cur, thisSalary) < 0) return thisSalary
  if (compareYmd(cur, thisSalary) === 0 && !isAfterSalaryTimeToday) return thisSalary

  let ny = cur.y
  let nm = cur.m + 1
  if (nm > 12) {
    nm = 1
    ny += 1
  }
  return getSalaryDateForMonth(ny, nm)
}

export function diffToParts(ms) {
  const total = Math.max(0, Math.floor(ms / 1000))
  const days = Math.floor(total / 86400)
  const hours = Math.floor((total % 86400) / 3600)
  const mins = Math.floor((total % 3600) / 60)
  const secs = total % 60
  return { days, hours, mins, secs }
}

export function calculateSalaryData(now, pNow, tr) {
  const thisMonthSalary = getSalaryDateForMonth(pNow.year, pNow.month)
  const isTodaySalaryDate =
    pNow.year === thisMonthSalary.y && pNow.month === thisMonthSalary.m && pNow.day === thisMonthSalary.d
  const isSalaryReachedNow = isTodaySalaryDate && isPastHour(pNow, SALARY_HOUR)

  const nextSalary = getNextSalaryDate(pNow)
  const targetMs = tzLocalToEpochMs(nextSalary.y, nextSalary.m, nextSalary.d, SALARY_HOUR, 0, 0)
  const diff = diffToParts(targetMs - now.getTime())

  const base19 = { y: nextSalary.y, m: nextSalary.m, d: 19 }
  const moved = compareYmd(base19, nextSalary) !== 0
  const wdSalary = dayOfWeek(nextSalary.y, nextSalary.m, nextSalary.d)

  const formatLocalDate = (y, m, d, weekday) => `${tr.weekdays[weekday]}, ${pad2(d)}/${pad2(m)}/${y}`

  const nextPayHtml = `
    <div><b>${tr.nextSalaryTitle}</b> <span class="ok">${formatLocalDate(nextSalary.y, nextSalary.m, nextSalary.d, wdSalary)}</span></div>
    <div>${tr.standardDayPrefix} 19/${pad2(nextSalary.m)}/${nextSalary.y}
      ${moved ? `-> <span class="warn">${tr.movedReason}</span>` : ''}
    </div>
  `

  const isTodayPayday =
    (pNow.year === nextSalary.y && pNow.month === nextSalary.m && pNow.day === nextSalary.d) || isSalaryReachedNow

  const todayHtml = isTodayPayday
    ? `<span class="ok">${tr.todaySalaryText}</span>`
    : `${tr.todayPrefix}: <b>${formatLocalDate(pNow.year, pNow.month, pNow.day, pNow.weekday)}</b>`

  return {
    d: diff.days,
    h: pad2(diff.hours),
    m: pad2(diff.mins),
    s: pad2(diff.secs),
    isReached: isSalaryReachedNow,
    nextPayHtml,
    todayHtml,
  }
}

export function calculateWorkData(now, pNow, tr, workEndParts) {
  const formatLocalDate = (y, m, d, weekday) => `${tr.weekdays[weekday]}, ${pad2(d)}/${pad2(m)}/${y}`
  const nowMs = now.getTime()
  const monToFri = pNow.weekday >= 1 && pNow.weekday <= 5
  const endTimeText = workEndParts.text

  const getSegmentLabel = (segmentId) => {
    if (segmentId === 'segAfternoon' && tr.segmentLabelAfternoonTemplate) {
      return trTpl(tr.segmentLabelAfternoonTemplate, { endTime: endTimeText })
    }
    if (segmentId === 'segAfter' && tr.segmentLabelAfterTemplate) {
      return trTpl(tr.segmentLabelAfterTemplate, { endTime: endTimeText })
    }
    return tr.segmentLabels[segmentId] || tr.segmentNotApplicable
  }

  if (!monToFri) {
    return {
      wh: '--',
      wm: '--',
      ws: '--',
      isReached: false,
      infoHtml: `${tr.todayPrefix} ${formatLocalDate(pNow.year, pNow.month, pNow.day, pNow.weekday)} · <span class="warn">${tr.weekendNoCountdown}</span>`,
      scheduleHtml: tr.weekendSchedule,
      currentSegment: '',
      currentSegmentLabel: tr.segmentNotApplicable,
      milestoneHtml: '',
      title: `${tr.weekendTitle} | ${tr.baseTitle}`,
    }
  }

  const startMs = tzLocalToEpochMs(pNow.year, pNow.month, pNow.day, WORK_START_HOUR, 0, 0)
  const lateMs = tzLocalToEpochMs(pNow.year, pNow.month, pNow.day, WORK_START_HOUR, LATE_ALLOW_MIN, 0)
  const lunchStartMs = tzLocalToEpochMs(pNow.year, pNow.month, pNow.day, LUNCH_START_HOUR, 0, 0)
  const lunchEndMs = tzLocalToEpochMs(pNow.year, pNow.month, pNow.day, LUNCH_END_HOUR, 0, 0)
  const endMs = tzLocalToEpochMs(pNow.year, pNow.month, pNow.day, workEndParts.hour, workEndParts.minute, 0)

  let milestone
  if (nowMs < startMs) milestone = { targetMs: startMs, label: tr.milestones.startWork, icon: 'Rocket' }
  else if (nowMs < lateMs) milestone = { targetMs: lateMs, label: tr.milestones.lateDeadline, icon: 'AlarmClock' }
  else if (nowMs < lunchStartMs) milestone = { targetMs: lunchStartMs, label: tr.milestones.lunchStart, icon: 'Utensils' }
  else if (nowMs < lunchEndMs) milestone = { targetMs: lunchEndMs, label: tr.milestones.lunchEnd, icon: 'Dumbbell' }
  else if (nowMs < endMs) {
    const endWorkLabel = trTpl(tr.milestones.endWorkTemplate || tr.milestones.endWork, { endTime: endTimeText })
    milestone = { targetMs: endMs, label: endWorkLabel, icon: 'Target' }
  } else {
    const nextDayStart = tzLocalToEpochMs(pNow.year, pNow.month, pNow.day + 1, 8, 0, 0)
    milestone = { targetMs: nextDayStart, label: tr.milestones.startTomorrow, icon: 'Sunrise' }
  }

  const delta = milestone.targetMs - nowMs
  if (delta <= 0) {
    const infoHtml = `${tr.todayPrefix} ${formatLocalDate(pNow.year, pNow.month, pNow.day, pNow.weekday)} · <span class="ok">${tr.reachedHomeText}</span>`
    return {
      wh: '00',
      wm: '00',
      ws: '00',
      isReached: true,
      infoHtml,
      scheduleHtml: trTpl(tr.workDoneScheduleTemplate || tr.workDoneSchedule, { endTime: endTimeText }),
      currentSegment: 'segAfter',
      currentSegmentLabel: getSegmentLabel('segAfter'),
      milestoneHtml: `<b>${tr.milestonePrefix}</b> ${milestone.label}`,
      title: `${tr.reachedHomeText} | ${milestone.label} | ${tr.baseTitle}`,
      milestoneIcon: milestone.icon,
    }
  }

  const countdown = diffToParts(delta)
  const hoursLeft = countdown.hours + countdown.days * 24
  let statusText = tr.workBeforeStart
  let scheduleHtml = trTpl(tr.workBeforeStartScheduleTemplate || tr.workBeforeStartSchedule, { endTime: endTimeText })
  let segmentId = 'segBefore'

  if (nowMs <= lateMs && nowMs >= startMs) {
    statusText = tr.workGrace
    scheduleHtml = tr.workGraceSchedule
    segmentId = 'segGrace'
  } else if (nowMs < lunchStartMs && nowMs > lateMs) {
    statusText = tr.workMorning
    scheduleHtml = tr.workMorningSchedule
    segmentId = 'segMorning'
  } else if (nowMs < lunchEndMs && nowMs >= lunchStartMs) {
    statusText = tr.workLunch
    scheduleHtml = tr.workLunchSchedule
    segmentId = 'segLunch'
  } else if (nowMs < endMs && nowMs >= lunchEndMs) {
    statusText = tr.workAfternoon
    scheduleHtml = trTpl(tr.workAfternoonScheduleTemplate || tr.workAfternoonSchedule, { endTime: endTimeText })
    segmentId = 'segAfternoon'
  } else if (nowMs >= endMs) {
    statusText = tr.reachedHomeText
    scheduleHtml = trTpl(tr.workDoneScheduleTemplate || tr.workDoneSchedule, { endTime: endTimeText })
    segmentId = 'segAfter'
  }

  const infoHtml = `${tr.todayPrefix} ${formatLocalDate(pNow.year, pNow.month, pNow.day, pNow.weekday)} · <span class="ok">${statusText}</span>`

  return {
    wh: pad2(hoursLeft),
    wm: pad2(countdown.mins),
    ws: pad2(countdown.secs),
    isReached: segmentId === 'segAfter',
    infoHtml,
    scheduleHtml,
    currentSegment: segmentId,
    currentSegmentLabel: getSegmentLabel(segmentId),
    milestoneHtml: `<b>${tr.milestonePrefix}</b> ${milestone.label}`,
    title: `${pad2(hoursLeft)}:${pad2(countdown.mins)}:${pad2(countdown.secs)} | ${milestone.label} | ${tr.baseTitle}`,
    milestoneIcon: milestone.icon,
  }
}
