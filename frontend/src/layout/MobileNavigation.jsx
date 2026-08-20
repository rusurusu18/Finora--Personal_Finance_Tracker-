import { NavLink } from 'react-router-dom'
import { ChartColumn, LayoutDashboard, Receipt, Target, Wallet } from 'lucide-react'
import { cn } from '../utils/helpers'

const items = [
  { to: '/dashboard', label: 'Home', icon: LayoutDashboard, end: true },
  { to: '/dashboard/transactions', label: 'Activity', icon: Receipt },
  { to: '/dashboard/budgets', label: 'Budgets', icon: Target },
  { to: '/dashboard/accounts', label: 'Money', icon: Wallet },
  { to: '/dashboard/analytics', label: 'Insights', icon: ChartColumn },
]

export default function MobileNavigation() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white px-2 py-2 md:hidden dark:border-slate-800 dark:bg-slate-950"
      aria-label="Mobile dashboard"
    >
      <ul className="grid grid-cols-5 gap-1">
        {items.map(({ to, label, icon: Icon, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-1 rounded-xl px-1 py-1.5 text-[11px]',
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-300'
                    : 'text-slate-500 dark:text-slate-400',
                )
              }
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
