import React from 'react'

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyles = 'px-7 py-4 rounded-xl font-semibold transition'
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg',
    secondary: 'border border-slate-300 bg-white text-slate-900 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800',
    ghost: 'text-blue-600 hover:text-blue-700 dark:text-slate-100 dark:hover:text-white',
  }

  const styles = [baseStyles, variants[variant] || variants.primary, className].join(' ')

  return (
    <button className={styles} {...props}>
      {children}
    </button>
  )
}

export default Button
