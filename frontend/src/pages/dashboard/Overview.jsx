import { useFinance } from '../../hooks/useFinance'
import { useAuth } from '../../contexts/AuthContext'
import MoneySourceCard from '../../finance/MoneySourceCard'
import BudgetCard from '../../finance/BudgetCard'
import SavingsGoalCard from '../../finance/SavingsGoalCard'
import FinancialInsight from '../../finance/FinancialInsight'
import TransactionList from '../../finance/TransactionList'
import FinancialSummary from '../../sections/FinancialSummary'
import StatCard from '../../sections/StatCard'
import AreaChart from '../../sections/AreaChart'
import SpendingOverview from '../../sections/SpendingOverview'
import SectionCard from '../../sections/SectionCard'
import Skeleton from '../../ui/Skeleton'
import { getCategorySpending, getMonthlyTrend } from '../../utils/dashboardData'
import { getGreeting } from '../../utils/helpers'
import { seedInsights } from '../../utils/dummyData'

export default function Overview() {
  const { user } = useAuth()
  const { loading, totals, monthStats, budgetRemaining, transactions, budgets, savingsGoals, settings } =
    useFinance()
  const currency = settings.currency
  const trend = getMonthlyTrend(transactions)
  const categories = getCategorySpending(transactions.filter((item) => item.date.startsWith('2026-08')))

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
        <Skeleton className="h-72 md:col-span-2" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {getGreeting()} 👋
        </h1>
        <p className="mt-1 text-slate-500">
          Here&apos;s your financial picture{user?.name ? `, ${user.name.split(' ')[0]}` : ''}.
        </p>
      </div>

      <FinancialSummary total={totals.total} change={0.124} currency={currency} />

      <div className="grid gap-4 md:grid-cols-3">
        <MoneySourceCard label="Bank" amount={totals.bank} currency={currency} />
        <MoneySourceCard label="Wallets" amount={totals.wallets} currency={currency} />
        <MoneySourceCard label="Cash" amount={totals.cash} currency={currency} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Income" value={monthStats.income} currency={currency} />
        <StatCard label="Expenses" value={monthStats.expenses} currency={currency} />
        <StatCard label="Savings" value={monthStats.savings} currency={currency} />
        <StatCard label="Budget remaining" value={budgetRemaining} currency={currency} />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <SectionCard title="Income vs expense" description="Monthly trend from mock activity.">
          <AreaChart data={trend} currency={currency} />
        </SectionCard>
        <SpendingOverview data={categories} currency={currency} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {seedInsights.map((insight) => (
          <FinancialInsight key={insight.id} {...insight} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Budgets">
          <div className="grid gap-4">
            {budgets.slice(0, 3).map((budget) => (
              <BudgetCard key={budget.id} budget={budget} currency={currency} />
            ))}
          </div>
        </SectionCard>
        <SectionCard title="Savings goals">
          <div className="grid gap-4">
            {savingsGoals.slice(0, 3).map((goal) => (
              <SavingsGoalCard key={goal.id} goal={goal} currency={currency} />
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Recent transactions">
        <TransactionList transactions={transactions.slice(0, 6)} currency={currency} />
      </SectionCard>
    </div>
  )
}
