import Card from '../ui/Card'
import { formatCurrency } from '../../utils/helpers'
import { useLanguage } from '../../contexts/useLanguage'

export default function FinancialSummary({ total, change, currency }) {
  const { t } = useLanguage()
  const positive = change >= 0

  return (
    <Card className="p-6">
      <p className="text-sm text-slate-500">{t('Available after savings')}</p>
      <p className="mt-2 text-4xl font-semibold tracking-tight">{formatCurrency(total, currency)}</p>
      <p className="mt-2 text-xs text-slate-500">{t('Savings goal balances are excluded.')}</p>
      {Number.isFinite(change) ? (
        <p className={`mt-3 text-sm font-medium ${positive ? 'text-emerald-600' : 'text-red-600'}`}>
          {positive ? '+' : ''}
          {(change * 100).toFixed(1)}% {t('vs last month')}
        </p>
      ) : null}
    </Card>
  )
}
