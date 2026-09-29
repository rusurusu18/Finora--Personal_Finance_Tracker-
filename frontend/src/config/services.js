import { STORAGE_KEYS } from '../utils/constants'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'

export async function apiRequest(path, options = {}) {
  const accessToken = localStorage.getItem(STORAGE_KEYS.accessToken)
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...options.headers,
    },
  })
  const body = await response.json().catch(() => ({}))

  if (!response.ok || body.success === false) {
    throw new Error(body.message || 'The request could not be completed.')
  }

  return body
}

const getData = async (path, options) => (await apiRequest(path, options)).data
const json = (method, payload) => ({ method, body: JSON.stringify(payload) })

function mapAccount(account) {
  return {
    ...account,
    type: account.type.toLowerCase(),
    balance: Number(account.balance),
    provider: account.institution,
  }
}

function mapCategory(category) {
  return { ...category, type: category.type.toLowerCase() }
}

function mapTransaction(transaction) {
  return {
    ...transaction,
    title: transaction.description,
    description: transaction.notes || '',
    amount: Number(transaction.amount),
    type: transaction.type.toLowerCase(),
    category: transaction.category?.name || '',
    paymentSource: transaction.paymentSource || transaction.account?.institution || transaction.account?.name || '',
    date: new Date(transaction.date).toISOString().slice(0, 10),
  }
}

export async function getTransactions() {
  const transactions = []
  let page = 1
  let hasNextPage = true
  while (hasNextPage) {
    const response = await apiRequest(`/transactions?page=${page}&limit=100`)
    transactions.push(...response.data.map(mapTransaction))
    hasNextPage = Boolean(response.meta?.hasNextPage)
    page += 1
  }
  return transactions
}

export async function createTransaction(payload) {
  const transaction = await getData('/transactions', json('POST', {
    accountId: payload.accountId,
    categoryId: payload.categoryId || null,
    type: payload.type.toUpperCase(),
    amount: Number(payload.amount),
    description: payload.title || payload.description,
    notes: payload.description || null,
    paymentSource: payload.paymentSource,
    date: new Date(`${payload.date}T00:00:00.000Z`).toISOString(),
  }))
  return mapTransaction(transaction)
}

export async function updateTransaction(id, payload) {
  const transaction = await getData(`/transactions/${id}`, json('PATCH', {
    accountId: payload.accountId,
    type: payload.type.toUpperCase(),
    categoryId: payload.categoryId || null,
    amount: Number(payload.amount),
    description: payload.title || payload.description,
    paymentSource: payload.paymentSource,
    notes: payload.description || null,
    date: new Date(`${payload.date}T00:00:00.000Z`).toISOString(),
  }))
  return mapTransaction(transaction)
}

export async function deleteTransaction(id) {
  return getData(`/transactions/${id}`, { method: 'DELETE' })
}

export async function getAccounts() {
  const response = await getData('/accounts')
  return response.accounts.map(mapAccount)
}

export async function createAccount(payload) {
  const account = await getData('/accounts', json('POST', {
    name: payload.name,
    type: payload.type.toUpperCase(),
    balance: Number(payload.balance || 0),
    currency: payload.currency || 'NPR',
    institution: payload.institution || payload.provider || null,
  }))
  return mapAccount(account)
}

export async function updateAccount(id, payload) {
  const account = await getData(`/accounts/${id}`, json('PATCH', {
    name: payload.name,
    type: payload.type.toUpperCase(),
    balance: Number(payload.balance),
    institution: payload.institution || payload.provider || null,
  }))
  return mapAccount(account)
}

export async function deleteAccount(id) {
  return getData(`/accounts/${id}`, { method: 'DELETE' })
}

export async function getBudgets() {
  return (await getData('/budgets')).map(mapBudget)
}

