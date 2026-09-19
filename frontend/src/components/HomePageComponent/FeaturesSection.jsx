import Card from '../ui/Card'

const features = [
  {
    title: 'Expense Tracking',
    body: 'Record income and expenses with category, date, and payment source.',
  },
  {
    title: 'Budget Management',
    body: 'See spent versus remaining for Food, Rent, Transport, and more.',
  },
  {
    title: 'Financial Analytics',
    body: 'Charts for income vs expense, category mix, and savings trend.',
  },
  {
    title: 'Savings Goals',
    body: 'Track Emergency Fund, laptop, travel, education, and other targets.',
  },
  {
    title: 'Multiple Money Sources',
    body: 'Bank, cash, eSewa, Khalti, and Fonepay in one overview.',
  },
  {
    title: 'Financial Insights',
    body: 'Plain-language notes such as food spend rising or a goal staying on track.',
  },
]

export default function FeaturesSection() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-16">
      <h2 className="text-2xl font-semibold tracking-tight">What Finora helps you do</h2>
      <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-300">
        The product is built around a clear picture of money, not a crowded ledger.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.title} className="p-5">
            <h3 className="font-semibold">{feature.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{feature.body}</p>
          </Card>
        ))}
      </div>
    </section>
  )
}
