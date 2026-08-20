import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import MobileNavigation from './MobileNavigation'
import Sidebar, { dashboardLinks } from './Sidebar'
import Topbar from './Topbar'
import { cn } from '../utils/helpers'

export default function AdminLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar onMenu={() => setDrawerOpen(true)} />
          <main className="flex-1 px-4 py-6 pb-24 md:px-6 md:pb-8">
            <Outlet />
          </main>
        </div>
      </div>
      <MobileNavigation />

      {drawerOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/50"
            aria-label="Close navigation drawer"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="relative h-full w-72 bg-white p-4 dark:bg-slate-950">
            <p className="mb-4 text-lg font-semibold">FINORA</p>
            <nav className="flex flex-col gap-1">
              {dashboardLinks.map(({ to, label, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={() => setDrawerOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'rounded-xl px-3 py-2.5 text-sm',
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                        : 'text-slate-700 dark:text-slate-200',
                    )
                  }
                >
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      ) : null}
    </div>
  )
}
