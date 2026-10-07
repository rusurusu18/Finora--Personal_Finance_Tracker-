import { useMemo, useState } from 'react'
import * as XLSX from 'xlsx'
import { useFinance } from '../../hooks/useFinance'
import { useToast } from '../../components/ui/Toast'
import Button from '../../components/ui/Button'
import Select from '../../components/ui/Select'
import SectionCard from '../../components/sections/SectionCard'
import { REPORT_PERIODS } from '../../utils/constants'
import { downloadCsv, formatCurrency, formatDate } from '../../utils/helpers'
import { FiDownload, FiFileText, FiPrinter } from 'react-icons/fi'
import { useLanguage } from '../../contexts/useLanguage'

export default function Reports() {
  const { t } = useLanguage()
  const { transactions, settings, accounts, savingsGoals, loanPlans } = useFinance()
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

  const assetTotal = accounts.reduce((sum, account) => sum + Number(account.balance || 0), 0)
  const goalTotal = savingsGoals.reduce((sum, goal) => sum + Number(goal.currentAmount || 0), 0)
  const debtTotal = loanPlans.reduce((sum, plan) => sum + Number(plan.principal || 0), 0)
  const netWorth = assetTotal + goalTotal - debtTotal

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
    push(t('CSV downloaded.'), 'success')
  }

  function exportExcel() {
    const table = [
      ['Title', 'Type', 'Category', 'Source', 'Date', 'Amount'],
      ...rows.map((item) => [
        item.title,
        item.type,
        item.category,
        item.paymentSource,
        formatDate(item.date, settings.calendar),
        Number(item.amount),
      ]),
    ]

    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.aoa_to_sheet(table)
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Finora Report')
    XLSX.writeFile(workbook, 'finora-report.xlsx')
    push(t('Excel file downloaded.'), 'success')
  }

  function exportPdf() {
    const printWindow = window.open('', '_blank', 'width=900,height=700')
    if (!printWindow) {
      push(t('Please allow pop-ups to export PDF.'), 'warning')
      return
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Finora Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #0f172a; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; }
            th, td { border: 1px solid #cbd5e1; padding: 8px; text-align: left; font-size: 12px; }
            .summary { margin-bottom: 16px; font-size: 14px; }
          </style>
        </head>
        <body>
          <h2>Finora Report</h2>
          <div class="summary">Net worth: ${formatCurrency(netWorth, currency)} &nbsp; | &nbsp; Movement: ${formatCurrency(total, currency)}</div>
          <table>
            <thead>
              <tr><th>Title</th><th>Type</th><th>Category</th><th>Date</th><th>Amount</th></tr>
            </thead>
            <tbody>
              ${rows
                .map(
                  (item) =>
                    `<tr><td>${item.title}</td><td>${item.type}</td><td>${item.category}</td><td>${formatDate(item.date, settings.calendar)}</td><td>${formatCurrency(item.amount, currency)}</td></tr>`,
                )
                .join('')}
            </tbody>
          </table>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
    push(t('PDF export started.'), 'success')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t('Reports')}</h1>
          <p className="text-sm text-slate-500">{t('Reports use your saved transactions.')}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" className="no-print" onClick={exportCsv}>
            <FiDownload aria-hidden="true" />
            {t('Export CSV')}
          </Button>
          <Button variant="secondary" className="no-print" onClick={exportExcel}>
            <FiFileText aria-hidden="true" />
            {t('Export Excel')}
          </Button>
          <Button className="no-print" onClick={exportPdf}>
            <FiPrinter aria-hidden="true" />
            {t('Export PDF')}
          </Button>
        </div>
      </div>

      <Select id="period" label={t('Report type')} value={period} onChange={(event) => setPeriod(event.target.value)}>
        {REPORT_PERIODS.map((item) => (
          <option key={item.value} value={item.value}>
            {t(item.label)}
          </option>
        ))}
      </Select>

      <SectionCard title={t('Summary')} description={`${t('Net movement')} ${formatCurrency(total, currency)}`}>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="text-slate-500">
                <th className="py-2 font-medium">{t('Title')}</th>
                <th className="py-2 font-medium">{t('Category')}</th>
                <th className="py-2 font-medium">{t('Date')}</th>
                <th className="py-2 font-medium">{t('Amount')}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((item) => (
                <tr key={item.id} className="border-t border-slate-100 dark:border-slate-700">
                  <td className="py-2">{item.title}</td>
                  <td className="py-2">{item.category}</td>
                  <td className="py-2">{formatDate(item.date, settings.calendar)}</td>
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
