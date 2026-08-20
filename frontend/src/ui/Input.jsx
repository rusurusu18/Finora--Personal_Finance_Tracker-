import { cn } from '../utils/helpers'

export default function Input({
  id,
  label,
  error,
  className = '',
  type = 'text',
  ...props
}) {
  return (
    <label className="block" htmlFor={id}>
      {label ? (
        <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
          {label}
        </span>
      ) : null}
      <input
        id={id}
        type={type}
        aria-invalid={Boolean(error)}
        className={cn(
          'h-11 w-full rounded-xl border bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-100 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:disabled:bg-slate-800',
          error
            ? 'border-red-500 focus:border-red-500'
            : 'border-slate-200 focus:border-indigo-500 dark:border-slate-600',
          className,
        )}
        {...props}
      />
      {error ? (
        <span className="mt-1 block text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </span>
      ) : null}
    </label>
  )
}
