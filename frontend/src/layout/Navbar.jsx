import { NavLink, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import Button from '../ui/Button'
import { NAV_PUBLIC } from '../utils/constants'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <NavLink to="/" className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
          FINORA
        </NavLink>

        <div className="hidden items-center gap-6 md:flex">
          {NAV_PUBLIC.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className="text-sm text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-300"
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {isAuthenticated ? (
            <Button onClick={() => navigate('/dashboard')}>Dashboard</Button>
          ) : (
            <>
              <Button variant="ghost" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button onClick={() => navigate('/register')}>Get Started</Button>
            </>
          )}
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 md:hidden dark:border-slate-700"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open ? (
        <div className="border-t border-slate-200 px-4 py-4 md:hidden dark:border-slate-800">
          <div className="flex flex-col gap-3">
            {NAV_PUBLIC.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                onClick={() => setOpen(false)}
                className="text-sm text-slate-700 dark:text-slate-200"
              >
                {item.label}
              </NavLink>
            ))}
            <Button
              variant="ghost"
              onClick={() => {
                setOpen(false)
                navigate('/login')
              }}
            >
              Login
            </Button>
            <Button
              onClick={() => {
                setOpen(false)
                navigate('/register')
              }}
            >
              Get Started
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  )
}
