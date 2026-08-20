import Card from '../ui/Card'
import { clampPercent, formatCurrency, formatDate, percent } from '../utils/helpers'

export default function SavingsGoalCard({ goal, currency, onEdit, onDelete }) {
  const progress = clampPercent(percent(goal.currentAmount, goal.targetAmount))

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold">{goal.name}</h3>
          <p className="text-sm text-slate-500">Target {formatDate(goal.targetDate)}</p>
        </div>
        <p className="text-sm font-medium">{progress}%</p>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
        <div className="h-full rounded-full bg-emerald-600" style={{ width: `${progress}%` }} />
      </div>
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
        {formatCurrency(goal.currentAmount, currency)} of {formatCurrency(goal.targetAmount, currency)}
      </p>
      {onEdit || onDelete ? (
        <div className="mt-4 flex gap-3">
          {onEdit ? (
            <button type="button" className="text-sm text-indigo-600" onClick={() => onEdit(goal)}>
              Edit
            </button>
          ) : null}
          {onDelete ? (
            <button type="button" className="text-sm text-red-600" onClick={() => onDelete(goal)}>
              Delete
            </button>
          ) : null}
        </div>
      ) : null}
    </Card>
  )
}
