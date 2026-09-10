import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Button from '../../ui/Button'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const token = searchParams.get('token')

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    setError('')
    setMessage('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError('')
    setMessage('')

    if (!formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields.')
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    if (!/[A-Z]/.test(formData.password)) {
      setError('Password must contain at least one uppercase letter.')
      return
    }

    if (!/[a-z]/.test(formData.password)) {
      setError('Password must contain at least one lowercase letter.')
      return
    }

    if (!/[0-9]/.test(formData.password)) {
      setError('Password must contain at least one number.')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (!token) {
      setError('Invalid or missing password reset token.')
      return
    }

    try {
      setLoading(true)

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/reset-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token,
            password: formData.password,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to reset password.'
        )
      }

      setMessage(
        data.message || 'Password reset successfully.'
      )

      setFormData({
        password: '',
        confirmPassword: '',
      })

      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (err) {
      setError(
        err.message || 'Something went wrong. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="mb-8 text-center">
          <p className="text-sm font-medium text-indigo-600">
            Finora
          </p>

          <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">
            Reset your password
          </h1>

          <p className="mt-3 text-slate-600 dark:text-slate-300">
            Create a new password for your Finora account.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-8">

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
              {error}
            </div>
          )}

          {/* Success */}
          {message && (
            <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900 dark:bg-green-950/40 dark:text-green-300">
              {message}
            </div>
          )}

          {!token ? (
            <div className="text-center">
              <p className="text-sm text-slate-600 dark:text-slate-300">
                This password reset link is invalid or missing a
                reset token.
              </p>

              <Link
                to="/forgot-password"
                className="mt-5 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                Request a new reset link
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* New Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  New Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your new password"
                    autoComplete="new-password"
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 pr-20 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => !prev)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  Confirm Password
                </label>

                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={
                      showConfirmPassword
                        ? 'text'
                        : 'password'
                    }
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your new password"
                    autoComplete="new-password"
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 pr-20 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (prev) => !prev
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    {showConfirmPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              {/* Password Requirements */}
              <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800/70">
                <p className="text-xs font-medium text-slate-700 dark:text-slate-200">
                  Password must contain:
                </p>

                <ul className="mt-2 space-y-1 text-xs text-slate-500 dark:text-slate-400">
                  <li>• At least 8 characters</li>
                  <li>• At least one uppercase letter</li>
                  <li>• At least one lowercase letter</li>
                  <li>• At least one number</li>
                </ul>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading
                  ? 'Resetting password...'
                  : 'Reset Password'}
              </Button>

            </form>
          )}

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}