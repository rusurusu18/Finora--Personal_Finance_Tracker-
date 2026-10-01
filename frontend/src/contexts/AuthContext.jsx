import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { loginRequest, registerRequest, updateProfileRequest } from '../config/services'
import { STORAGE_KEYS } from '../utils/constants'
import { hasErrors, validateLogin, validateRegister } from '../utils/validators'

export const AuthContext = createContext(null)

function readUser() {
  try {
    if (!localStorage.getItem(STORAGE_KEYS.accessToken)) return null
    const raw = localStorage.getItem(STORAGE_KEYS.user)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function getFormErrors(requestError) {
  const fieldNames = { fullName: 'name' }
  const errors = Object.fromEntries(
    (requestError.validationErrors || [])
      .filter((issue) => issue.field)
      .map((issue) => [fieldNames[issue.field] || issue.field, issue.message]),
  )
  return Object.keys(errors).length ? errors : { form: requestError.message }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readUser)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  const persist = useCallback((nextUser, tokens = {}) => {
    setUser(nextUser)
    if (nextUser) {
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(nextUser))
      if (tokens.accessToken) localStorage.setItem(STORAGE_KEYS.accessToken, tokens.accessToken)
      if (tokens.refreshToken) localStorage.setItem(STORAGE_KEYS.refreshToken, tokens.refreshToken)
    } else {
      localStorage.removeItem(STORAGE_KEYS.user)
      localStorage.removeItem(STORAGE_KEYS.accessToken)
      localStorage.removeItem(STORAGE_KEYS.refreshToken)
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
      const { user: nextUser, accessToken, refreshToken } = await loginRequest(credentials)
      persist({ ...nextUser, name: nextUser.fullName }, { accessToken, refreshToken })
      setStatus('success')
      return { ok: true, errors: {} }
    } catch (requestError) {
      setStatus('error')
      setError(requestError.message)
      return { ok: false, errors: getFormErrors(requestError) }
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
      const { user: nextUser, accessToken, refreshToken } = await registerRequest(payload)
      persist({ ...nextUser, name: nextUser.fullName }, { accessToken, refreshToken })
      setStatus('success')
      return { ok: true, errors: {} }
    } catch (requestError) {
      setStatus('error')
      setError(requestError.message)
      return { ok: false, errors: getFormErrors(requestError) }
    }
  }, [persist])

  const logout = useCallback(() => {
    persist(null)
    setStatus('idle')
  }, [persist])

  const updateProfile = useCallback(async (patch) => {
    const nextUser = await updateProfileRequest(patch)
    const tokens = {
      accessToken: localStorage.getItem(STORAGE_KEYS.accessToken),
      refreshToken: localStorage.getItem(STORAGE_KEYS.refreshToken),
    }
    persist({ ...nextUser, name: nextUser.fullName }, tokens)
  }, [persist])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      status,
      error,
      login,
      register,
      logout,
      updateProfile,
    }),
    [user, status, error, login, register, logout, updateProfile],
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
