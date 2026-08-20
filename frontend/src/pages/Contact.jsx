import { useState } from 'react'
import Button from '../ui/Button'
import Card from '../ui/Card'
import Input from '../ui/Input'
import { isEmail, isName, isRequired } from '../utils/validators'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)

  function update(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = {
      name: isName(form.name, 'Name'),
      email: isEmail(form.email),
      message: isRequired(form.message, 'Message'),
    }
    setErrors(nextErrors)
    if (Object.values(nextErrors).some(Boolean)) {
      setSent(false)
      return
    }
    setSent(true)
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Contact</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-300">
        This form stays on the frontend. Messages are not sent to a server yet.
      </p>
      <Card className="mt-8 p-6">
        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <Input id="name" name="name" label="Name" value={form.name} error={errors.name} onChange={update} />
          <Input
            id="email"
            name="email"
            type="email"
            label="Email"
            value={form.email}
            error={errors.email}
            onChange={update}
          />
          <label className="block" htmlFor="message">
            <span className="mb-1.5 block text-sm font-medium">Message</span>
            <textarea
              id="message"
              name="message"
              rows={5}
              value={form.message}
              onChange={update}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900"
            />
            {errors.message ? <span className="mt-1 block text-sm text-red-600">{errors.message}</span> : null}
          </label>
          <Button type="submit">Send message</Button>
        </form>
        {sent ? (
          <p className="mt-4 text-sm text-emerald-600" role="status">
            Thanks. In production this would create a support request.
          </p>
        ) : null}
      </Card>
    </main>
  )
}
