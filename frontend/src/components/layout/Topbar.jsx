import { Bell, Menu, Moon, Sun } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useLanguage } from '../../contexts/useLanguage'
import { useTheme } from '../../contexts/ThemeContext'
import Button from '../ui/Button'

export default function Topbar({ onMenu }) {
  const { user, logout } = useAuth()
  const { resolved, setTheme } = useTheme()
  const { language, toggleLanguage, t } = useLanguage()

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
          {t('Know where your money is.')}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setTheme(resolved === 'dark' ? 'light' : 'dark')}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700"
          aria-label={resolved === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          title={resolved === 'dark' ? 'Light mode' : 'Dark mode'}
        >
          {resolved === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
        <button
          type="button"
          onClick={toggleLanguage}
          className="h-10 rounded-xl border border-slate-200 px-3 text-sm font-medium dark:border-slate-700"
          aria-label={language === 'en' ? 'Switch language to Nepali' : 'Switch language to English'}
        >
          {language === 'en' ? 'नेपाली' : 'English'}
        </button>
        <Link
          to="/dashboard/notifications"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
        </Link>
        <span className="hidden text-sm font-medium sm:inline">{user?.name}</span>
        <Button variant="ghost" size="sm" onClick={logout}>
          {t('Log out')}
        </Button>
      </div>
    </header>
  )
}
