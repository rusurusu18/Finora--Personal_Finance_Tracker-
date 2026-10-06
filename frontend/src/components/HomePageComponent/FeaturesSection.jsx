import Card from '../ui/Card'
import { useLanguage } from '../../contexts/useLanguage'
import {
  FiBarChart2,
  FiCalendar,
  FiCreditCard,
  FiDollarSign,
  FiPieChart,
  FiTarget,
  FiTrendingUp,
  FiZap,
} from 'react-icons/fi'

const features = [
  {
    title: 'Expense Tracking',
    body: 'Record income and expenses with category, date, and payment source.',
    icon: FiDollarSign,
    color: 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-300',
  },
  {
    title: 'Budget Management',
    body: 'See spent versus remaining for Food, Rent, Transport, and more.',
    icon: FiPieChart,
    color: 'text-blue-700 bg-blue-50 dark:bg-blue-950 dark:text-blue-300',
  },
  {
    title: 'Financial Analytics',
    body: 'Charts for income vs expense, category mix, and savings trend.',
    icon: FiBarChart2,
    color: 'text-violet-700 bg-violet-50 dark:bg-violet-950 dark:text-violet-300',
  },
  {
    title: 'Savings Goals',
    body: 'Track Emergency Fund, laptop, travel, education, and other targets.',
    icon: FiTarget,
    color: 'text-rose-700 bg-rose-50 dark:bg-rose-950 dark:text-rose-300',
  },
  {
    title: 'Multiple Money Sources',
    body: 'Bank, cash, eSewa, Khalti, and Fonepay in one overview.',
    icon: FiCreditCard,
    color: 'text-amber-700 bg-amber-50 dark:bg-amber-950 dark:text-amber-300',
  },
  {
    title: 'Financial Insights',
    body: 'Plain-language notes such as food spend rising or a goal staying on track.',
    icon: FiTrendingUp,
    color: 'text-cyan-700 bg-cyan-50 dark:bg-cyan-950 dark:text-cyan-300',
  },
  {
    title: 'English and Nepali with BS calendar',
    body: 'Switch between English and Nepali, and view or enter dates in Bikram Sambat.',
    icon: FiCalendar,
    color: 'text-indigo-700 bg-indigo-50 dark:bg-indigo-950 dark:text-indigo-300',
  },
  {
    title: 'AI natural-language expense entry',
    body: 'Describe an expense in English or Nepali and review the parsed draft before saving.',
    icon: FiZap,
    color: 'text-fuchsia-700 bg-fuchsia-50 dark:bg-fuchsia-950 dark:text-fuchsia-300',
  },
  {
    title: 'Loan & EMI Calculator',
    body: 'Estimate monthly payments, compare total interest, and save loan plans.',
    icon: FiTrendingUp,
    color: 'text-orange-700 bg-orange-50 dark:bg-orange-950 dark:text-orange-300',
  },
]

export default function FeaturesSection() {
  const { t } = useLanguage()
  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-16">
      <h2 className="text-2xl font-semibold tracking-tight">{t('What Finora helps you do')}</h2>
      <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-300">
        {t('The product is built around a clear picture of money, not a crowded ledger.')}
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {features.map(({ icon: Icon, color, ...feature }) => (
          <Card key={feature.title} className="p-5">
            <div className="flex items-center gap-3">
              <span className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${color}`}>
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="font-semibold">{t(feature.title)}</h3>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{t(feature.body)}</p>
          </Card>
        ))}
      </div>
    </section>
  )
}
