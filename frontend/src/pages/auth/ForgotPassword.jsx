import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import { isEmail } from '../../utils/validators'
import { forgotPasswordRequest } from '../../config/services'
import { FiMail } from 'react-icons/fi'
import { useLanguage } from '../../contexts/useLanguage'

export default function ForgotPassword() {
  const { t } = useLanguage()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    const nextError = isEmail(email)
    if (nextError) {
      setError(t(nextError))
      setSent(false)
      return
    }
    setError('')
    setBusy(true)
    try {
      const response = await forgotPasswordRequest(email)
      setMessage(t(response.message))
      setSent(true)
    } catch (requestError) {
      setError(t(requestError.message))
      setSent(false)
    } finally {
      setBusy(false)
    }
  }

  return (
    <Card className="p-6">
      <h1 className="flex items-center gap-2 text-xl font-semibold">
        <FiMail className="h-5 w-5 text-slate-500" aria-hidden="true" />
        {t('Reset password')}
      </h1>
      <p className="mt-1 text-sm text-slate-500">{t('Enter the email address associated with your account.')}</p>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
        <Input
          id="email"
          type="email"
          label={t('Email')}
          value={email}
          error={error}
          onChange={(event) => setEmail(event.target.value)}
        />
        <Button type="submit" className="w-full" disabled={busy}>
          {t('Send reset link')}
        </Button>
      </form>
      {sent ? (
        <p className="mt-4 text-sm text-emerald-600" role="status">
          {message}
        </p>
      ) : null}
      <Link to="/login" className="mt-4 inline-block text-sm text-indigo-600">
        {t('Back to sign in')}
      </Link>
    </Card>
  )
}
