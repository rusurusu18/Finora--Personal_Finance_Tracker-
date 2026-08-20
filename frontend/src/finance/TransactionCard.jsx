import Badge from '../ui/Badge'
import { formatCurrency, formatDate } from '../utils/helpers'

export default function TransactionCard({ transaction, currency, onEdit, onDelete }) {
  const isIncome = transaction.type === 'income'

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800 md:hidden">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-medium">{transaction.title}</h3>
          <p className="text-sm text-slate-500">{formatDate(transaction.date)}</p>
        </div>
        <p className={isIncome ? 'font-semibold text-emerald-600' : 'font-semibold text-slate-900 dark:text-white'}>
          {isIncome ? '+' : '-'}
          {formatCurrency(transaction.amount, currency)}
        </p>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Badge tone={isIncome ? 'success' : 'default'}>{transaction.type}</Badge>
        <Badge>{transaction.category}</Badge>
        <Badge tone="info">{transaction.paymentSource}</Badge>
      </div>
      <div className="mt-3 flex gap-3">
        <button type="button" className="text-sm text-indigo-600" onClick={() => onEdit(transaction)}>
          Edit
        </button>
        <button type="button" className="text-sm text-red-600" onClick={() => onDelete(transaction)}>
          Delete
        </button>
      </div>
    </article>
  )
}
