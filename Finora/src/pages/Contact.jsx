import React, { useState } from 'react'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [feedback, setFeedback] = useState(null)
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    message: '',
  })

  const contactMethods = [
    { label: 'Email', value: 'hello@finora.com', href: 'mailto:hello@finora.com' },
    { label: 'Phone', value: '+977 9812309876', href: 'tel:+18005550199' },
    { label: 'Office', value: 'Itahari, Sunsari, Nepal · Available worldwide', href: '#' },
  ]

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    setErrors((prev) => ({ ...prev, [name]: value.trim() ? '' : 'This field must be filled.' }))

    if (feedback) {
      setFeedback(null)
    }
  }

  const handleCloseFeedback = () => {
    setFeedback(null)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const nextErrors = {
      name: formData.name.trim() ? '' : 'This field must be filled.',
      email: formData.email.trim() ? '' : 'This field must be filled.',
      message: formData.message.trim() ? '' : 'This field must be filled.',
    }

    setErrors(nextErrors)

    const hasErrors = Object.values(nextErrors).some((value) => value)

    if (hasErrors) {
      setFeedback(null)
      return
    }

    setFormData({ name: '', email: '', message: '' })
    setErrors({ name: '', email: '', message: '' })
    setFeedback({ type: 'success', message: 'Message sent successfully. We will get back to you soon.' })
  }

  return (
    <section id="contact" className="scroll-mt-[88px] bg-slate-100 py-24 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="font-semibold text-blue-600">Contact</p>
            <h2 className="mt-4 text-4xl font-black text-slate-900 dark:text-white lg:text-5xl">
              Let’s make your money plan feel effortless.
            </h2>
            <p className="mt-4 max-w-2xl leading-8 text-slate-600 dark:text-slate-400">
              Whether you want a product demo, have questions about pricing, or want to explore partnerships,
              our team is ready to help.
            </p>

            <div className="mt-8 space-y-4">
              {contactMethods.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-950"
                >
                  <span className="font-medium text-slate-700 dark:text-slate-300">{item.label}</span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">{item.value}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="relative rounded-3xl border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-800 dark:bg-slate-950">
            {feedback?.type === 'success' && (
              <div className="absolute inset-0 z-10 flex items-center justify-center rounded-3xl bg-slate-950/50 p-4 backdrop-blur-sm">
                <div className="w-full max-w-sm rounded-3xl border border-green-200 bg-white p-6 text-center shadow-2xl dark:border-green-800 dark:bg-slate-900">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl text-green-600 dark:bg-green-950/40 dark:text-green-300">
                    ✓
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-slate-900 dark:text-white">Submitted successfully</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{feedback.message}</p>
                  <button
                    type="button"
                    onClick={handleCloseFeedback}
                    className="mt-5 w-full rounded-2xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700"
                  >
                    OK
                  </button>
                </div>
              </div>
            )}
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className={`w-full rounded-2xl border px-4 py-3 outline-none ring-0 transition focus:border-blue-500 dark:bg-slate-900 ${errors.name ? 'border-red-400 bg-red-50 dark:border-red-500 dark:bg-red-950/40' : 'border-slate-300 bg-slate-50 dark:border-slate-700'}`}
                />
                {errors.name && <p className="mt-2 text-sm text-red-500">{errors.name}</p>}
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`w-full rounded-2xl border px-4 py-3 outline-none ring-0 transition focus:border-blue-500 dark:bg-slate-900 ${errors.email ? 'border-red-400 bg-red-50 dark:border-red-500 dark:bg-red-950/40' : 'border-slate-300 bg-slate-50 dark:border-slate-700'}`}
                />
                {errors.email && <p className="mt-2 text-sm text-red-500">{errors.email}</p>}
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Message</label>
                <textarea
                  rows="4"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us how we can help..."
                  className={`w-full rounded-2xl border px-4 py-3 outline-none ring-0 transition focus:border-blue-500 dark:bg-slate-900 ${errors.message ? 'border-red-400 bg-red-50 dark:border-red-500 dark:bg-red-950/40' : 'border-slate-300 bg-slate-50 dark:border-slate-700'}`}
                />
                {errors.message && <p className="mt-2 text-sm text-red-500">{errors.message}</p>}
              </div>
              <button
                type="submit"
                className="w-full rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
