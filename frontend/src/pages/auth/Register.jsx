import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import PasswordInput from '../../components/ui/PasswordInput'
import { FiUserPlus } from 'react-icons/fi'
import { useLanguage } from '../../contexts/useLanguage'

// Registration page for new users creating an account.

export default function Register() {
  const { register } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})

  function update(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const result = await register(form)
    if (!result.ok) {
      setErrors(result.errors)
      return
    }
    navigate('/dashboard')
  }

  return (
    <Card className="p-6">
      <h1 className="flex items-center gap-2 text-xl font-semibold">
        <FiUserPlus className="h-5 w-5 text-slate-500" aria-hidden="true" />
        {t('Create your Finora account')}
      </h1>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
        <Input id="name" name="name" label={t('Full name')} value={form.name} error={errors.name ? t(errors.name) : ''} onChange={update} />
        <Input
          id="email"
          name="email"
          type="email"
          label={t('Email')}
          value={form.email}
          error={errors.email ? t(errors.email) : ''}
          onChange={update}
        />
        <PasswordInput
          id="password"
          name="password"
          label={t('Password')}
          value={form.password}
          error={errors.password ? t(errors.password) : ''}
          onChange={update}
          autoComplete="new-password"
        />
        <p className="-mt-2 text-xs text-slate-500">{t('Use at least 8 characters with uppercase, lowercase, and a number.')}</p>
        <PasswordInput
          id="confirmPassword"
          name="confirmPassword"
          label={t('Confirm password')}
          value={form.confirmPassword}
          error={errors.confirmPassword ? t(errors.confirmPassword) : ''}
          onChange={update}
          autoComplete="new-password"
        />
        {errors.form ? <p className="text-sm text-red-600">{t(errors.form)}</p> : null}
        <Button type="submit" className="w-full">
          {t('Get started')}
        </Button>
      </form>
      <p className="mt-4 text-sm text-slate-500">
        {t('Already have an account?')}{' '}
        <Link to="/login" className="text-indigo-600">
          {t('Sign in')}
        </Link>
      </p>
    </Card>
  )
}
