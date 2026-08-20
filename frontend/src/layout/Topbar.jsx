import { Bell, Menu } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import Button from '../ui/Button'

export default function Topbar({ onMenu }) {
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 md:hidden dark:border-slate-700"
          aria-label="Open navigation"
          onClick={onMenu}
        >
          <Menu className="h-5 w-5" />
        </button>
        <p className="hidden text-sm text-slate-500 sm:block dark:text-slate-400">
          Know where your money is.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <label className="sr-only" htmlFor="theme-select">
          Theme
        </label>
        <select
          id="theme-select"
          value={theme}
          onChange={(event) => setTheme(event.target.value)}
          className="h-10 rounded-xl border border-slate-200 bg-white px-2 text-sm dark:border-slate-700 dark:bg-slate-900"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="system">System</option>
        </select>
        <Link
          to="/dashboard/notifications"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
        </Link>
        <span className="hidden text-sm font-medium sm:inline">{user?.name}</span>
        <Button variant="ghost" size="sm" onClick={logout}>
          Log out
        </Button>
      </div>
    </header>
  )
}
