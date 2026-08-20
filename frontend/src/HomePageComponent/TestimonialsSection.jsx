import Card from '../ui/Card'
import { dummyTestimonials } from '../utils/dummyData'

export default function TestimonialsSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h2 className="text-2xl font-semibold tracking-tight">What this could feel like</h2>
      <p className="mt-2 text-sm text-slate-500">Illustrative quotes for product preview. Not real users.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {dummyTestimonials.map((item) => (
          <Card key={item.id} className="p-5">
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">“{item.quote}”</p>
            <p className="mt-4 text-sm font-medium">{item.name}</p>
            <p className="text-xs text-slate-500">{item.role}</p>
          </Card>
        ))}
      </div>
    </section>
  )
}
