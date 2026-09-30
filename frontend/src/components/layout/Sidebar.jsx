import { NavLink } from 'react-router-dom'
import { cn } from '../../utils/helpers'
import { useLanguage } from '../../contexts/useLanguage'
import { dashboardLinks } from './dashboardLinks'

export default function Sidebar() {
  const { t } = useLanguage()
  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white md:flex md:flex-col dark:border-slate-800 dark:bg-slate-950">
      <div className="flex h-16 items-center px-5">
        <span className="text-lg font-semibold tracking-tight">FINORA</span>
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-3 pb-6" aria-label="Dashboard">
        {dashboardLinks.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium',
                isActive
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                  : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900',
              )
            }
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {t(label)}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
