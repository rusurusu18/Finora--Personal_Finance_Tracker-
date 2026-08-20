import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import {
  createAccount,
  createBudget,
  createSavingsGoal,
  createTransaction,
  deleteAccount,
  deleteBudget,
  deleteSavingsGoal,
  deleteTransaction,
  getAccounts,
  getBudgets,
  getNotifications,
  getSavingsGoals,
  getTransactions,
  markNotificationRead,
  resetFinanceData,
  updateAccount,
  updateBudget,
  updateSavingsGoal,
  updateTransaction,
} from '../config/services'
import { STORAGE_KEYS } from '../utils/constants'
import { getAccountTotals, getBudgetRemaining, getMonthStats } from '../utils/dashboardData'

export const FinanceContext = createContext(null)

const defaultSettings = {
  currency: 'NPR',
  notifications: {
    email: true,
    push: false,
    budgetAlerts: true,
  },
}

export function FinanceProvider({ children }) {
  const [transactions, setTransactions] = useState([])
  const [accounts, setAccounts] = useState([])
  const [budgets, setBudgets] = useState([])
  const [savingsGoals, setSavingsGoals] = useState([])
  const [notifications, setNotifications] = useState([])
  const [settings, setSettings] = useState(() => {
    try {
      return { ...defaultSettings, ...JSON.parse(localStorage.getItem(STORAGE_KEYS.settings) || '{}') }
    } catch {
      return defaultSettings
    }
  })
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    const [nextTransactions, nextAccounts, nextBudgets, nextGoals, nextNotifications] = await Promise.all([
      getTransactions(),
      getAccounts(),
      getBudgets(),
      getSavingsGoals(),
      getNotifications(),
    ])
    setTransactions(nextTransactions)
    setAccounts(nextAccounts)
    setBudgets(nextBudgets)
    setSavingsGoals(nextGoals)
    setNotifications(nextNotifications)
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings))
  }, [settings])

  const addTransaction = useCallback(async (payload) => {
    await createTransaction(payload)
    await refresh()
  }, [refresh])

  const editTransaction = useCallback(async (id, payload) => {
    await updateTransaction(id, payload)
    await refresh()
  }, [refresh])

  const removeTransaction = useCallback(async (id) => {
    await deleteTransaction(id)
    await refresh()
  }, [refresh])

  const addAccount = useCallback(async (payload) => {
    await createAccount(payload)
    await refresh()
  }, [refresh])

  const editAccount = useCallback(async (id, payload) => {
    await updateAccount(id, payload)
    await refresh()
  }, [refresh])

  const removeAccount = useCallback(async (id) => {
    await deleteAccount(id)
    await refresh()
  }, [refresh])

  const addBudget = useCallback(async (payload) => {
    await createBudget(payload)
    await refresh()
  }, [refresh])

  const editBudget = useCallback(async (id, payload) => {
    await updateBudget(id, payload)
    await refresh()
  }, [refresh])

  const removeBudget = useCallback(async (id) => {
    await deleteBudget(id)
    await refresh()
  }, [refresh])

  const addGoal = useCallback(async (payload) => {
    await createSavingsGoal(payload)
    await refresh()
  }, [refresh])

  const editGoal = useCallback(async (id, payload) => {
    await updateSavingsGoal(id, payload)
    await refresh()
  }, [refresh])

  const removeGoal = useCallback(async (id) => {
    await deleteSavingsGoal(id)
    await refresh()
  }, [refresh])

  const readNotification = useCallback(async (id) => {
    const next = await markNotificationRead(id)
    setNotifications(next)
  }, [])

  const resetData = useCallback(async () => {
    await resetFinanceData()
    await refresh()
  }, [refresh])

  const totals = useMemo(() => getAccountTotals(accounts), [accounts])
  const monthStats = useMemo(() => getMonthStats(transactions), [transactions])
  const budgetRemaining = useMemo(() => getBudgetRemaining(budgets), [budgets])

  const value = useMemo(
    () => ({
      loading,
      transactions,
      accounts,
      budgets,
      savingsGoals,
      notifications,
      settings,
      setSettings,
      totals,
      monthStats,
      budgetRemaining,
      addTransaction,
      editTransaction,
      removeTransaction,
      addAccount,
      editAccount,
      removeAccount,
      addBudget,
      editBudget,
      removeBudget,
      addGoal,
      editGoal,
      removeGoal,
      readNotification,
      resetData,
      refresh,
    }),
    [
      loading,
      transactions,
      accounts,
      budgets,
      savingsGoals,
      notifications,
      settings,
      totals,
      monthStats,
      budgetRemaining,
      addTransaction,
      editTransaction,
      removeTransaction,
      addAccount,
      editAccount,
      removeAccount,
      addBudget,
      editBudget,
      removeBudget,
      addGoal,
      editGoal,
      removeGoal,
      readNotification,
      resetData,
      refresh,
    ],
  )

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
}
