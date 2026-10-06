import {
  Bell,
  ChartColumn,
  CreditCard,
  Flag,
  LayoutDashboard,
  Landmark,
  Receipt,
  Settings,
  Target,
  Wallet,
} from 'lucide-react'

export const dashboardLinks = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/dashboard/transactions', label: 'Transactions', icon: Receipt },
  { to: '/dashboard/budgets', label: 'Budgets', icon: Target },
  { to: '/dashboard/analytics', label: 'Analytics', icon: ChartColumn },
  { to: '/dashboard/accounts', label: 'Accounts', icon: Wallet },
  { to: '/dashboard/loans', label: 'Loan & EMI Calculator', icon: Landmark },
  { to: '/dashboard/savings', label: 'Savings', icon: Flag },
  { to: '/dashboard/reports', label: 'Reports', icon: CreditCard },
  { to: '/dashboard/notifications', label: 'Notifications', icon: Bell },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings },
]