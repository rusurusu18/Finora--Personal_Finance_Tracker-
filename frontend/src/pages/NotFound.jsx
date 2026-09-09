import { Link } from 'react-router-dom'
import Button from '../ui/Button'

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl font-bold text-indigo-600">404</p>

      <h1 className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white">
        Page Not Found
      </h1>

      <p className="mt-3 text-slate-600 dark:text-slate-300">
        Sorry, we couldn't find the page you're looking for. It may have been
        moved, deleted, or the URL may be incorrect.
      </p>

      <div className="mt-6 flex gap-3">
        <Link to="/">
          <Button>Home</Button>
        </Link>

        <Link to="/dashboard">
          <Button variant="secondary">Dashboard</Button>
        </Link>
      </div>
    </main>
  )
}
