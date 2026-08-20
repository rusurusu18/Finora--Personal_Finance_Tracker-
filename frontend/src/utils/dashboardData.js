import { formatCurrency, isCurrentMonth, monthKey, percent, sumBy } from './helpers'

export function getAccountTotals(accounts) {
  const bank = accounts
    .filter((account) => account.type === 'bank')
    .reduce((sum, account) => sum + account.balance, 0)
  const wallets = accounts
    .filter((account) => account.type === 'wallet')
    .reduce((sum, account) => sum + account.balance, 0)
  const cash = accounts
    .filter((account) => account.type === 'cash')
    .reduce((sum, account) => sum + account.balance, 0)

  return {
    bank,
    wallets,
    cash,
    total: bank + wallets + cash,
  }
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
