
/*Application name and tagline displayed throughout the UI.*/
export const APP_NAME = 'Finora'
export const APP_TAGLINE =
  'Know where your money is. Know where it\'s going. Know where it\'s headed.'

/* Keys used to store and retrieve application data from localStorage or another client-side storage mechanism.*/
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
  language: 'finora_language',
  settings: 'finora_settings',
}

/*Supported currencies for displaying and recording financial amounts.*/
export const CURRENCIES = [
  { code: 'NPR', label: 'Nepalese Rupee' },
  { code: 'USD', label: 'US Dollar' },
  { code: 'INR', label: 'Indian Rupee' },
]

/* Supported payment sources for recording transaction payment methods.*/
export const PAYMENT_SOURCES = [
  'Cash',
  'Bank',
  'eSewa',
  'Khalti',
  'Fonepay',
]

/**
 * Available account types for organizing a user's financial accounts.
 * The value is used internally, while the label is displayed in the UI.
 */
export const ACCOUNT_TYPES = [
  { value: 'bank', label: 'Bank' },
  { value: 'wallet', label: 'Digital wallet' },
  { value: 'cash', label: 'Cash' },
]

/*Supported transaction types for classifying money movements.*/
export const TRANSACTION_TYPES = [
  { value: 'income', label: 'Income' },
  { value: 'expense', label: 'Expense' },
]

/*Available report types for summarizing financial activity.*/
export const REPORT_PERIODS = [
  { value: 'monthly', label: 'Monthly report' },
  { value: 'yearly', label: 'Yearly report' },
  { value: 'category', label: 'Category report' },
  { value: 'income', label: 'Income report' },
  { value: 'expense', label: 'Expense report' },
]

/**
 * Navigation links available on public-facing pages.
 * The `to` property defines the destination route or URL fragment.
 */
export const NAV_PUBLIC = [
  { to: '/', label: 'Home' },
  { to: '/features', label: 'Features' },
  { to: '/#how-it-works', label: 'How It Works' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/contact', label: 'Contact' },
]
