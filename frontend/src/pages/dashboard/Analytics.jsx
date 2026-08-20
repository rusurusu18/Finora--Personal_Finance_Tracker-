import { useFinance } from '../../hooks/useFinance'
import AreaChart from '../../sections/AreaChart'
import BarChart from '../../sections/BarChart'
import DonutChart from '../../sections/DonutChart'
import SectionCard from '../../sections/SectionCard'
import FinancialInsight from '../../finance/FinancialInsight'
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
        <p className="text-sm text-slate-500">Charts update when mock transactions change.</p>
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

      <div className="grid gap-4 md:grid-cols-2">
        <FinancialInsight
          tone="warning"
          title="Food spending increased by 18%."
          message="August food spend is higher than July on the current mock set."
        />
        <FinancialInsight
          tone="success"
          title="Your savings rate improved by 8%."
          message="Income still covers core bills with room left for goals."
        />
      </div>
    </div>
  )
}
