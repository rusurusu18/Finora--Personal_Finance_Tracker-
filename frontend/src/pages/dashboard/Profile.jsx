import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../ui/Button'
import { useAuth } from '../../contexts/AuthContext'

export default function Profile() {
  const { user } = useAuth()

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
      })
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    setMessage('')
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setMessage('')
    setError('')

    if (!formData.fullName.trim()) {
      setError('Full name is required.')
      return
    }

    if (formData.fullName.trim().length < 2) {
      setError('Full name must be at least 2 characters.')
      return
    }

    try {
      setLoading(true)

      const token = localStorage.getItem('accessToken')

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/profile`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fullName: formData.fullName,
            phone: formData.phone,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to update profile.'
        )
      }

      setMessage(
        data.message || 'Profile updated successfully.'
      )
    } catch (err) {
      setError(
        err.message ||
          'Something went wrong. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">

      {/* Page Header */}
      <div className="mb-8">
        <p className="text-sm font-medium text-indigo-600">
          Account
        </p>

        <h1 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">
          Profile
        </h1>

        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Manage your personal information and account details.
        </p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}

      {message && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900 dark:bg-green-950/40 dark:text-green-300">
          {message}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">

        {/* Profile Summary */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">

          <div className="flex flex-col items-center text-center">

            {/* Avatar */}
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-indigo-100 text-3xl font-semibold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">
              {formData.fullName
                ? formData.fullName
                    .charAt(0)
                    .toUpperCase()
                : 'U'}
            </div>

            <h2 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
              {formData.fullName || 'User'}
            </h2>

            <p className="mt-1 break-all text-sm text-slate-500 dark:text-slate-400">
              {formData.email || 'No email available'}
            </p>

            {user?.role && (
              <span className="mt-3 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium capitalize text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">
                {user.role.toLowerCase()}
              </span>
            )}
          </div>

          <div className="mt-6 border-t border-slate-200 pt-5 dark:border-slate-700">

            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Account
            </p>

            <div className="mt-3 space-y-3 text-sm">

              <div className="flex justify-between gap-4">
                <span className="text-slate-500 dark:text-slate-400">
                  Status
                </span>

                <span className="font-medium text-green-600">
                  Active
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-slate-500 dark:text-slate-400">
                  Email
                </span>

                <span className="max-w-45 truncate font-medium text-slate-700 dark:text-slate-200">
                  {formData.email || '—'}
                </span>
              </div>

            </div>
          </div>
        </section>

        {/* Edit Profile */}
        <section className="lg:col-span-2">

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-8">

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Personal Information
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Update the information associated with your account.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  Full Name
                </label>

                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full cursor-not-allowed rounded-lg border border-slate-300 bg-slate-100 px-4 py-3 text-sm text-slate-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400"
                />

                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  Email address cannot be changed from this page.
                </p>
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  Phone Number
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                />
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">

                <Button
                  type="submit"
                  disabled={loading}
                >
                  {loading
                    ? 'Saving...'
                    : 'Save Changes'}
                </Button>

                <Link to="/dashboard/settings">
                  <Button
                    type="button"
                    variant="secondary"
                  >
                    Settings
                  </Button>
                </Link>

              </div>

            </form>
          </div>

          {/* Security Card */}
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">

            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Security
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Keep your Finora account secure.
            </p>

            <div className="mt-5 flex flex-col gap-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/70 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  Password
                </p>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Change your account password regularly.
                </p>
              </div>

              <Link to="/dashboard/settings">
                <Button variant="secondary">
                  Change Password
                </Button>
              </Link>

            </div>
          </div>

        </section>
      </div>
    </main>
  )
}