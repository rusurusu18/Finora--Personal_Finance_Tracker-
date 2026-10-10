import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import PasswordInput from '../../components/ui/PasswordInput'
import { FiLogIn } from 'react-icons/fi'
import { useLanguage } from '../../contexts/useLanguage'

// Login page for existing users to sign in to the app.

export default function Login() {
  const { login } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})

  function update(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const result = await login(form)
    if (!result.ok) {
      setErrors(result.errors)
      return
    }
    navigate('/dashboard')
  }

  return (
    <Card className="p-6">
      <h1 className="flex items-center gap-2 text-xl font-semibold">
        <FiLogIn className="h-5 w-5 text-slate-500" aria-hidden="true" />
        {t('Sign in')}
      </h1>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
        <Input
          id="email"
          name="email"
          type="email"
          label={t('Email')}
          value={form.email}
          error={errors.email ? t(errors.email) : ''}
          onChange={update}
          autoComplete="email"
        />
        <PasswordInput
          id="password"
          name="password"
          label={t('Password')}
          value={form.password}
          error={errors.password ? t(errors.password) : ''}
          onChange={update}
          autoComplete="current-password"
        />
        {errors.form ? <p className="text-sm text-red-600">{t(errors.form)}</p> : null}
        <Button type="submit" className="w-full">
          {t('Sign in')}
        </Button>
      </form>
      <div className="mt-4 flex justify-between text-sm">
        <Link to="/register" className="text-indigo-600">
          {t('Create account')}
        </Link>
        <Link to="/forgot-password" className="text-slate-500">
          {t('Forgot password')}
        </Link>
      </div>
    </Card>
  )
}
