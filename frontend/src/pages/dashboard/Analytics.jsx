import { useFinance } from '../../hooks/useFinance'
import AreaChart from '../../components/sections/AreaChart'
import BarChart from '../../components/sections/BarChart'
import DonutChart from '../../components/sections/DonutChart'
import SectionCard from '../../components/sections/SectionCard'
import { getCategorySpending, getMonthlyTrend, getSourceSpending } from '../../utils/dashboardData'

export default function Analytics() {
  const { transactions, settings } = useFinance()
  const currency = settings.currency
  const trend = getMonthlyTrend(transactions)
  const categories = getCategorySpending(transactions)
  const sources = getSourceSpending(transactions)
  const savingsTrend = trend.map((row) => ({ name: row.month, value: row.savings }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
        <p className="text-sm text-slate-500">Charts summarize your recorded financial activity.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Income vs expense">
          <AreaChart data={trend} currency={currency} />
        </SectionCard>
        <SectionCard title="Savings trend">
          <BarChart data={savingsTrend} currency={currency} />
        </SectionCard>
        <SectionCard title="Category spending">
          <DonutChart data={categories} currency={currency} />
        </SectionCard>
        <SectionCard title="Payment-source spending">
          <BarChart data={sources} currency={currency} />
        </SectionCard>
      </div>

    </div>
  )
}
