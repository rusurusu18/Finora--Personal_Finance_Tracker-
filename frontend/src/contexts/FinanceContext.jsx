import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { useAuth } from './AuthContext'
import {
  createAccount,
  createBudget,
  createLoanPlan,
  createSavingsGoal,
  createTransaction,
  deleteAccount,
  deleteBudget,
  deleteLoanPlan,
  deleteSavingsGoal,
  deleteTransaction,
  getAccounts,
  getBudgets,
  getCategories,
  getNotifications,
  getLoanPlans,
  getSavingsGoals,
  getTransactions,
  markNotificationRead,
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
  calendar: 'AD',
  notifications: {
    email: true,
    push: false,
    budgetAlerts: true,
  },
}

export function FinanceProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [categories, setCategories] = useState([])
  const [accounts, setAccounts] = useState([])
  const [budgets, setBudgets] = useState([])
  const [savingsGoals, setSavingsGoals] = useState([])
  const [loanPlans, setLoanPlans] = useState([])
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
    if (!isAuthenticated) return
    setLoading(true)
    try {
      const [nextTransactions, nextAccounts, nextBudgets, nextGoals, nextNotifications, nextCategories, nextLoanPlans] = await Promise.all([
        getTransactions(),
        getAccounts(),
        getBudgets(),
        getSavingsGoals(),
        getNotifications(),
        getCategories(),
        getLoanPlans(),
      ])
      setTransactions(nextTransactions)
      setCategories(nextCategories)
      setAccounts(nextAccounts)
      setBudgets(nextBudgets)
      setSavingsGoals(nextGoals)
      setLoanPlans(nextLoanPlans)
      setNotifications(nextNotifications)
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  const refreshTransactionData = useCallback(async () => {
    const [transactionResult, accountResult, budgetResult] = await Promise.allSettled([
      getTransactions(),
      getAccounts(),
      getBudgets(),
    ])

    if (transactionResult.status === 'fulfilled') {
      setTransactions(transactionResult.value)
    }
    if (accountResult.status === 'fulfilled') {
      setAccounts(accountResult.value)
    }
    if (budgetResult.status === 'fulfilled') {
      setBudgets(budgetResult.value)
    }

    const errors = [transactionResult, accountResult, budgetResult]
      .filter((result) => result.status === 'rejected')
      .map((result) => result.reason)
    if (errors.length) {
      throw new AggregateError(errors, 'Could not refresh transaction and account data.')
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      refresh()
    } else {
      setTransactions([])
      setCategories([])
      setAccounts([])
      setBudgets([])
      setSavingsGoals([])
      setLoanPlans([])
      setNotifications([])
      setLoading(false)
    }
  }, [isAuthenticated, refresh])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings))
  }, [settings])

  const addTransaction = useCallback(async (payload) => {
    await createTransaction(payload)
    await refreshTransactionData()
  }, [refreshTransactionData])

  const editTransaction = useCallback(async (id, payload) => {
    await updateTransaction(id, payload)
    await refreshTransactionData()
  }, [refreshTransactionData])

  const removeTransaction = useCallback(async (id) => {
    await deleteTransaction(id)
    await refreshTransactionData()
  }, [refreshTransactionData])

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

  const refreshLoanPlans = useCallback(async () => {
    setLoanPlans(await getLoanPlans())
  }, [])

  const addLoanPlan = useCallback(async (payload) => {
    await createLoanPlan(payload)
    await refreshLoanPlans()
  }, [refreshLoanPlans])

  const removeLoanPlan = useCallback(async (id) => {
    await deleteLoanPlan(id)
    await refreshLoanPlans()
  }, [refreshLoanPlans])

  const readNotification = useCallback(async (id) => {
    const next = await markNotificationRead(id)
    setNotifications(next)
  }, [])

  const totals = useMemo(() => getAccountTotals(accounts, savingsGoals), [accounts, savingsGoals])
  const monthStats = useMemo(() => getMonthStats(transactions), [transactions])
  const budgetRemaining = useMemo(() => getBudgetRemaining(budgets), [budgets])

  const value = useMemo(
    () => ({
      loading,
      transactions,
      categories,
      accounts,
      budgets,
      savingsGoals,
      loanPlans,
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
      addLoanPlan,
      removeLoanPlan,
      readNotification,
      refresh,
    }),
    [
      loading,
      transactions,
      categories,
      accounts,
      budgets,
      savingsGoals,
      loanPlans,
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
      addLoanPlan,
      removeLoanPlan,
      readNotification,
      refresh,
    ],
  )

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
}
