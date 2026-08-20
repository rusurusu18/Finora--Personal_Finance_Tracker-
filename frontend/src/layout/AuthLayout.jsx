import { Outlet } from 'react-router-dom'
import { Link } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-10">
        <Link to="/" className="mb-8 text-center text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
          FINORA
        </Link>
        <Outlet />
      </div>
    </div>
  )
}
