import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Button from '../../components/ui/Button'
import { resetPasswordRequest } from '../../config/services'
import { FiKey } from 'react-icons/fi'
import { useLanguage } from '../../contexts/useLanguage'

export default function ResetPassword() {
  const { t } = useLanguage()
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
      setError(t('Please fill in all fields.'))
      return
    }

    if (formData.password.length < 8) {
      setError(t('Password must be at least 8 characters.'))
      return
    }

    if (!/[A-Z]/.test(formData.password)) {
      setError(t('Password must contain at least one uppercase letter.'))
      return
    }

    if (!/[a-z]/.test(formData.password)) {
      setError(t('Password must contain at least one lowercase letter.'))
      return
    }

    if (!/[0-9]/.test(formData.password)) {
      setError(t('Password must contain at least one number.'))
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError(t('Passwords do not match.'))
      return
    }

    if (!token) {
      setError(t('Invalid or missing password reset token.'))
      return
    }

    try {
      setLoading(true)

      const response = await resetPasswordRequest(token, formData.password)

      setMessage(t(response.message || 'Password reset successfully.'))

      setFormData({
        password: '',
        confirmPassword: '',
      })

      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (err) {
      setError(t(err.message || 'Something went wrong. Please try again.'))
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

          <h1 className="mt-2 flex items-center justify-center gap-2 text-3xl font-semibold text-slate-900 dark:text-white">
            <FiKey className="h-6 w-6" aria-hidden="true" />
            {t('Reset your password')}
          </h1>

          <p className="mt-3 text-slate-600 dark:text-slate-300">
            {t('Create a new password for your Finora account.')}
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-8">

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
              {t(error)}
            </div>
          )}

          {/* Success */}
          {message && (
            <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900 dark:bg-green-950/40 dark:text-green-300">
              {t(message)}
            </div>
          )}

          {!token ? (
            <div className="text-center">
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {t('This password reset link is invalid or missing a reset token.')}
              </p>

              <Link
                to="/forgot-password"
                className="mt-5 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                {t('Request a new reset link')}
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
                  {t('New password')}
                </label>

                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={t('Enter your new password')}
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
                    {t(showPassword ? 'Hide' : 'Show')}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  {t('Confirm password')}
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
                    placeholder={t('Confirm your new password')}
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
                    {t(showConfirmPassword ? 'Hide' : 'Show')}
                  </button>
                </div>
              </div>

              {/* Password Requirements */}
              <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800/70">
                <p className="text-xs font-medium text-slate-700 dark:text-slate-200">
                  {t('Password must contain:')}
                </p>

                <ul className="mt-2 space-y-1 text-xs text-slate-500 dark:text-slate-400">
                  <li>• {t('At least 8 characters')}</li>
                  <li>• {t('At least one uppercase letter')}</li>
                  <li>• {t('At least one lowercase letter')}</li>
                  <li>• {t('At least one number')}</li>
                </ul>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading
                  ? t('Resetting password...')
                  : t('Reset password')}
              </Button>

            </form>
          )}

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              ← {t('Back to sign in')}
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}