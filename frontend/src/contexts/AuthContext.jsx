import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { loginRequest, registerRequest } from '../config/services'
import { STORAGE_KEYS } from '../utils/constants'
import { hasErrors, validateLogin, validateRegister } from '../utils/validators'

export const AuthContext = createContext(null)

function readUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.user)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readUser)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  const persist = useCallback((nextUser) => {
    setUser(nextUser)
    if (nextUser) {
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(nextUser))
    } else {
      localStorage.removeItem(STORAGE_KEYS.user)
    }
  }, [])

  const login = useCallback(async (credentials) => {
    const errors = validateLogin(credentials)
    if (hasErrors(errors)) {
      return { ok: false, errors }
    }

    setStatus('loading')
    setError('')
    try {
      const { user: nextUser } = await loginRequest(credentials)
      persist({ ...nextUser, email: credentials.email })
      setStatus('success')
      return { ok: true, errors: {} }
    } catch {
      setStatus('error')
      setError('Unable to sign in right now. Try again.')
      return { ok: false, errors: { form: 'Unable to sign in right now. Try again.' } }
    }
  }, [persist])

  const register = useCallback(async (payload) => {
    const errors = validateRegister(payload)
    if (hasErrors(errors)) {
      return { ok: false, errors }
    }

    setStatus('loading')
    setError('')
    try {
      const { user: nextUser } = await registerRequest(payload)
      persist(nextUser)
      setStatus('success')
      return { ok: true, errors: {} }
    } catch {
      setStatus('error')
      setError('Unable to create an account right now.')
      return { ok: false, errors: { form: 'Unable to create an account right now.' } }
    }
  }, [persist])

  const loginDemo = useCallback(async () => {
    const { user: nextUser } = await loginRequest({ email: 'aarav@finora.dev', password: 'demo-only' })
    persist(nextUser)
    return { ok: true }
  }, [persist])

  const logout = useCallback(() => {
    persist(null)
    setStatus('idle')
  }, [persist])

  const updateProfile = useCallback((patch) => {
    persist({ ...user, ...patch })
  }, [persist, user])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      status,
      error,
      login,
      register,
      loginDemo,
      logout,
      updateProfile,
    }),
    [user, status, error, login, register, loginDemo, logout, updateProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
