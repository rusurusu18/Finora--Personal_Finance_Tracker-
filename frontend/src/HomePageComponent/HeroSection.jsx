import { Link } from 'react-router-dom'
import Button from '../ui/Button'
import { formatCurrency } from '../utils/helpers'

export default function HeroSection({ onGetStarted, onExplore }) {
  return (
    <section className="mx-auto grid max-w-6xl gap-12 px-4 py-16 lg:grid-cols-2 lg:items-center lg:py-24">
      <div>
        <p className="text-sm font-medium text-indigo-600">Personal finance for Nepal</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
          Know Where Your Money Is.
          <span className="mt-2 block">Know Where It&apos;s Going.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300">
          Finora brings bank accounts, cash, eSewa, Khalti, and Fonepay into one calm picture so you can
          track spending, set budgets, and see whether your goals are realistic.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button onClick={onGetStarted}>Get Started</Button>
          <Button variant="secondary" onClick={onExplore}>
            Explore Dashboard
          </Button>
        </div>
        <p className="mt-6 text-sm text-slate-500">
          Built around NPR. Later this frontend will connect to Express, MySQL, and JWT auth.
        </p>
      </div>

      <div aria-hidden="true" className="relative">
        <div className="absolute -top-6 -right-6 h-32 w-32 rounded-full bg-indigo-100 dark:bg-indigo-950" />
        <div className="absolute -bottom-8 left-8 h-24 w-24 rounded-2xl bg-emerald-100 dark:bg-emerald-950" />
        <div className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-500">Total money</p>
              <p className="mt-1 text-3xl font-semibold">{formatCurrency(86450)}</p>
            </div>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
              +12.4%
            </span>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              ['Bank', 55000],
              ['Wallets', 19450],
              ['Cash', 12000],
            ].map(([label, amount]) => (
              <div key={label} className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900">
                <p className="text-xs text-slate-500">{label}</p>
                <p className="mt-1 text-sm font-semibold">{formatCurrency(amount)}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 space-y-2">
            <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-700">
              <div className="h-2 w-3/4 rounded-full bg-indigo-600" />
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <span>Food budget</span>
              <span>75%</span>
            </div>
          </div>
          <p className="mt-5 text-sm text-slate-500">
            You spent 18% more on food this month.
          </p>
        </div>
        <p className="sr-only">
          Preview of the Finora dashboard showing total money, bank, wallets, cash, and a food budget.
        </p>
        <Link to="/dashboard" className="sr-only">
          Open dashboard
        </Link>
      </div>
    </section>
  )
}
