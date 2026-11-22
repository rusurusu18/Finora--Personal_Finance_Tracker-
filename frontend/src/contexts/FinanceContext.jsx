
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

// Create a context to share financial data and operations across the application.
export const FinanceContext = createContext(null)

// Default application settings used when no saved settings are available.
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
  // Get the authentication status from AuthContext.
  const { isAuthenticated } = useAuth()

  // Store financial data retrieved from the backend API.
  const [transactions, setTransactions] = useState([])
  const [categories, setCategories] = useState([])
  const [accounts, setAccounts] = useState([])
  const [budgets, setBudgets] = useState([])
  const [savingsGoals, setSavingsGoals] = useState([])
  const [loanPlans, setLoanPlans] = useState([])
  const [notifications, setNotifications] = useState([])

  // Load saved application settings from localStorage.
  // Use default settings if saved data is missing or invalid.
  const [settings, setSettings] = useState(() => {
    try {
      return {
        ...defaultSettings,
        ...JSON.parse(localStorage.getItem(STORAGE_KEYS.settings) || '{}'),
      }
    } catch {
      return defaultSettings
    }
  })

  // Track the loading state while fetching financial data.
  const [loading, setLoading] = useState(true)

  // Fetch all financial data from the backend API.
  const refresh = useCallback(async () => {
    if (!isAuthenticated) return

    setLoading(true)

    try {
      // Fetch all required data simultaneously to improve performance.
      const [
        nextTransactions,
        nextAccounts,
        nextBudgets,
        nextGoals,
        nextNotifications,
        nextCategories,
        nextLoanPlans,
      ] = await Promise.all([
        getTransactions(),
        getAccounts(),
        getBudgets(),
        getSavingsGoals(),
        getNotifications(),
        getCategories(),
        getLoanPlans(),
      ])

      // Update the state with the latest API responses.
      setTransactions(nextTransactions)
      setCategories(nextCategories)
      setAccounts(nextAccounts)
      setBudgets(nextBudgets)
      setSavingsGoals(nextGoals)
      setLoanPlans(nextLoanPlans)
      setNotifications(nextNotifications)
    } finally {
      // Stop the loading indicator even if an API request fails.
      setLoading(false)
    }
  }, [isAuthenticated])

  // Refresh transaction-related data after transaction operations.
  const refreshTransactionData = useCallback(async () => {
    // Promise.allSettled allows successful requests to update state
    // even when another request fails.
    const [transactionResult, accountResult, budgetResult] =
      await Promise.allSettled([
        getTransactions(),
        getAccounts(),
        getBudgets(),
      ])

    // Update transactions if the request succeeds.
    if (transactionResult.status === 'fulfilled') {
      setTransactions(transactionResult.value)
    }

    // Update accounts if the request succeeds.
    if (accountResult.status === 'fulfilled') {
      setAccounts(accountResult.value)
    }

    // Update budgets if the request succeeds.
    if (budgetResult.status === 'fulfilled') {
      setBudgets(budgetResult.value)
    }

    // Collect failed requests and throw a combined error if necessary.
    const errors = [transactionResult, accountResult, budgetResult]
      .filter((result) => result.status === 'rejected')
      .map((result) => result.reason)

    if (errors.length) {
      throw new AggregateError(
        errors,
        'Could not refresh transaction and account data.',
      )
    }
  }, [])

  // Automatically load financial data when the user logs in.
  // Clear all financial data when the user logs out.
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

  // Automatically save settings whenever they change.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings))
  }, [settings])

  // ---------------- TRANSACTION OPERATIONS ----------------

  // Create a new transaction and refresh related financial data.
  const addTransaction = useCallback(async (payload) => {
    await createTransaction(payload)
    await refreshTransactionData()
  }, [refreshTransactionData])

  // Update an existing transaction.
  const editTransaction = useCallback(async (id, payload) => {
    await updateTransaction(id, payload)
    await refreshTransactionData()
  }, [refreshTransactionData])

  // Delete a transaction.
  const removeTransaction = useCallback(async (id) => {
    await deleteTransaction(id)
    await refreshTransactionData()
  }, [refreshTransactionData])

  // ---------------- ACCOUNT OPERATIONS ----------------

  // Create a new financial account.
  const addAccount = useCallback(async (payload) => {
    await createAccount(payload)
    await refresh()
  }, [refresh])

  // Update an existing financial account.
  const editAccount = useCallback(async (id, payload) => {
    await updateAccount(id, payload)
    await refresh()
  }, [refresh])

  // Delete an account.
  const removeAccount = useCallback(async (id) => {
    await deleteAccount(id)
    await refresh()
  }, [refresh])

  // ---------------- BUDGET OPERATIONS ----------------

  // Create a new budget.
  const addBudget = useCallback(async (payload) => {
    await createBudget(payload)
    await refresh()
  }, [refresh])

  // Update an existing budget.
  const editBudget = useCallback(async (id, payload) => {
    await updateBudget(id, payload)
    await refresh()
  }, [refresh])

  // Delete a budget.
  const removeBudget = useCallback(async (id) => {
    await deleteBudget(id)
    await refresh()
  }, [refresh])

  // ---------------- SAVINGS GOAL OPERATIONS ----------------

  // Create a new savings goal.
  const addGoal = useCallback(async (payload) => {
    await createSavingsGoal(payload)
    await refresh()
  }, [refresh])

  // Update an existing savings goal.
  const editGoal = useCallback(async (id, payload) => {
    await updateSavingsGoal(id, payload)
    await refresh()
  }, [refresh])

  // Delete a savings goal.
  const removeGoal = useCallback(async (id) => {
    await deleteSavingsGoal(id)
    await refresh()
  }, [refresh])

  // ---------------- LOAN PLAN OPERATIONS ----------------

  // Fetch the latest loan plans from the backend.
  const refreshLoanPlans = useCallback(async () => {
    setLoanPlans(await getLoanPlans())
  }, [])

  // Create a new loan plan and refresh the loan plan list.
  const addLoanPlan = useCallback(async (payload) => {
    await createLoanPlan(payload)
    await refreshLoanPlans()
  }, [refreshLoanPlans])

  // Delete a loan plan and update the loan plan list.
  const removeLoanPlan = useCallback(async (id) => {
    await deleteLoanPlan(id)
    await refreshLoanPlans()
  }, [refreshLoanPlans])

  // ---------------- NOTIFICATION OPERATIONS ----------------

  // Mark a notification as read and update the notification state.
  const readNotification = useCallback(async (id) => {
    const next = await markNotificationRead(id)
    setNotifications(next)
  }, [])

  // ---------------- DASHBOARD CALCULATIONS ----------------

  // Calculate total account balances and savings information.
  const totals = useMemo(
    () => getAccountTotals(accounts, savingsGoals),
    [accounts, savingsGoals],
  )

  // Calculate monthly income, expenses, and other transaction statistics.
  const monthStats = useMemo(
    () => getMonthStats(transactions),
    [transactions],
  )

  // Calculate the remaining amount available across budgets.
  const budgetRemaining = useMemo(
    () => getBudgetRemaining(budgets),
    [budgets],
  )

  // ---------------- CONTEXT VALUE ----------------

  // Memoize the context value to reduce unnecessary component re-renders.
  const value = useMemo(
    () => ({
      // Application state.
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

      // Dashboard calculated values.
      totals,
      monthStats,
      budgetRemaining,

      // Transaction functions.
      addTransaction,
      editTransaction,
      removeTransaction,

      // Account functions.
      addAccount,
      editAccount,
      removeAccount,

      // Budget functions.
      addBudget,
      editBudget,
      removeBudget,

      // Savings goal functions.
      addGoal,
      editGoal,
      removeGoal,

      // Loan plan functions.
      addLoanPlan,
      removeLoanPlan,

      // Notification and refresh functions.
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

  // Provide financial data and functions to all child components.
  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  )
}
