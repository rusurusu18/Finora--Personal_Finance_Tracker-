import { AuthProvider } from './contexts/AuthContext'
import { FinanceProvider } from './contexts/FinanceContext'
import { ThemeProvider } from './contexts/ThemeContext'
import AppRouter from './Routes/AppRouter'
import { ToastProvider } from './components/ui/Toast'
import Chatbot from './components/ui/Chatbot'

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <FinanceProvider>
          <ToastProvider>
            <AppRouter />
            <Chatbot />
          </ToastProvider>
        </FinanceProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
