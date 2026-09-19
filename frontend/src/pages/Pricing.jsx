import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { useNavigate } from 'react-router-dom'
import { FiUser, FiHome, FiArrowRight } from 'react-icons/fi'

const plans = [
  {
    name: 'Personal',
    price: 'Free during preview',
    icon: FiUser,
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-100 dark:bg-blue-950',
    points: ['Mock dashboard', 'NPR-first sources', 'Budgets and goals'],
  },
  {
    name: 'Plus',
    price: 'Coming later',
    icon: FiHome,
    iconColor: 'text-violet-600',
    iconBg: 'bg-violet-100 dark:bg-violet-950',
    points: ['Shared household view', 'Export history', 'Priority support'],
  },
]

export default function Pricing() {
  const navigate = useNavigate()

  return (
    <main className="mx-auto max-w-5xl px-4 py-16">
      <div className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight">
          Simple, transparent pricing
        </h1>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {plans.map((plan) => {
          const Icon = plan.icon

          return (
            <Card
              key={plan.name}
              className="group relative overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Decorative background */}
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-slate-100 opacity-50 transition-transform duration-300 group-hover:scale-150 dark:bg-slate-800" />

              <div className="relative">
                {/* Icon */}
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${plan.iconBg}`}
                >
                  <Icon className={`h-6 w-6 ${plan.iconColor}`} />
                </div>

                {/* Plan name */}
                <div className="mt-5 flex items-center justify-between">
                  <h2 className="text-xl font-semibold">{plan.name}</h2>

                  {plan.name === 'Personal' && (
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 dark:bg-blue-950 dark:text-blue-300">
                      Preview
                    </span>
                  )}
                </div>

                {/* Price */}
                <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                  {plan.price}
                </p>

                {/* Features */}
                <ul className="mt-6 space-y-3">
                  {plan.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300"
                    >
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-xs text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                        ✓
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>

                {/* Button */}
                <Button
                  className="mt-7 w-full justify-center"
                  onClick={() => navigate('/register')}
                >
                  Get Started
                  <FiArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </Card>
          )
        })}
      </div>
    </main>
  )
}