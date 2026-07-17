import { Clock, Timer, Banknote, TrendingUp } from 'lucide-react'
import { getThemeClasses } from '../styles'
import { stripLeadingIcons } from '../utils'

export function TabButtons({ activeTab, updateUrlWithTab, tr, theme }) {
  const classes = getThemeClasses(theme === 'light')
  const tabWorkText = stripLeadingIcons(tr.tabWork)
  const tabSalaryText = stripLeadingIcons(tr.tabSalary)

  return (
    <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2" role="tablist" aria-label={tr.tabsAriaLabel}>
      <button
        className={`${classes.tabBase} ${activeTab === 'workTab' ? classes.tabActive : ''}`}
        type="button"
        role="tab"
        aria-selected={activeTab === 'workTab' ? 'true' : 'false'}
        onClick={() => updateUrlWithTab('workTab')}
      >
        <Clock size={16} aria-hidden="true" />
        <span className="justify-self-center">{tabWorkText}</span>
        <Timer size={16} aria-hidden="true" />
      </button>
      <button
        className={`${classes.tabBase} ${activeTab === 'salaryTab' ? classes.tabActive : ''}`}
        type="button"
        role="tab"
        aria-selected={activeTab === 'salaryTab' ? 'true' : 'false'}
        onClick={() => updateUrlWithTab('salaryTab')}
      >
        <Banknote size={16} aria-hidden="true" />
        <span className="justify-self-center">{tabSalaryText}</span>
        <TrendingUp size={16} aria-hidden="true" />
      </button>
    </div>
  )
}
