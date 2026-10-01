import Card from '../ui/Card'
import { clampPercent, formatCurrency, formatDate, percent } from '../../utils/helpers'
import { FiTarget } from 'react-icons/fi'
import { useLanguage } from '../../contexts/useLanguage'

export default function SavingsGoalCard({ goal, currency, onEdit, onDelete }) {
  const { t } = useLanguage()
  const progress = clampPercent(percent(goal.currentAmount, goal.targetAmount))

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <FiTarget className="h-4 w-4 text-slate-500" aria-hidden="true" />
            <h3 className="font-semibold">{goal.name}</h3>
          </div>
          <p className="text-sm text-slate-500">{t('Target')} {formatDate(goal.targetDate)}</p>
        </div>
        <p className="text-sm font-medium">{progress}%</p>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
        <div className="h-full rounded-full bg-emerald-600" style={{ width: `${progress}%` }} />
      </div>
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
        {formatCurrency(goal.currentAmount, currency)} {t('of')} {formatCurrency(goal.targetAmount, currency)}
      </p>
      {onEdit || onDelete ? (
        <div className="mt-4 flex gap-3">
          {onEdit ? (
            <button type="button" className="text-sm text-indigo-600" onClick={() => onEdit(goal)}>
              {t('Edit')}
            </button>
          ) : null}
          {onDelete ? (
            <button type="button" className="text-sm text-red-600" onClick={() => onDelete(goal)}>
              {t('Delete')}
            </button>
          ) : null}
        </div>
      ) : null}
    </Card>
  )
}
