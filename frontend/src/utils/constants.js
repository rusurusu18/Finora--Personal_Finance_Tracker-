export const APP_NAME = 'Finora'
export const APP_TAGLINE = 'Know where your money is. Know where it\'s going. Know where it\'s headed.'

export const STORAGE_KEYS = {
  transactions: 'finora_transactions',
  accounts: 'finora_accounts',
  budgets: 'finora_budgets',
  savingsGoals: 'finora_savings_goals',
  notifications: 'finora_notifications',
  user: 'finora_user',
  accessToken: 'finora_access_token',
  refreshToken: 'finora_refresh_token',
  theme: 'finora_theme',
  settings: 'finora_settings',
}

export const CURRENCIES = [
  { code: 'NPR', label: 'Nepalese Rupee' },
  { code: 'USD', label: 'US Dollar' },
  { code: 'INR', label: 'Indian Rupee' },
]

export const PAYMENT_SOURCES = ['Cash', 'Bank', 'eSewa', 'Khalti', 'Fonepay']

export const ACCOUNT_TYPES = [
  { value: 'bank', label: 'Bank' },
  { value: 'wallet', label: 'Digital wallet' },
  { value: 'cash', label: 'Cash' },
]

export const TRANSACTION_TYPES = [
  { value: 'income', label: 'Income' },
  { value: 'expense', label: 'Expense' },
]

export const REPORT_PERIODS = [
  { value: 'monthly', label: 'Monthly report' },
  { value: 'yearly', label: 'Yearly report' },
  { value: 'category', label: 'Category report' },
  { value: 'income', label: 'Income report' },
  { value: 'expense', label: 'Expense report' },
]

export const NAV_PUBLIC = [
  { to: '/', label: 'Home' },
  { to: '/features', label: 'Features' },
  { to: '/#how-it-works', label: 'How It Works' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/contact', label: 'Contact' },
]
