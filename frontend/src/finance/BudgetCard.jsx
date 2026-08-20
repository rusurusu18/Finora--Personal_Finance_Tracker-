import Card from '../ui/Card'
import Badge from '../ui/Badge'
import { clampPercent, formatCurrency, percent } from '../utils/helpers'

export default function BudgetCard({ budget, currency, onEdit, onDelete }) {
  const progress = clampPercent(percent(budget.spent, budget.amount))
  const remaining = budget.amount - budget.spent
  const tone = progress >= 100 ? 'danger' : progress >= 80 ? 'warning' : 'success'

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold">{budget.category}</h3>
          <p className="text-sm text-slate-500">Budget {formatCurrency(budget.amount, currency)}</p>
        </div>
        <Badge tone={tone}>{progress}%</Badge>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
        <div
          className="h-full rounded-full bg-indigo-600"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mt-3 flex justify-between text-sm text-slate-500">
        <span>Spent {formatCurrency(budget.spent, currency)}</span>
        <span>Left {formatCurrency(remaining, currency)}</span>
      </div>
      {onEdit || onDelete ? (
        <div className="mt-4 flex gap-3">
          {onEdit ? (
            <button type="button" className="text-sm text-indigo-600" onClick={() => onEdit(budget)}>
              Edit
            </button>
          ) : null}
          {onDelete ? (
            <button type="button" className="text-sm text-red-600" onClick={() => onDelete(budget)}>
              Delete
            </button>
          ) : null}
        </div>
      ) : null}
    </Card>
  )
}
