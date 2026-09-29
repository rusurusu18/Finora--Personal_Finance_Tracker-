import { useMemo, useState } from 'react'
import { useFinance } from '../../hooks/useFinance'
import { useToast } from '../../components/ui/Toast'
import Button from '../../components/ui/Button'
import Select from '../../components/ui/Select'
import SectionCard from '../../components/sections/SectionCard'
import { REPORT_PERIODS } from '../../utils/constants'
import { downloadCsv, formatCurrency, formatDate } from '../../utils/helpers'

export default function Reports() {
  const { transactions, settings } = useFinance()
  const { push } = useToast()
  const [period, setPeriod] = useState('monthly')
  const currency = settings.currency
  const now = new Date()
  const currentMonth = now.toISOString().slice(0, 7)
  const currentYear = String(now.getFullYear())

  const rows = useMemo(() => {
    if (period === 'income') return transactions.filter((item) => item.type === 'income')
    if (period === 'expense') return transactions.filter((item) => item.type === 'expense')
    if (period === 'yearly') return transactions.filter((item) => item.date.startsWith(currentYear))
    if (period === 'category') return transactions.filter((item) => item.type === 'expense')
    return transactions.filter((item) => item.date.startsWith(currentMonth))
  }, [period, transactions, currentMonth, currentYear])

  const total = rows.reduce((sum, item) => sum + (item.type === 'income' ? item.amount : -item.amount), 0)

  function exportCsv() {
    downloadCsv('finora-report.csv', [
      ['Title', 'Type', 'Category', 'Source', 'Date', 'Amount'],
      ...rows.map((item) => [
        item.title,
        item.type,
        item.category,
        item.paymentSource,
        item.date,
        item.amount,
      ]),
    ])
    push('CSV downloaded.', 'success')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Reports</h1>
          <p className="text-sm text-slate-500">Reports use your saved transactions.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" className="no-print" onClick={exportCsv}>
            Export CSV
          </Button>
          <Button className="no-print" onClick={() => window.print()}>
            Print report
          </Button>
        </div>
      </div>

      <Select id="period" label="Report type" value={period} onChange={(event) => setPeriod(event.target.value)}>
        {REPORT_PERIODS.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </Select>

      <SectionCard title="Summary" description={`Net movement ${formatCurrency(total, currency)}`}>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="text-slate-500">
                <th className="py-2 font-medium">Title</th>
                <th className="py-2 font-medium">Category</th>
                <th className="py-2 font-medium">Date</th>
                <th className="py-2 font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((item) => (
                <tr key={item.id} className="border-t border-slate-100 dark:border-slate-700">
                  <td className="py-2">{item.title}</td>
                  <td className="py-2">{item.category}</td>
                  <td className="py-2">{formatDate(item.date)}</td>
                  <td className="py-2">{formatCurrency(item.amount, currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  )
}
