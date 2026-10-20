
import { useEffect, useState } from 'react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  getEsewaPlusPlan,
  initiateEsewaPayment,
  initiateKhaltiPayment,
} from '../config/services'
import { FiUser, FiHome, FiArrowRight } from 'react-icons/fi'
import { useLanguage } from '../contexts/useLanguage'

// Converts technical request errors into messages that users can understand.
function getUserFacingRequestError(error, fallbackMessage) {
  const message = error instanceof Error ? error.message : ''

  // Network errors usually mean the backend could not be reached.
  if (
    error instanceof TypeError ||
    /failed to fetch|networkerror|load failed/i.test(message)
  ) {
    return fallbackMessage
  }

  // Show the actual error message when available.
  return message || 'Something went wrong. Please try again.'
}

// Displays subscription plans and handles eSewa and Khalti payments.
export default function Pricing() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { isAuthenticated } = useAuth()

  // Stores plan details retrieved from the backend.
  const [plan, setPlan] = useState(null)

  // Tracks whether pricing information is still being loaded.
  const [loading, setLoading] = useState(true)

  // Stores the payment provider currently processing checkout.
  const [busyProvider, setBusyProvider] = useState('')

  // Stores errors to display on the pricing page.
  const [error, setError] = useState('')

  // Fetches the Plus plan configuration when the component loads.
  useEffect(() => {
    getEsewaPlusPlan()
      .then(setPlan)
      .catch(() =>
        setError(
          'Pricing is temporarily unavailable. Please try again later.',
        ),
      )
      .finally(() => setLoading(false))
  }, [t])

  // Starts the subscription process for the selected payment provider.
  async function subscribe(provider) {
    // Require users to sign in before starting a payment.
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    setBusyProvider(provider)
    setError('')

    try {
      if (provider === 'esewa') {
        // Ask the backend to prepare the eSewa checkout details.
        const checkout = await initiateEsewaPayment()

        // eSewa's form-based checkout requires a POST request.
        const form = document.createElement('form')
        form.method = 'POST'
        form.action = checkout.paymentUrl

        // Add the payment fields returned by the backend as hidden inputs.
        Object.entries(checkout.fields).forEach(([name, value]) => {
          const input = document.createElement('input')
          input.type = 'hidden'
          input.name = name
          input.value = value
          form.appendChild(input)
        })

        // Submit the form to redirect the user to eSewa's checkout.
        document.body.appendChild(form)
        form.submit()

        // The browser is navigating away to the payment provider.
        return
      }

      // Ask the backend to initiate Khalti checkout.
      const checkout = await initiateKhaltiPayment()

      // Redirect the browser to Khalti's payment page.
      window.location.assign(checkout.paymentUrl)
    } catch (requestError) {
      // Display a friendly message if checkout initialization fails.
      setError(
        getUserFacingRequestError(
          requestError,
          'Checkout could not be started. Please try again.',
        ),
      )

      // Re-enable the payment buttons so the user can retry.
      setBusyProvider('')
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-16">
      {/* Page heading */}
      <div className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight">
          {t('Simple, transparent pricing')}
        </h1>
      </div>

      {/* Render the Personal and Plus subscription plans. */}
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {[
          {
            name: 'Personal',
            price: 'Free',
            icon: FiUser,
            iconColor: 'text-blue-600',
            iconBg: 'bg-blue-100 dark:bg-blue-950',
            points: [
              'Personal finance tracking',
              'Accounts, budgets, and goals',
              'Reports and analytics',
            ],
          },
          {
            name: 'Plus',

            // Display the unavailable label when the plan is disabled.
            price: plan?.enabled ? null : t('Unavailable'),
            amount: plan?.amount,
            durationDays: plan?.durationDays,
            icon: FiHome,
            iconColor: 'text-emerald-700',
            iconBg: 'bg-emerald-100 dark:bg-emerald-950',
            points: [
              'All Personal features',
              'Time-limited Plus access',
              'eSewa and Khalti verified checkout',
            ],
          },
        ].map((item) => {
          // Select the icon associated with the current plan.
          const Icon = item.icon

          return (
            <Card
              key={item.name}
              className="group relative overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Decorative background circle. */}
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-slate-100 opacity-50 transition-transform duration-300 group-hover:scale-150 dark:bg-slate-800" />

              <div className="relative">
                {/* Plan icon and its styling. */}
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.iconBg}`}
                >
                  <Icon className={`h-6 w-6 ${item.iconColor}`} />
                </div>

                {/* Plan name. */}
                <div className="mt-5 flex items-center justify-between">
                  <h2 className="text-xl font-semibold">{t(item.name)}</h2>
                </div>

                {/* Display the plan price and subscription duration. */}
                <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                  {item.price ||
                    (item.name === 'Plus' && plan?.enabled ? (
                      <>
                        NPR {item.amount} {t('for')} {item.durationDays}{' '}
                        {t('days')} · {t('one-time payment')}
                      </>
                    ) : (
                      t('Free')
                    ))}
                </p>

                {/* List the features included in each plan. */}
                <ul className="mt-6 space-y-3">
                  {item.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300"
                    >
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-xs text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                        ✓
                      </span>
                      {t(point)}
                    </li>
                  ))}
                </ul>

                {/* Show payment options for Plus and registration for Personal. */}
                {item.name === 'Plus' ? (
                  <div className="mt-7 grid gap-2">
                    {['esewa', 'khalti'].map((provider) => (
                      <Button
                        key={provider}
                        className="w-full justify-center"
                        variant={
                          provider === 'khalti' ? 'secondary' : 'primary'
                        }

                        // Disable checkout until loading finishes, the provider
                        // is enabled, and no other payment is being processed.
                        disabled={
                          loading ||
                          !plan?.providers?.[provider] ||
                          Boolean(busyProvider)
                        }
                        onClick={() => subscribe(provider)}
                      >
                        {busyProvider === provider
                          ? t(
                              provider === 'esewa'
                                ? 'Opening eSewa...'
                                : 'Opening Khalti...',
                            )
                          : isAuthenticated
                            ? t(
                                provider === 'esewa'
                                  ? 'Subscribe with eSewa'
                                  : 'Subscribe with Khalti',
                              )
                            : t('Sign in to subscribe')}

                        <FiArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    ))}

                    {/* Explain why Plus checkout options may be unavailable. */}
                    {!loading && !plan?.enabled ? (
                      <p className="text-center text-sm text-slate-500">
                        {t('Plus checkout is not configured yet.')}
                      </p>
                    ) : null}
                  </div>
                ) : (
                  // Free-plan users can create an account to get started.
                  <Button
                    className="mt-7 w-full justify-center"
                    onClick={() => navigate('/register')}
                  >
                    {t('Create account')}
                    <FiArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                )}
              </div>
            </Card>
          )
        })}
      </div>

      {/* Display any pricing or payment initialization errors. */}
      {error ? (
        <p
          className="mt-4 text-center text-sm text-slate-500"
          role="status"
        >
          {t(error)}
        </p>
      ) : null}
    </main>
  )
}
