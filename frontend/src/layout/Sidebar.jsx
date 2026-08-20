import { NavLink } from 'react-router-dom'
import {
  Bell,
  ChartColumn,
  CreditCard,
  Flag,
  LayoutDashboard,
  Receipt,
  Settings,
  Target,
  Wallet,
} from 'lucide-react'
import { cn } from '../utils/helpers'

const links = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/dashboard/transactions', label: 'Transactions', icon: Receipt },
  { to: '/dashboard/budgets', label: 'Budgets', icon: Target },
  { to: '/dashboard/analytics', label: 'Analytics', icon: ChartColumn },
  { to: '/dashboard/accounts', label: 'Accounts', icon: Wallet },
  { to: '/dashboard/savings', label: 'Savings', icon: Flag },
  { to: '/dashboard/reports', label: 'Reports', icon: CreditCard },
  { to: '/dashboard/notifications', label: 'Notifications', icon: Bell },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white md:flex md:flex-col dark:border-slate-800 dark:bg-slate-950">
      <div className="flex h-16 items-center px-5">
        <span className="text-lg font-semibold tracking-tight">FINORA</span>
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-3 pb-6" aria-label="Dashboard">
        {links.map(({ to, label, icon: Icon, end }) => (
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
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export { links as dashboardLinks }
