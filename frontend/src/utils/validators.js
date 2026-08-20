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
  return {
    name: isName(name, 'Full name'),
    email: isEmail(email),
    password: isPassword(password),
    confirmPassword:
      password !== confirmPassword ? 'Passwords do not match.' : isPassword(confirmPassword),
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
