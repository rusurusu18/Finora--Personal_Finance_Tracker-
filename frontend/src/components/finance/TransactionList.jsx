import TransactionCard from './TransactionCard'
import EmptyState from '../ui/EmptyState'
import { formatCurrency, formatDate } from '../../utils/helpers'
import { useLanguage } from '../../contexts/useLanguage'

export default function TransactionList({
  transactions,
  currency,
  calendar = 'AD',
  onEdit,
  onDelete,
  onAdd,
}) {
  const { t } = useLanguage()
  if (!transactions.length) {
    return (
      <EmptyState
        title={t('No transactions match')}
        description={t('Try clearing filters or add a new transaction.')}
        actionLabel={t('Add transaction')}
        onAction={onAdd}
      />
    )
  }

  return (
    <>
      <div className="space-y-3 md:hidden">
        {transactions.map((transaction) => (
          <TransactionCard
            key={transaction.id}
            transaction={transaction}
            currency={currency}
            calendar={calendar}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      <div className="hidden overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800 md:block">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-slate-500 dark:border-slate-700">
            <tr>
              <th className="px-4 py-3 font-medium">{t('Title')}</th>
              <th className="px-4 py-3 font-medium">{t('Category')}</th>
              <th className="px-4 py-3 font-medium">{t('Source')}</th>
              <th className="px-4 py-3 font-medium">{t('Date')}</th>
              <th className="px-4 py-3 font-medium">{t('Amount')}</th>
              <th className="px-4 py-3 font-medium"> </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="border-b border-slate-100 last:border-0 dark:border-slate-700">
                <td className="px-4 py-3">
                  <p className="font-medium">{transaction.title}</p>
                  <p className="text-xs text-slate-500">{transaction.description}</p>
                </td>
                <td className="px-4 py-3">{t(transaction.category)}</td>
                <td className="px-4 py-3">{transaction.paymentSource}</td>
                <td className="px-4 py-3">{formatDate(transaction.date, calendar)}</td>
                <td className="px-4 py-3 font-medium">
                  {transaction.type === 'income' ? '+' : '-'}
                  {formatCurrency(transaction.amount, currency)}
                </td>
                <td className="px-4 py-3">
                  {onEdit || onDelete ? (
                    <div className="flex justify-end gap-3">
                      {onEdit ? (
                        <button type="button" className="text-indigo-600" onClick={() => onEdit(transaction)}>
                          {t('Edit')}
                        </button>
                      ) : null}
                      {onDelete ? (
                        <button type="button" className="text-red-600" onClick={() => onDelete(transaction)}>
                          {t('Delete')}
                        </button>
                      ) : null}
                    </div>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
