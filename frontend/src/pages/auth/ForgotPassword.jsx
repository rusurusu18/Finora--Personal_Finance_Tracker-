import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../ui/Button'
import Card from '../../ui/Card'
import Input from '../../ui/Input'
import { isEmail } from '../../utils/validators'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    const nextError = isEmail(email)
    if (nextError) {
      setError(nextError)
      setSent(false)
      return
    }
    setError('')
    setSent(true)
  }

  return (
    <Card className="p-6">
      <h1 className="text-xl font-semibold">Reset password</h1>
      <p className="mt-1 text-sm text-slate-500">
        This preview does not send email. A real reset flow will be added with the backend.
      </p>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
        <Input
          id="email"
          type="email"
          label="Email"
          value={email}
          error={error}
          onChange={(event) => setEmail(event.target.value)}
        />
        <Button type="submit" className="w-full">
          Send reset link
        </Button>
      </form>
      {sent ? (
        <p className="mt-4 text-sm text-emerald-600" role="status">
          If this were connected to the API, a reset email would be sent to {email}.
        </p>
      ) : null}
      <Link to="/login" className="mt-4 inline-block text-sm text-indigo-600">
        Back to sign in
      </Link>
    </Card>
  )
}
