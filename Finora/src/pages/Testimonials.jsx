import React from 'react'

const testimonials = [
  {
    quote:
      'Finora helped me simplify my monthly budget and finally understand where my money was going.',
    author: 'Maya Chen',
    role: 'Product Designer',
  },
  {
    quote:
      'The insights are clear, beautiful, and incredibly motivating. I reached my savings goal in just three months.',
    author: 'Daniel Brooks',
    role: 'Freelance Developer',
  },
  {
    quote:
      'It feels like having a personal finance coach in my pocket. Everything is easy to track and review.',
    author: 'Aisha Patel',
    role: 'Marketing Lead',
  },
]

const Testimonials = () => {
  return (
    <section id="testimonials" className="scroll-mt-[88px] bg-slate-100 py-24 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <p className="font-semibold text-blue-600">Testimonials</p>
          <h2 className="mt-4 text-4xl font-black text-slate-900 dark:text-white lg:text-5xl">
            Loved by people who want better financial habits.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl leading-8 text-slate-600 dark:text-slate-400">
            Real stories from users who have gained clarity, confidence, and control over their money.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {testimonials.map((item) => (
            <div key={item.author} className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-800 dark:bg-slate-950">
              <p className="text-lg leading-8 text-slate-700 dark:text-slate-300">“{item.quote}”</p>
              <div className="mt-8">
                <h3 className="font-semibold text-slate-900 dark:text-white">{item.author}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
