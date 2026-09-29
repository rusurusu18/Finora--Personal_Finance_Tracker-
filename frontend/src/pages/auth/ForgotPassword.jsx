import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import { isEmail } from '../../utils/validators'
import { apiRequest } from '../../config/services'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    const nextError = isEmail(email)
    if (nextError) {
      setError(nextError)
      setSent(false)
      return
    }
    setError('')
    setBusy(true)
    try {
      const response = await apiRequest('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      })
      setMessage(response.message)
      setSent(true)
    } catch (requestError) {
      setError(requestError.message)
      setSent(false)
    } finally {
      setBusy(false)
    }
  }

  return (
    <Card className="p-6">
      <h1 className="text-xl font-semibold">Reset password</h1>
      <p className="mt-1 text-sm text-slate-500">Enter the email address associated with your account.</p>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
        <Input
          id="email"
          type="email"
          label="Email"
          value={email}
          error={error}
          onChange={(event) => setEmail(event.target.value)}
        />
        <Button type="submit" className="w-full" disabled={busy}>
          Send reset link
        </Button>
      </form>
      {sent ? (
        <p className="mt-4 text-sm text-emerald-600" role="status">
          {message}
        </p>
      ) : null}
      <Link to="/login" className="mt-4 inline-block text-sm text-indigo-600">
        Back to sign in
      </Link>
    </Card>
  )
}
