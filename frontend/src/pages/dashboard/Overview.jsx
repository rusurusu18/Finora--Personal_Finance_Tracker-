import { useFinance } from '../../hooks/useFinance'
import { useAuth } from '../../contexts/AuthContext'
import MoneySourceCard from '../../components/finance/MoneySourceCard'
import BudgetCard from '../../components/finance/BudgetCard'
import SavingsGoalCard from '../../components/finance/SavingsGoalCard'
import TransactionList from '../../components/finance/TransactionList'
import FinancialSummary from '../../components/sections/FinancialSummary'
import StatCard from '../../components/sections/StatCard'
import AreaChart from '../../components/sections/AreaChart'
import SpendingOverview from '../../components/sections/SpendingOverview'
import SectionCard from '../../components/sections/SectionCard'
import Skeleton from '../../components/ui/Skeleton'
import { getCategorySpending, getMonthlyTrend } from '../../utils/dashboardData'
import { getGreeting } from '../../utils/helpers'

export default function Overview() {
  const { user } = useAuth()
  const { loading, totals, monthStats, budgetRemaining, transactions, budgets, savingsGoals, settings } =
    useFinance()
  const currency = settings.currency
  const trend = getMonthlyTrend(transactions)
  const categories = getCategorySpending(transactions)

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

      <FinancialSummary total={totals.total} currency={currency} />

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
        <SectionCard title="Income vs expense" description="Monthly totals from your recorded transactions.">
          <AreaChart data={trend} currency={currency} />
        </SectionCard>
        <SpendingOverview data={categories} currency={currency} />
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
