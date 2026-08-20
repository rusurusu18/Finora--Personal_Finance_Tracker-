import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import Button from '../../ui/Button'
import Card from '../../ui/Card'
import Input from '../../ui/Input'

export default function Login() {
  const { login, loginDemo } = useAuth()
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
      <h1 className="text-xl font-semibold">Sign in</h1>
      <p className="mt-1 text-sm text-slate-500">Frontend-only for now. No password is stored.</p>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
        <Input
          id="email"
          name="email"
          type="email"
          label="Email"
          value={form.email}
          error={errors.email}
          onChange={update}
          autoComplete="email"
        />
        <Input
          id="password"
          name="password"
          type="password"
          label="Password"
          value={form.password}
          error={errors.password}
          onChange={update}
          autoComplete="current-password"
        />
        {errors.form ? <p className="text-sm text-red-600">{errors.form}</p> : null}
        <Button type="submit" className="w-full">
          Sign in
        </Button>
      </form>
      <Button
        variant="secondary"
        className="mt-3 w-full"
        onClick={async () => {
          await loginDemo()
          navigate('/dashboard')
        }}
      >
        Explore with demo data
      </Button>
      <div className="mt-4 flex justify-between text-sm">
        <Link to="/register" className="text-indigo-600">
          Create account
        </Link>
        <Link to="/forgot-password" className="text-slate-500">
          Forgot password
        </Link>
      </div>
    </Card>
  )
}
