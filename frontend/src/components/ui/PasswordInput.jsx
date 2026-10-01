import { useState } from 'react'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import Input from './Input'
import { useLanguage } from '../../contexts/useLanguage'

export default function PasswordInput({ id, ...props }) {
  const { t } = useLanguage()
  const [visible, setVisible] = useState(false)

  return (
    <Input
      {...props}
      id={id}
      type={visible ? 'text' : 'password'}
      rightAdornment={(
        <button
          type="button"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-2 focus-visible:outline-indigo-600 dark:hover:bg-slate-700 dark:hover:text-slate-100"
          aria-label={t(visible ? 'Hide password' : 'Show password')}
          aria-pressed={visible}
          title={t(visible ? 'Hide password' : 'Show password')}
          onClick={() => setVisible((current) => !current)}
        >
          {visible ? <FiEyeOff className="h-4 w-4" aria-hidden="true" /> : <FiEye className="h-4 w-4" aria-hidden="true" />}
        </button>
      )}
    />
  )
}