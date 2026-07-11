import React from 'react'

const Feature = () => {
  return (
    <section id="features" className="scroll-mt-[88px] bg-slate-100 dark:bg-slate-950 py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-blue-600 font-semibold">Features</p>
          <h2 className="mt-4 text-4xl lg:text-5xl font-black text-slate-900 dark:text-white">
            Everything you need to manage your money.
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-8">
            Finora helps you stay on top of income, spending, budgets, and savings with a clean, smart dashboard.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="rounded-3xl bg-white dark:bg-slate-900 p-8 shadow-lg border border-slate-200 dark:border-slate-800">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-3xl bg-blue-50 text-blue-600 mb-6 dark:bg-slate-800 dark:text-blue-400">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                <path d="M4 7a1 1 0 011-1h2.5a.5.5 0 000-1H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2h-2.5a.5.5 0 000 1H19a1 1 0 011 1v2h-2V8H6v1H4V7z" />
                <path d="M7 9h10v2H7V9zm0 4h6v2H7v-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Expense Tracking</h3>
            <p className="mt-4 text-slate-600 dark:text-slate-400">
              Log all your spending automatically and see where your money goes each month.
            </p>
          </div>
          <div className="rounded-3xl bg-white dark:bg-slate-900 p-8 shadow-lg border border-slate-200 dark:border-slate-800">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-3xl bg-blue-50 text-blue-600 mb-6 dark:bg-slate-800 dark:text-blue-400">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                <path d="M4 4h16v2H4V4zm0 6h7v2H4v-2zm0 6h10v2H4v-2zm0 6h16v2H4v-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Budget Planning</h3>
            <p className="mt-4 text-slate-600 dark:text-slate-400">
              Create budgets, compare against actual expenses, and avoid overspending.
            </p>
          </div>
          <div className="rounded-3xl bg-white dark:bg-slate-900 p-8 shadow-lg border border-slate-200 dark:border-slate-800">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-3xl bg-blue-50 text-blue-600 mb-6 dark:bg-slate-800 dark:text-blue-400">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                <path d="M12 2a7 7 0 00-7 7c0 4.46 5.33 9.72 6.13 10.57a1 1 0 001.74 0C13.67 18.72 19 13.46 19 9a7 7 0 00-7-7zm0 16.17c-1.86-1.9-5-5.59-5-9.17a5 5 0 1110 0c0 3.58-3.14 7.27-5 9.17z" />
                <path d="M12 9a3 3 0 100 6 3 3 0 000-6z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Savings Goals</h3>
            <p className="mt-4 text-slate-600 dark:text-slate-400">
              Set targets and track progress toward the financial goals that matter most.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Feature
