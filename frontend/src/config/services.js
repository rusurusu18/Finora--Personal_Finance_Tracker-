import { STORAGE_KEYS } from '../utils/constants'
import {
  seedAccounts,
  seedBudgets,
  seedNotifications,
  seedSavingsGoals,
  seedTransactions,
} from '../utils/dummyData'
import { nextId } from '../utils/helpers'

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback))
      return structuredClone(fallback)
    }
    return JSON.parse(raw)
  } catch {
    return structuredClone(fallback)
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
  return value
}

function seedIfEmpty() {
  read(STORAGE_KEYS.transactions, seedTransactions)
  read(STORAGE_KEYS.accounts, seedAccounts)
  read(STORAGE_KEYS.budgets, seedBudgets)
  read(STORAGE_KEYS.savingsGoals, seedSavingsGoals)
  read(STORAGE_KEYS.notifications, seedNotifications)
}

seedIfEmpty()

/*
  Service layer — currently localStorage + mock data.
  Later, swap the body of each function to fetch('/api/...').
  UI components should keep calling these functions.
*/

export async function getTransactions() {
  return read(STORAGE_KEYS.transactions, seedTransactions)
}

export async function createTransaction(payload) {
  const items = await getTransactions()
  const item = { id: nextId(items), userId: 1, ...payload }
  write(STORAGE_KEYS.transactions, [item, ...items])
  return item
}

export async function updateTransaction(id, payload) {
  const items = await getTransactions()
  const next = items.map((item) => (item.id === id ? { ...item, ...payload } : item))
  write(STORAGE_KEYS.transactions, next)
  return next.find((item) => item.id === id)
}

export async function deleteTransaction(id) {
  const items = await getTransactions()
  write(
    STORAGE_KEYS.transactions,
    items.filter((item) => item.id !== id),
  )
  return { id }
}

export async function getAccounts() {
  return read(STORAGE_KEYS.accounts, seedAccounts)
}

export async function createAccount(payload) {
  const items = await getAccounts()
  const item = { id: nextId(items), userId: 1, currency: 'NPR', ...payload }
  write(STORAGE_KEYS.accounts, [...items, item])
  return item
}

export async function updateAccount(id, payload) {
  const items = await getAccounts()
  const next = items.map((item) => (item.id === id ? { ...item, ...payload } : item))
  write(STORAGE_KEYS.accounts, next)
  return next.find((item) => item.id === id)
}

export async function deleteAccount(id) {
  const items = await getAccounts()
  write(
    STORAGE_KEYS.accounts,
    items.filter((item) => item.id !== id),
  )
  return { id }
}

export async function getBudgets() {
  return read(STORAGE_KEYS.budgets, seedBudgets)
}

export async function createBudget(payload) {
  const items = await getBudgets()
  const item = { id: nextId(items), userId: 1, spent: 0, ...payload }
  write(STORAGE_KEYS.budgets, [...items, item])
  return item
}

export async function updateBudget(id, payload) {
  const items = await getBudgets()
  const next = items.map((item) => (item.id === id ? { ...item, ...payload } : item))
  write(STORAGE_KEYS.budgets, next)
  return next.find((item) => item.id === id)
}

export async function deleteBudget(id) {
  const items = await getBudgets()
  write(
    STORAGE_KEYS.budgets,
    items.filter((item) => item.id !== id),
  )
  return { id }
}

export async function getSavingsGoals() {
  return read(STORAGE_KEYS.savingsGoals, seedSavingsGoals)
}

export async function createSavingsGoal(payload) {
  const items = await getSavingsGoals()
  const item = { id: nextId(items), userId: 1, currentAmount: 0, ...payload }
  write(STORAGE_KEYS.savingsGoals, [...items, item])
  return item
}

export async function updateSavingsGoal(id, payload) {
  const items = await getSavingsGoals()
  const next = items.map((item) => (item.id === id ? { ...item, ...payload } : item))
  write(STORAGE_KEYS.savingsGoals, next)
  return next.find((item) => item.id === id)
}

export async function deleteSavingsGoal(id) {
  const items = await getSavingsGoals()
  write(
    STORAGE_KEYS.savingsGoals,
    items.filter((item) => item.id !== id),
  )
  return { id }
}

export async function getNotifications() {
  return read(STORAGE_KEYS.notifications, seedNotifications)
}

export async function markNotificationRead(id) {
  const items = await getNotifications()
  const next = items.map((item) => (item.id === id ? { ...item, read: true } : item))
  write(STORAGE_KEYS.notifications, next)
  return next
}

export async function resetFinanceData() {
  write(STORAGE_KEYS.transactions, seedTransactions)
  write(STORAGE_KEYS.accounts, seedAccounts)
  write(STORAGE_KEYS.budgets, seedBudgets)
  write(STORAGE_KEYS.savingsGoals, seedSavingsGoals)
  write(STORAGE_KEYS.notifications, seedNotifications)
  return true
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

export async function loginRequest(_credentials) {
  return {
    user: {
      id: 1,
      name: 'Aarav Sharma',
      email: 'aarav@finora.dev',
      city: 'Kathmandu',
    },
  }
}

export async function registerRequest(payload) {
  return {
    user: {
      id: 1,
      name: payload.name,
      email: payload.email,
      city: 'Nepal',
    },
  }
}
