import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Card from '../components/ui/Card'
import { verifyEsewaPayment } from '../config/services'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/useLanguage'

// Payment result page for successful or failed Esewa transactions.

export default function EsewaPaymentResult() {
  const { t } = useLanguage()
  const location = useLocation()
  const { isAuthenticated } = useAuth()
  const succeeded = location.pathname.endsWith('/success')
  const encodedResponse = new URLSearchParams(location.search).get('data')
  const [verificationStatus, setVerificationStatus] = useState('verifying')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!succeeded || !isAuthenticated || !encodedResponse) return

    verifyEsewaPayment(encodedResponse)
      .then(() => setVerificationStatus('complete'))
      .catch((error) => {
        setVerificationStatus('error')
        setErrorMessage(error.message)
      })
  }, [encodedResponse, isAuthenticated, succeeded])

  const status = !succeeded
    ? 'failed'
    : !isAuthenticated || !encodedResponse
      ? 'error'
      : verificationStatus
  const message = !isAuthenticated
    ? 'Sign in to verify this payment.'
    : !encodedResponse
      ? 'eSewa did not return a payment receipt. No subscription was activated.'
      : errorMessage

  const heading = status === 'complete'
    ? 'Plus activated'
    : status === 'verifying'
      ? 'Verifying payment'
      : status === 'failed'
        ? 'Payment not completed'
        : 'Payment needs attention'

  return (
    <main className="mx-auto max-w-xl px-4 py-16">
      <Card className="p-6">
        <h1 className="text-xl font-semibold">{t(heading)}</h1>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          {t(status === 'complete'
            ? 'eSewa confirmed the payment and your Plus access is active.'
            : status === 'verifying'
              ? 'Checking the payment directly with eSewa.'
              : status === 'failed'
                ? 'The payment was cancelled or not completed. No Plus access was granted.'
                : message)}
        </p>
        <Link className="mt-5 inline-block text-sm text-indigo-600" to={isAuthenticated ? '/dashboard' : '/login'}>
          {t(isAuthenticated ? 'Go to dashboard' : 'Sign in')}
        </Link>
      </Card>
    </main>
  )
}