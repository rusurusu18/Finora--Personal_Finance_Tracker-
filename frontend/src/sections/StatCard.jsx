import Card from '../ui/Card'
import { formatCurrency } from '../utils/helpers'

export default function StatCard({ label, value, hint, currency, isCurrency = true }) {
  return (
    <Card className="p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight">
        {isCurrency ? formatCurrency(value, currency) : value}
      </p>
      {hint ? <p className="mt-2 text-sm text-slate-500">{hint}</p> : null}
    </Card>
  )
}
