import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

import AdminLayout from '../layout/AdminLayout'
import AuthLayout from '../layout/AuthLayout'
import Layout from '../layout/Layout'

import About from '../pages/About'
import Contact from '../pages/Contact'
import Features from '../pages/Features'
import Home from '../pages/Home'
import Pricing from '../pages/Pricing'
import NotFound from '../pages/Notfound'

import ForgotPassword from '../pages/auth/ForgotPassword'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'

import Accounts from '../pages/dashboard/Accounts'
import Analytics from '../pages/dashboard/Analytics'
import Budgets from '../pages/dashboard/Budgets'
import Notifications from '../pages/dashboard/Notifications'
import Overview from '../pages/dashboard/Overview'
import Reports from '../pages/dashboard/Reports'
import SavingsGoals from '../pages/dashboard/SavingsGoals'
import Settings from '../pages/dashboard/Settings'
import Transactions from '../pages/dashboard/Transactions'


// ==========================================
// PROTECTED ROUTE
// ==========================================

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}


// ==========================================
// APP ROUTER
// ==========================================

export default function AppRouter() {
  return (
    <Routes>

      {/* ======================================
          PUBLIC WEBSITE
          ====================================== */}

      <Route element={<Layout />}>

        <Route path="/" element={<Home />} />

        <Route path="/about" element={<About />} />

        <Route path="/features" element={<Features />} />

        <Route path="/contact" element={<Contact />} />

        <Route path="/pricing" element={<Pricing />} />

      </Route>


      {/* ======================================
          AUTHENTICATION
          ====================================== */}

      <Route element={<AuthLayout />}>

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

      </Route>


      {/* ======================================
          PROTECTED DASHBOARD
          ====================================== */}

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >

        {/* /dashboard */}
        <Route
          index
          element={<Overview />}
        />

        {/* /dashboard/transactions */}
        <Route
          path="transactions"
          element={<Transactions />}
        />

        {/* /dashboard/budgets */}
        <Route
          path="budgets"
          element={<Budgets />}
        />

        {/* /dashboard/analytics */}
        <Route
          path="analytics"
          element={<Analytics />}
        />

        {/* /dashboard/accounts */}
        <Route
          path="accounts"
          element={<Accounts />}
        />

        {/* /dashboard/savings */}
        <Route
          path="savings"
          element={<SavingsGoals />}
        />

        {/* /dashboard/reports */}
        <Route
          path="reports"
          element={<Reports />}
        />

        {/* /dashboard/notifications */}
        <Route
          path="notifications"
          element={<Notifications />}
        />

        {/* /dashboard/settings */}
        <Route
          path="settings"
          element={<Settings />}
        />

      </Route>


      {/* ======================================
          404 - PAGE NOT FOUND
          ====================================== */}

      <Route
        path="*"
        element={<NotFound />}
      />

    </Routes>
  )
}
