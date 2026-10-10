import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Card from '../components/ui/Card'
import { verifyKhaltiPayment } from '../config/services'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/useLanguage'

// Payment result page for Khalti checkout responses.

export default function KhaltiPaymentResult() {
  const { t } = useLanguage()
  const location = useLocation()
  const { isAuthenticated } = useAuth()
  const pidx = new URLSearchParams(location.search).get('pidx')
  const [verificationStatus, setVerificationStatus] = useState('verifying')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!isAuthenticated || !pidx) return
    let active = true

    verifyKhaltiPayment(pidx)
      .then(() => {
        if (active) setVerificationStatus('complete')
      })
      .catch((error) => {
        if (!active) return
        setVerificationStatus('error')
        setErrorMessage(error.message)
      })

    return () => {
      active = false
    }
  }, [isAuthenticated, pidx])

  const status = !pidx
    ? 'failed'
    : !isAuthenticated
      ? 'error'
      : verificationStatus
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
          {status === 'complete'
            ? t('Khalti confirmed the payment and your Plus access is active.')
            : status === 'verifying'
              ? t('Checking the payment directly with Khalti.')
              : status === 'failed'
                ? t('Khalti did not return a payment reference. No Plus access was granted.')
                : !isAuthenticated
                  ? t('Sign in to verify this payment.')
                  : errorMessage}
        </p>
        <Link className="mt-5 inline-block text-sm text-indigo-600" to={isAuthenticated ? '/dashboard' : '/login'}>
          {t(isAuthenticated ? 'Go to dashboard' : 'Sign in')}
        </Link>
      </Card>
    </main>
  )
}
