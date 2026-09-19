import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-slate-500">
          Finora is a product preview.
        </p>
        <div className="flex gap-4 text-sm">
          <Link to="/about" className="text-slate-600 hover:text-indigo-600 dark:text-slate-300">
            About
          </Link>
          <Link to="/pricing" className="text-slate-600 hover:text-indigo-600 dark:text-slate-300">
            Pricing
          </Link>
          <Link to="/contact" className="text-slate-600 hover:text-indigo-600 dark:text-slate-300">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  )
}
