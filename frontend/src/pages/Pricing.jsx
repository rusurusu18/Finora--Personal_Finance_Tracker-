import Card from '../ui/Card'
import Button from '../ui/Button'
import { useNavigate } from 'react-router-dom'

const plans = [
  {
    name: 'Personal',
    price: 'Free during preview',
    points: ['Mock dashboard', 'NPR-first sources', 'Budgets and goals'],
  },
  {
    name: 'Plus',
    price: 'Coming later',
    points: ['Shared household view', 'Export history', 'Priority support'],
  },
]

export default function Pricing() {
  const navigate = useNavigate()

  return (
    <main className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Pricing</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-300">
        Billing is not connected yet. These cards describe the intended product shape.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {plans.map((plan) => (
          <Card key={plan.name} className="p-6">
            <h2 className="text-lg font-semibold">{plan.name}</h2>
            <p className="mt-2 text-slate-500">{plan.price}</p>
            <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              {plan.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <Button className="mt-6" onClick={() => navigate('/register')}>
              Get Started
            </Button>
          </Card>
        ))}
      </div>
    </main>
  )
}
