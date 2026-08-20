import Card from '../ui/Card'
import { formatCurrency } from '../utils/helpers'

export default function FinancialSummary({ total, change, currency }) {
  const positive = change >= 0

  return (
    <Card className="p-6">
      <p className="text-sm text-slate-500">Total money</p>
      <p className="mt-2 text-4xl font-semibold tracking-tight">{formatCurrency(total, currency)}</p>
      <p className={`mt-3 text-sm font-medium ${positive ? 'text-emerald-600' : 'text-red-600'}`}>
        {positive ? '+' : ''}
        {(change * 100).toFixed(1)}% vs last month
      </p>
    </Card>
  )
}
