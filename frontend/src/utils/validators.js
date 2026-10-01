export function isRequired(value, label = 'This field') {
  if (value === undefined || value === null || String(value).trim() === '') {
    return `${label} is required.`
  }
  return ''
}

export function isEmail(value) {
  const required = isRequired(value, 'Email')
  if (required) return required
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!pattern.test(String(value).trim())) {
    return 'Enter a valid email address.'
  }
  return ''
}

export function isPassword(value) {
  const required = isRequired(value, 'Password')
  if (required) return required
  if (String(value).length < 8) {
    return 'Password must be at least 8 characters.'
  }
  return ''
}

export function isStrongPassword(value) {
  const lengthError = isPassword(value)
  if (lengthError) return lengthError
  if (!/[A-Z]/.test(value)) return 'Password must contain at least one uppercase letter.'
  if (!/[a-z]/.test(value)) return 'Password must contain at least one lowercase letter.'
  if (!/[0-9]/.test(value)) return 'Password must contain at least one number.'
  return ''
}

export function isAmount(value) {
  const required = isRequired(value, 'Amount')
  if (required) return required
  const amount = Number(value)
  if (Number.isNaN(amount) || amount <= 0) {
    return 'Enter an amount greater than 0.'
  }
  return ''
}

export function isName(value, label = 'Name') {
  const required = isRequired(value, label)
  if (required) return required
  if (String(value).trim().length < 2) {
    return `${label} must be at least 2 characters.`
  }
  return ''
}

export function validateLogin({ email, password }) {
  return {
    email: isEmail(email),
    password: isPassword(password),
  }
}

export function validateRegister({ name, email, password, confirmPassword }) {
  const passwordError = isStrongPassword(password)
  return {
    name: isName(name, 'Full name'),
    email: isEmail(email),
    password: passwordError,
    confirmPassword:
      password !== confirmPassword ? 'Passwords do not match.' : passwordError,
  }
}

export function validateTransaction({ title, amount, type, category, date, paymentSource }) {
  return {
    title: isName(title, 'Title'),
    amount: isAmount(amount),
    type: isRequired(type, 'Type'),
    category: isRequired(category, 'Category'),
    date: isRequired(date, 'Date'),
    paymentSource: isRequired(paymentSource, 'Payment source'),
  }
}

export function hasErrors(errors) {
  return Object.values(errors).some(Boolean)
}
