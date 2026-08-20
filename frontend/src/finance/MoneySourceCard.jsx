import Card from '../ui/Card'
import { formatCurrency } from '../utils/helpers'

export default function MoneySourceCard({ label, amount, currency, hint }) {
  return (
    <Card className="p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{formatCurrency(amount, currency)}</p>
      {hint ? <p className="mt-2 text-sm text-slate-500">{hint}</p> : null}
    </Card>
  )
}
