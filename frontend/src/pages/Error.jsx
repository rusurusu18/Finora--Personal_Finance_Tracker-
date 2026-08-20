import { Link } from 'react-router-dom'
import Button from '../ui/Button'

export default function Error() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-medium text-indigo-600">404</p>
      <h1 className="mt-2 text-3xl font-semibold">This page is not in Finora</h1>
      <p className="mt-3 text-slate-600 dark:text-slate-300">
        The route you opened does not exist. Head back to the homepage or dashboard.
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
