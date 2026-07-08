// Query parameters
export const TAB_QUERY_KEY = 'tab'
export const LANG_QUERY_KEY = 'lang'

// Languages
export const SUPPORTED_LANGS = new Set(['vi', 'en'])
export const VALID_TAB_IDS = new Set(['workTab', 'salaryTab'])

// Timezone & Time
export const TZ = 'Asia/Ho_Chi_Minh'
export const SALARY_HOUR = 15
export const WORK_START_HOUR = 8
export const LUNCH_START_HOUR = 11
export const LUNCH_END_HOUR = 12
export const LATE_ALLOW_MIN = 15
export const WORK_END_STORAGE_KEY = 'workEndTime'
export const DEFAULT_WORK_END_HOUR = 17
export const DEFAULT_WORK_END_MIN = 0
export const MIN_WORK_END_MINUTES = LUNCH_END_HOUR * 60
export const MAX_WORK_END_MINUTES = 23 * 60 + 59

// Holidays
export const HOLIDAYS = new Set([
  '2025-01-01',
  '2025-04-30',
  '2025-05-01',
  '2025-09-02',
  '2026-01-01',
  '2026-04-30',
  '2026-05-01',
  '2026-09-02',
  '2027-01-01',
  '2027-04-30',
  '2027-05-01',
  '2027-09-02',
])
