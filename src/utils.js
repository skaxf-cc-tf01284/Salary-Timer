import { SUPPORTED_LANGS, VALID_TAB_IDS, TZ } from './constants'

export const pad2 = (n) => String(n).padStart(2, '0')

export function normalizeTabId(tabId) {
  if (typeof tabId !== 'string') return 'workTab'
  return VALID_TAB_IDS.has(tabId) ? tabId : 'workTab'
}

export function normalizeLang(lang) {
  if (typeof lang !== 'string') return 'vi'
  const normalized = lang.toLowerCase()
  return SUPPORTED_LANGS.has(normalized) ? normalized : 'vi'
}

export function formatTime(hour, minute) {
  return `${pad2(hour)}:${pad2(minute)}`
}

export function parseTimeString(value) {
  if (typeof value !== 'string') return null
  const m = value.trim().match(/^(\d{1,2}):(\d{2})$/)
  if (!m) return null
  const hour = Number(m[1])
  const minute = Number(m[2])
  if (!Number.isInteger(hour) || !Number.isInteger(minute)) return null
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null
  return { hour, minute }
}

export function trTpl(value, data) {
  if (typeof value !== 'string') return ''
  return value.replace(/\{(\w+)\}/g, (_, key) => String(data[key] ?? ''))
}

export function stripLeadingIcons(value) {
  if (typeof value !== 'string') return ''
  return value.replace(/^[^\p{L}\p{N}]+\s*/u, '')
}

const formatterCache = new Map()

export function getFormatter(timeZone) {
  if (!formatterCache.has(timeZone)) {
    formatterCache.set(
      timeZone,
      new Intl.DateTimeFormat('en-GB', {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hourCycle: 'h23',
        weekday: 'short',
      }),
    )
  }
  return formatterCache.get(timeZone)
}

export function getTzParts(date = new Date(), timeZone = TZ) {
  const fmt = getFormatter(timeZone)
  const parts = fmt.formatToParts(date)
  const map = {}
  for (const p of parts) {
    if (p.type !== 'literal') map[p.type] = p.value
  }
  const wdMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }
  return {
    year: Number(map.year),
    month: Number(map.month),
    day: Number(map.day),
    hour: Number(map.hour),
    minute: Number(map.minute),
    second: Number(map.second),
    weekday: wdMap[map.weekday],
  }
}
