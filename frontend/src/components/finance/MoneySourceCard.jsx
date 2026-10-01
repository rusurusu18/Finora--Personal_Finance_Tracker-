import Card from '../ui/Card'
import { formatCurrency } from '../../utils/helpers'

export default function MoneySourceCard({ label, amount, currency, hint, icon: Icon }) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-500">{label}</p>
        {Icon ? <Icon className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" /> : null}
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{formatCurrency(amount, currency)}</p>
      {hint ? <p className="mt-2 text-sm text-slate-500">{hint}</p> : null}
    </Card>
  )
}
