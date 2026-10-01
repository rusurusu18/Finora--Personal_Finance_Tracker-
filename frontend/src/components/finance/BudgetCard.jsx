import Card from '../ui/Card'
import Badge from '../ui/Badge'
import { clampPercent, formatCurrency, percent } from '../../utils/helpers'
import { FiPieChart } from 'react-icons/fi'
import { useLanguage } from '../../contexts/useLanguage'

export default function BudgetCard({ budget, currency, onEdit, onDelete }) {
  const { t } = useLanguage()
  const progress = clampPercent(percent(budget.spent, budget.amount))
  const remaining = budget.amount - budget.spent
  const tone = progress >= 100 ? 'danger' : progress >= 80 ? 'warning' : 'success'

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <FiPieChart className="h-4 w-4 text-slate-500" aria-hidden="true" />
            <h3 className="font-semibold">{t(budget.category)}</h3>
          </div>
          <p className="text-sm text-slate-500">{t('Budget')} {formatCurrency(budget.amount, currency)}</p>
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
        <span>{t('Spent')} {formatCurrency(budget.spent, currency)}</span>
        <span>{t('Left')} {formatCurrency(remaining, currency)}</span>
      </div>
      {onEdit || onDelete ? (
        <div className="mt-4 flex gap-3">
          {onEdit ? (
            <button type="button" className="text-sm text-indigo-600" onClick={() => onEdit(budget)}>
              {t('Edit')}
            </button>
          ) : null}
          {onDelete ? (
            <button type="button" className="text-sm text-red-600" onClick={() => onDelete(budget)}>
              {t('Delete')}
            </button>
          ) : null}
        </div>
      ) : null}
    </Card>
  )
}
