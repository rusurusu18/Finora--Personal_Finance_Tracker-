import { useLanguage } from '../../contexts/useLanguage'

const steps = [
  'Add your money sources',
  'Track transactions',
  'Set budgets',
  'Create savings goals',
  'Understand your financial progress',
]

export default function HowItWorksSection() {
  const { t } = useLanguage()
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-16">
      <h2 className="text-2xl font-semibold tracking-tight">{t('How it works')}</h2>
      <ol className="mt-8 grid gap-4 md:grid-cols-5">
        {steps.map((step, index) => (
          <li key={step} className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
            <p className="text-sm font-semibold text-indigo-600">{index + 1}</p>
            <p className="mt-2 text-sm font-medium leading-6">{t(step)}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
