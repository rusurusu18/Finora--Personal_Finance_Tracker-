import Card from '../ui/Card'
import { formatCurrency } from '../utils/helpers'

export default function CategoryCard({ name, amount, currency }) {
  return (
    <Card className="p-4">
      <p className="text-sm text-slate-500">{name}</p>
      <p className="mt-2 text-lg font-semibold">{formatCurrency(amount, currency)}</p>
    </Card>
  )
}
