import { formatCurrency, isCurrentMonth, monthKey, percent, sumBy } from './helpers'

export function getAccountTotals(accounts, savingsGoals = []) {
  const bank = accounts
    .filter((account) => account.type === 'bank')
    .reduce((sum, account) => sum + account.balance, 0)
  const wallets = accounts
    .filter((account) => account.type === 'wallet')
    .reduce((sum, account) => sum + account.balance, 0)
  const cash = accounts
    .filter((account) => account.type === 'cash')
    .reduce((sum, account) => sum + account.balance, 0)
  const savingsSetAside = savingsGoals.reduce(
    (sum, goal) => sum + Number(goal.currentAmount ?? 0),
    0,
  )

  return {
    bank,
    wallets,
    cash,
    savingsSetAside,
    total: bank + wallets + cash - savingsSetAside,
  }
}

export function getNetWorthSummary(accounts = [], savingsGoals = [], loanPlans = []) {
  const bank = accounts
    .filter((account) => account.type === 'bank')
    .reduce((sum, account) => sum + Number(account.balance || 0), 0)
  const wallets = accounts
    .filter((account) => account.type === 'wallet')
    .reduce((sum, account) => sum + Number(account.balance || 0), 0)
  const cash = accounts
    .filter((account) => account.type === 'cash')
    .reduce((sum, account) => sum + Number(account.balance || 0), 0)
  const savingsSetAside = savingsGoals.reduce(
    (sum, goal) => sum + Number(goal.currentAmount ?? 0),
    0,
  )
  const debt = loanPlans.reduce(
    (sum, plan) => sum + Number(plan.principal || 0),
    0,
  )

  const assets = bank + wallets + cash + savingsSetAside

  return {
    bank,
    wallets,
    cash,
    savingsSetAside,
    debt,
    assets,
    liabilities: debt,
    total: assets - debt,
    netWorth: assets - debt,
  }
}

export function getFinancialHealthScore({ accounts = [], budgets = [], savingsGoals = [], loanPlans = [], monthStats = {} }) {
  const netWorth = getNetWorthSummary(accounts, savingsGoals, loanPlans)
  const assets = netWorth.assets
  const debt = netWorth.debt
  const monthlyIncome = Number(monthStats.income || 0)
  const monthlyExpense = Number(monthStats.expenses || 0)
  const monthlySavings = Number(monthStats.savings || 0)
  const budgetTotal = budgets.reduce((sum, budget) => sum + Number(budget.amount || 0), 0)
  const budgetSpent = budgets.reduce((sum, budget) => sum + Number(budget.spent || 0), 0)
  const budgetDelta = budgetTotal > 0 ? Math.max(0, budgetSpent - budgetTotal) : 0

  if (assets === 0 && debt === 0 && monthlyIncome === 0 && monthlyExpense === 0 && !budgets.length) {
    return {
      score: 0,
      label: 'Start tracking income and expenses to unlock your score.',
    }
  }

  const liquidityScore = Math.min(30, Math.max(0, (assets / Math.max(monthlyExpense || 1, 1)) * 8))
  const savingsScore = monthlyIncome > 0 ? Math.min(25, Math.max(0, (monthlySavings / monthlyIncome) * 100)) : 12
  const debtScore = debt > 0 ? Math.max(0, 25 - (debt / Math.max(assets || 1, 1)) * 30) : 25
  const budgetScore = budgets.length
    ? Math.max(0, 20 - (budgetDelta / Math.max(budgetTotal || 1, 1)) * 40)
    : 20

  const score = Math.max(0, Math.min(100, Math.round(liquidityScore + savingsScore + debtScore + budgetScore)))

  let label = 'Strong'
  if (score < 40) label = 'Needs attention'
  else if (score < 70) label = 'Stable'

  return { score, label }
}

export function getMonthStats(transactions, now = new Date()) {
  const current = transactions.filter((item) => isCurrentMonth(item.date, now))
  const previousDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const previous = transactions.filter((item) => isCurrentMonth(item.date, previousDate))

  const income = sumBy(current, (item) => item.type === 'income')
  const expenses = sumBy(current, (item) => item.type === 'expense')
  const prevIncome = sumBy(previous, (item) => item.type === 'income')
  const prevExpenses = sumBy(previous, (item) => item.type === 'expense')

  return {
    income,
    expenses,
    savings: income - expenses,
    prevIncome,
    prevExpenses,
    prevSavings: prevIncome - prevExpenses,
  }
}

export function getBudgetRemaining(budgets) {
  const amount = budgets.reduce((sum, budget) => sum + Number(budget.amount), 0)
  const spent = budgets.reduce((sum, budget) => sum + Number(budget.spent), 0)
  return amount - spent
}

export function getCategorySpending(transactions) {
  const map = {}
  transactions
    .filter((item) => item.type === 'expense')
    .forEach((item) => {
      map[item.category] = (map[item.category] || 0) + Number(item.amount)
    })
  return Object.entries(map).map(([name, value]) => ({ name, value }))
}

export function getSourceSpending(transactions) {
  const map = {}
  transactions
    .filter((item) => item.type === 'expense')
    .forEach((item) => {
      map[item.paymentSource] = (map[item.paymentSource] || 0) + Number(item.amount)
    })
  return Object.entries(map).map(([name, value]) => ({ name, value }))
}

export function getMonthlyTrend(transactions) {
  const map = {}
  transactions.forEach((item) => {
    const key = monthKey(item.date)
    if (!map[key]) map[key] = { month: key, income: 0, expense: 0 }
    if (item.type === 'income') map[key].income += Number(item.amount)
    if (item.type === 'expense') map[key].expense += Number(item.amount)
  })
  return Object.values(map)
    .sort((a, b) => a.month.localeCompare(b.month))
    .map((row) => ({
      ...row,
      savings: row.income - row.expense,
    }))
}

export function getOverviewChange(currentTotal, previousHint = 0.124) {
  return previousHint
}

export function describeInsightChange(label, current, previous) {
  if (!previous) {
    return `${label} has no prior month to compare yet.`
  }
  const change = percent(current - previous, previous)
  const direction = change >= 0 ? 'increased' : 'decreased'
  return `${label} ${direction} by ${Math.abs(change)}%.`
}

export { formatCurrency }
