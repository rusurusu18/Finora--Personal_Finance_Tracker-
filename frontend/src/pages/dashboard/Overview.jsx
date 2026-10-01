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
import { useLanguage } from '../../contexts/useLanguage'
import {
  FiActivity,
  FiArrowDownLeft,
  FiArrowUpRight,
  FiCreditCard,
  FiList,
  FiPieChart,
  FiTarget,
  FiTrendingUp,
} from 'react-icons/fi'

export default function Overview() {
  const { t } = useLanguage()
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
          {t(getGreeting())} 👋
        </h1>
        <p className="mt-1 text-slate-500">
          {t("Here's your financial picture")}{user?.name ? `, ${user.name.split(' ')[0]}` : ''}.
        </p>
      </div>

      <FinancialSummary total={totals.total} currency={currency} />

      <div className="grid gap-4 md:grid-cols-3">
        <MoneySourceCard label={t('Bank')} amount={totals.bank} currency={currency} icon={FiArrowUpRight} />
        <MoneySourceCard label={t('Wallets')} amount={totals.wallets} currency={currency} icon={FiCreditCard} />
        <MoneySourceCard label={t('Cash')} amount={totals.cash} currency={currency} icon={FiArrowDownLeft} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label={t('Income')} value={monthStats.income} currency={currency} icon={FiArrowDownLeft} />
        <StatCard label={t('Expenses')} value={monthStats.expenses} currency={currency} icon={FiArrowUpRight} />
        <StatCard label={t('Savings')} value={monthStats.savings} currency={currency} icon={FiTrendingUp} />
        <StatCard label={t('Budget remaining')} value={budgetRemaining} currency={currency} icon={FiPieChart} />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <SectionCard icon={FiActivity} title={t('Income vs expense')} description={t('Monthly totals from your recorded transactions.')}>
          <AreaChart data={trend} currency={currency} />
        </SectionCard>
        <SpendingOverview data={categories} currency={currency} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard icon={FiPieChart} title={t('Budgets')}>
          <div className="grid gap-4">
            {budgets.slice(0, 3).map((budget) => (
              <BudgetCard key={budget.id} budget={budget} currency={currency} />
            ))}
          </div>
        </SectionCard>
        <SectionCard icon={FiTarget} title={t('Savings goals')}>
          <div className="grid gap-4">
            {savingsGoals.slice(0, 3).map((goal) => (
              <SavingsGoalCard key={goal.id} goal={goal} currency={currency} />
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard icon={FiList} title={t('Recent transactions')}>
        <TransactionList transactions={transactions.slice(0, 6)} currency={currency} />
      </SectionCard>
    </div>
  )
}
