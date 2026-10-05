import { STORAGE_KEYS } from '../utils/constants'
import { notifyAppError } from '../utils/appErrors'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'
const NETWORK_ERROR_MESSAGE = 'The service is temporarily unavailable. Please check your connection and try again.'

export async function apiRequest(path, options = {}) {
  const accessToken = localStorage.getItem(STORAGE_KEYS.accessToken)
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...options.headers,
    },
  }).catch((requestError) => {
    const message = requestError instanceof TypeError
      ? NETWORK_ERROR_MESSAGE
      : requestError.message || 'The request could not be completed.'
    notifyAppError(message)
    throw new Error(message, { cause: requestError })
  })
  const body = await response.json().catch(() => ({}))

  if (!response.ok || body.success === false) {
    const error = new Error(body.message || 'The request could not be completed.')
    error.validationErrors = Array.isArray(body.errors)
      ? body.errors.map((issue) => ({ field: issue.path?.[0], message: issue.message }))
      : []
    notifyAppError(error.message)
    throw error
  }

  return body
}

const getData = async (path, options) => (await apiRequest(path, options)).data
const json = (method, payload) => ({ method, body: JSON.stringify(payload) })

function withQuery(path, params = {}) {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.set(key, String(value))
    }
  })
  const search = query.toString()
  return search ? `${path}?${search}` : path
}

function transactionQuery(filters) {
  const { from, to, ...params } = filters
  return {
    ...params,
    type: params.type ? String(params.type).toUpperCase() : undefined,
    startDate: params.startDate || from,
    endDate: params.endDate || to,
  }
}

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

export async function getTransactions(filters = {}) {
  const transactions = []
  let page = 1
  let hasNextPage = true
  const query = transactionQuery(filters)
  while (hasNextPage) {
    const response = await apiRequest(withQuery('/transactions', { ...query, page, limit: 100 }))
    transactions.push(...response.data.map(mapTransaction))
    hasNextPage = Boolean(response.meta?.hasNextPage)
    page += 1
  }
  return transactions
}

export async function getTransactionSummary(filters = {}) {
  return getData(withQuery('/transactions/summary', transactionQuery(filters)))
}

export async function getTransaction(id) {
  return mapTransaction(await getData(`/transactions/${id}`))
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

export async function getAccount(id) {
  const account = await getData(`/accounts/${id}`)
  return {
    ...mapAccount(account),
    transactions: account.transactions?.map(mapTransaction) || [],
  }
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

export async function getBudget(id) {
  return mapBudget(await getData(`/budgets/${id}`))
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

export async function getSavingsGoals(status) {
  const goalStatus = status ? String(status).toUpperCase() : undefined
  return (await getData(withQuery('/goals', { status: goalStatus }))).map(mapGoal)
}

export async function getSavingsGoal(id) {
  return mapGoal(await getData(`/goals/${id}`))
}

export async function createSavingsGoal(payload) {
  return mapGoal(await getData('/goals', json('POST', goalPayload(payload))))
}

export async function updateSavingsGoal(id, payload) {
  return mapGoal(await getData(`/goals/${id}`, json('PATCH', goalPayload(payload))))
}

export async function depositToSavingsGoal(id, amount) {
  return mapGoal(await getData(`/goals/${id}/deposit`, json('POST', { amount: Number(amount) })))
}

export async function deleteSavingsGoal(id) {
  return getData(`/goals/${id}`, { method: 'DELETE' })
}

export async function getNotifications(unreadOnly = false) {
  return (await getData(withQuery('/notifications', { unread: unreadOnly ? true : undefined }))).map((notification) => ({
    ...notification,
    read: notification.read ?? notification.isRead,
    body: notification.body ?? notification.message,
  }))
}

export async function markNotificationRead(id) {
  await getData(`/notifications/${id}/read`, { method: 'PATCH' })
  return getNotifications()
}

export async function markAllNotificationsRead() {
  return getData('/notifications/read-all', { method: 'PATCH' })
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

export async function getDashboardSummary() {
  const summary = await getData('/dashboard')
  return {
    ...summary,
    accounts: summary.accounts.map(mapAccount),
    recentTransactions: summary.recentTransactions.map(mapTransaction),
    budgets: summary.budgets.map(mapBudget),
    goals: summary.goals.map(mapGoal),
  }
}

export async function loginRequest(credentials) {
  const response = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })
  return response.data
}

export async function getAuthProfileRequest() {
  return getData('/auth/profile')
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

export async function refreshTokenRequest(refreshToken = localStorage.getItem(STORAGE_KEYS.refreshToken)) {
  if (!refreshToken) {
    throw new Error('A refresh token is required.')
  }
  return getData('/auth/refresh-token', json('POST', { refreshToken }))
}

export async function logoutRequest() {
  return getData('/auth/logout', { method: 'POST' })
}

export async function forgotPasswordRequest(email) {
  return apiRequest('/auth/forgot-password', json('POST', { email }))
}

export async function resetPasswordRequest(token, password) {
  return apiRequest('/auth/reset-password', json('POST', { token, password }))
}

export async function getCategories(type) {
  const categoryType = type ? String(type).toUpperCase() : undefined
  return (await getData(withQuery('/categories', { type: categoryType }))).map(mapCategory)
}

export async function getCategory(id) {
  return mapCategory(await getData(`/categories/${id}`))
}

export async function createCategory(payload) {
  return mapCategory(await getData('/categories', json('POST', {
    ...payload,
    type: payload.type.toUpperCase(),
  })))
}

export async function updateCategory(id, payload) {
  return mapCategory(await getData(`/categories/${id}`, json('PATCH', payload)))
}

export async function deleteCategory(id) {
  return getData(`/categories/${id}`, { method: 'DELETE' })
}

export async function seedDefaultCategories() {
  return getData('/categories/seed-defaults', { method: 'POST' })
}

export async function translateTextRequest(text) {
  return getData('/translations/translate', json('POST', { text }))
}

export async function getProfileRequest() {
  return getData('/users/me')
}

export async function deleteProfileRequest() {
  return getData('/users/me', { method: 'DELETE' })
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