export async function createBudget(payload) {
  const { startDate, endDate } = budgetDates(payload.period)
  return mapBudget(await getData('/budgets', json('POST', {
    categoryId: payload.categoryId,
    amount: Number(payload.amount),
    period: 'MONTHLY',
    startDate,
    endDate,
  })))
}

export async function updateBudget(id, payload) {
  const { startDate, endDate } = budgetDates(payload.period)
  return mapBudget(await getData(`/budgets/${id}`, json('PATCH', {
    categoryId: payload.categoryId,
    amount: Number(payload.amount),
    period: 'MONTHLY',
    startDate,
    endDate,
  })))
}

export async function deleteBudget(id) {
  return getData(`/budgets/${id}`, { method: 'DELETE' })
}

export async function getSavingsGoals() {
  return (await getData('/goals')).map(mapGoal)
}

export async function createSavingsGoal(payload) {
  return mapGoal(await getData('/goals', json('POST', goalPayload(payload))))
}

export async function updateSavingsGoal(id, payload) {
  return mapGoal(await getData(`/goals/${id}`, json('PATCH', goalPayload(payload))))
}

export async function deleteSavingsGoal(id) {
  return getData(`/goals/${id}`, { method: 'DELETE' })
}

export async function getNotifications() {
  return (await getData('/notifications')).map((notification) => ({
    ...notification,
    read: notification.isRead,
    body: notification.message,
  }))
}

export async function markNotificationRead(id) {
  await getData(`/notifications/${id}/read`, { method: 'PATCH' })
  return getNotifications()
}

export async function getAnalytics() {
  const [transactions, accounts, budgets, savingsGoals] = await Promise.all([
    getTransactions(),
    getAccounts(),
    getBudgets(),
    getSavingsGoals(),
  ])
  return { transactions, accounts, budgets, savingsGoals }
}

export async function loginRequest(credentials) {
  const response = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })
  return response.data
}

export async function registerRequest(payload) {
  await apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      fullName: payload.name,
      email: payload.email,
      password: payload.password,
    }),
  })
  return loginRequest({ email: payload.email, password: payload.password })
}

export async function getCategories() {
  return (await getData('/categories')).map(mapCategory)
}

export async function updateProfileRequest(payload) {
  const profile = { fullName: payload.name }
  if (payload.phone !== undefined) profile.phone = payload.phone || null
  return getData('/users/me', json('PATCH', profile))
}

export async function changePasswordRequest(payload) {
  return getData('/auth/change-password', json('POST', payload))
}

export async function getEsewaPlusPlan() {
  return getData('/payments/esewa/plus-plan')
}

export async function initiateEsewaPayment() {
  return getData('/payments/esewa/initiate', { method: 'POST' })
}

export async function verifyEsewaPayment(data) {
  return getData('/payments/esewa/verify', json('POST', { data }))
}

function mapGoal(goal) {
  return {
    ...goal,
    targetAmount: Number(goal.targetAmount),
    currentAmount: Number(goal.currentAmount),
    status: goal.status.toLowerCase(),
    targetDate: goal.targetDate ? new Date(goal.targetDate).toISOString().slice(0, 10) : '',
  }
}

function mapBudget(budget) {
  return {
    ...budget,
    amount: Number(budget.amount),
    category: budget.category.name,
    period: budget.startDate.slice(0, 7),
  }
}

function goalPayload(payload) {
  return {
    name: payload.name,
    targetAmount: Number(payload.targetAmount),
    currentAmount: Number(payload.currentAmount || 0),
    targetDate: payload.targetDate ? new Date(`${payload.targetDate.slice(0, 10)}T00:00:00.000Z`).toISOString() : null,
  }
}

function budgetDates(period) {
  const selectedMonth = period || new Date().toISOString().slice(0, 7)
  const [year, month] = selectedMonth.split('-').map(Number)
  return {
    startDate: new Date(Date.UTC(year, month - 1, 1)).toISOString(),
    endDate: new Date(Date.UTC(year, month, 0, 23, 59, 59)).toISOString(),
  }
}
