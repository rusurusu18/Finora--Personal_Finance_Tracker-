import { AuthProvider } from './contexts/AuthContext'
import { FinanceProvider } from './contexts/FinanceContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { LanguageProvider } from './contexts/LanguageContext'
import AppRouter from './Routes/AppRouter'
import { ToastProvider } from './components/ui/Toast'
import Chatbot from './components/ui/Chatbot'

export default function App() {
  return (
    <>
      {/* Global app providers keep shared state available across the app. */}
      <ThemeProvider>
        <LanguageProvider>
          <ToastProvider>
            <AuthProvider>
              <FinanceProvider>
                {/* The router handles page navigation, while the chatbot stays visible globally. */}
                <AppRouter />
                <Chatbot />
              </FinanceProvider>
            </AuthProvider>
          </ToastProvider>
        </LanguageProvider>
      </ThemeProvider>
    </>
  )
}
