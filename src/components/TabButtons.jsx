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
        <span aria-hidden="true">{'<>'}</span>
        <span className="justify-self-center">{tabWorkText}</span>
        <span aria-hidden="true">{'{}'}</span>
      </button>
      <button
        className={`${classes.tabBase} ${activeTab === 'salaryTab' ? classes.tabActive : ''}`}
        type="button"
        role="tab"
        aria-selected={activeTab === 'salaryTab' ? 'true' : 'false'}
        onClick={() => updateUrlWithTab('salaryTab')}
      >
        <span aria-hidden="true">$</span>
        <span className="justify-self-center">{tabSalaryText}</span>
        <span aria-hidden="true">{'/>'}</span>
      </button>
    </div>
  )
}
