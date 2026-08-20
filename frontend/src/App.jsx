import { AuthProvider } from './contexts/AuthContext'
import { FinanceProvider } from './contexts/FinanceContext'
import { ThemeProvider } from './contexts/ThemeContext'
import AppRouter from './Routes/AppRouter'
import { ToastProvider } from './ui/Toast'

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <FinanceProvider>
          <ToastProvider>
            <AppRouter />
          </ToastProvider>
        </FinanceProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
