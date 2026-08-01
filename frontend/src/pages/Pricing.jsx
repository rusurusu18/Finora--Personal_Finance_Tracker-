import React from 'react'

const Pricing = () => {
  const plans = [
    {
      name: 'Starter',
      price: '$0',
      description: 'Perfect for getting started with personal finance tracking.',
      features: ['Basic expense tracking', 'Monthly insights', 'Limited budgets'],
      featured: false,
    },
    {
      name: 'Pro',
      price: '$12',
      description: 'Advanced tools for building better money habits and goals.',
      features: ['Unlimited budgets', 'Savings goals', 'AI-powered insights'],
      featured: true,
    },
    {
      name: 'Team',
      price: '$29',
      description: 'For households and finance-focused teams who want more control.',
      features: ['Shared dashboards', 'Priority support', 'Custom reports'],
      featured: false,
    },
  ]

  return (
    <section id="pricing" className="scroll-mt-[88px] bg-white py-24 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <p className="font-semibold text-blue-600">Pricing</p>
          <h2 className="mt-4 text-4xl font-black text-slate-900 dark:text-white lg:text-5xl">
            Simple plans for every stage of your financial journey.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl leading-8 text-slate-600 dark:text-slate-400">
            Choose a plan that fits your needs and start building a clearer financial future today.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-3xl border p-8 shadow-lg ${
                plan.featured
                  ? 'border-blue-500 bg-blue-600 text-white shadow-blue-200'
                  : 'border-slate-200 bg-slate-50 text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold">{plan.name}</h3>
                {plan.featured && (
                  <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-medium">Most Popular</span>
                )}
              </div>
              <p className={`mt-4 ${plan.featured ? 'text-blue-100' : 'text-slate-600 dark:text-slate-400'}`}>
                {plan.description}
              </p>
              <div className="mt-8 flex items-end gap-2">
                <span className="text-4xl font-black">{plan.price}</span>
                <span className={plan.featured ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}>/month</span>
              </div>
              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <span className="text-lg">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className={`mt-8 w-full rounded-2xl px-5 py-3 font-semibold transition ${
                  plan.featured
                    ? 'bg-white text-blue-600 hover:bg-slate-100'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Choose Plan
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Pricing
