import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import AdminLayout from '../layout/AdminLayout'
import AuthLayout from '../layout/AuthLayout'
import Layout from '../layout/Layout'
import About from '../pages/About'
import ForgotPassword from '../pages/auth/ForgotPassword'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import Contact from '../pages/Contact'
import Accounts from '../pages/dashboard/Accounts'
import Analytics from '../pages/dashboard/Analytics'
import Budgets from '../pages/dashboard/Budgets'
import Notifications from '../pages/dashboard/Notifications'
import Overview from '../pages/dashboard/Overview'
import Reports from '../pages/dashboard/Reports'
import SavingsGoals from '../pages/dashboard/SavingsGoals'
import Settings from '../pages/dashboard/Settings'
import Transactions from '../pages/dashboard/Transactions'
import Error from '../pages/Error'
import Features from '../pages/Features'
import Home from '../pages/Home'
import Pricing from '../pages/Pricing'

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  return children
}

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/features" element={<Features />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/pricing" element={<Pricing />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Overview />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="budgets" element={<Budgets />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="accounts" element={<Accounts />} />
        <Route path="savings" element={<SavingsGoals />} />
        <Route path="reports" element={<Reports />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="/404" element={<Error />} />
      <Route path="*" element={<Error />} />
    </Routes>
  )
}
