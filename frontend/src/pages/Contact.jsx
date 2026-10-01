import { useState } from 'react'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import { isEmail, isName, isRequired } from '../utils/validators'
import {
  FiMail,
  FiUser,
  FiAtSign,
  FiMessageSquare,
  FiSend,
  FiCheckCircle,
} from 'react-icons/fi'
import { useLanguage } from '../contexts/useLanguage'

export default function Contact() {
  const { t } = useLanguage()
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)

  function update(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    const nextErrors = {
      name: t(isName(form.name, 'Name')),
      email: t(isEmail(form.email)),
      message: t(isRequired(form.message, 'Message')),
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
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
          <FiMail className="h-7 w-7" />
        </div>

        <h1 className="mt-5 text-3xl font-semibold tracking-tight">
          {t('Get in touch')}
        </h1>

        <p className="mx-auto mt-3 max-w-xl text-slate-600 dark:text-slate-300">
          {t("Have a question, suggestion, or feedback? Send us a message and we'll get back to you soon.")}
        </p>
      </div>

      {/* Contact Card */}
      <Card className="mt-10 p-6 shadow-sm transition-shadow duration-300 hover:shadow-lg sm:p-8">
        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          {/* Name */}
          <div>
            <div className="mb-1.5 flex items-center gap-2">
              <FiUser className="h-4 w-4 text-slate-500" />
              <span className="text-sm font-medium">{t('Name')}</span>
            </div>

            <Input
              id="name"
              name="name"
              label=""
              value={form.name}
              error={errors.name}
              onChange={update}
            />
          </div>

          {/* Email */}
          <div>
            <div className="mb-1.5 flex items-center gap-2">
              <FiAtSign className="h-4 w-4 text-slate-500" />
              <span className="text-sm font-medium">{t('Email')}</span>
            </div>

            <Input
              id="email"
              name="email"
              type="email"
              label=""
              value={form.email}
              error={errors.email}
              onChange={update}
            />
          </div>

          {/* Message */}
          <label className="block" htmlFor="message">
            <span className="mb-1.5 flex items-center gap-2 text-sm font-medium">
              <FiMessageSquare className="h-4 w-4 text-slate-500" />
              {t('Message')}
            </span>

            <textarea
              id="message"
              name="message"
              rows={6}
              value={form.message}
              onChange={update}
              placeholder={t('Tell us how we can help...')}
              className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-900 dark:focus:border-blue-400"
            />

            {errors.message ? (
              <span className="mt-1 block text-sm text-red-600">
                {errors.message}
              </span>
            ) : null}
          </label>

          {/* Submit */}
          <Button
            type="submit"
            className="flex w-full items-center justify-center gap-2"
          >
            <FiSend className="h-4 w-4" />
            {t('Send message')}
          </Button>
        </form>

        {/* Success message */}
        {sent ? (
          <div
            className="mt-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-400"
            role="status"
          >
            <FiCheckCircle className="mt-0.5 h-5 w-5 shrink-0" />

            <div>
              <p className="text-sm font-medium">
                {t('Message sent successfully')}
              </p>
              <p className="mt-1 text-sm">
                {t("Thank you for contacting us. We'll get back to you soon.")}
              </p>
            </div>
          </div>
        ) : null}
      </Card>
    </main>
  )
}
