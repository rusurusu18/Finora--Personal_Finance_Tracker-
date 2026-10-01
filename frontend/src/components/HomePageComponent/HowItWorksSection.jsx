import { useLanguage } from '../../contexts/useLanguage'
import { FiBarChart2, FiFlag, FiPlusCircle, FiRepeat, FiTarget } from 'react-icons/fi'

const steps = [
  { label: 'Add your money sources', icon: FiPlusCircle },
  { label: 'Track transactions', icon: FiRepeat },
  { label: 'Set budgets', icon: FiTarget },
  { label: 'Create savings goals', icon: FiFlag },
  { label: 'Understand your financial progress', icon: FiBarChart2 },
]

export default function HowItWorksSection() {
  const { t } = useLanguage()
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-16">
      <h2 className="text-2xl font-semibold tracking-tight">{t('How it works')}</h2>
      <ol className="mt-8 grid gap-4 md:grid-cols-5">
        {steps.map(({ label, icon: Icon }, index) => (
          <li key={label} className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-indigo-600">{String(index + 1).padStart(2, '0')}</span>
              <Icon className="h-5 w-5 text-slate-500" aria-hidden="true" />
            </div>
            <p className="mt-3 text-sm font-medium leading-6">{t(label)}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
