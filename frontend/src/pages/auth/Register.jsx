import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import Button from '../../ui/Button'
import Card from '../../ui/Card'
import Input from '../../ui/Input'

export default function Register() {
  const { register } = useAuth()
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
      <h1 className="text-xl font-semibold">Create your Finora account</h1>
      <p className="mt-1 text-sm text-slate-500">Validation runs in the browser. Later this will call POST /api/auth/register.</p>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
        <Input id="name" name="name" label="Full name" value={form.name} error={errors.name} onChange={update} />
        <Input
          id="email"
          name="email"
          type="email"
          label="Email"
          value={form.email}
          error={errors.email}
          onChange={update}
        />
        <Input
          id="password"
          name="password"
          type="password"
          label="Password"
          value={form.password}
          error={errors.password}
          onChange={update}
          autoComplete="new-password"
        />
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label="Confirm password"
          value={form.confirmPassword}
          error={errors.confirmPassword}
          onChange={update}
          autoComplete="new-password"
        />
        {errors.form ? <p className="text-sm text-red-600">{errors.form}</p> : null}
        <Button type="submit" className="w-full">
          Get started
        </Button>
      </form>
      <p className="mt-4 text-sm text-slate-500">
        Already have an account?{' '}
        <Link to="/login" className="text-indigo-600">
          Sign in
        </Link>
      </p>
    </Card>
  )
}
