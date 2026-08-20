import { cn } from '../utils/helpers'

export default function Select({
  id,
  label,
  error,
  children,
  className = '',
  ...props
}) {
  return (
    <label className="block" htmlFor={id}>
      {label ? (
        <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
          {label}
        </span>
      ) : null}
      <select
        id={id}
        aria-invalid={Boolean(error)}
        className={cn(
          'h-11 w-full rounded-xl border bg-white px-3 text-sm text-slate-900 disabled:cursor-not-allowed disabled:bg-slate-100 dark:bg-slate-900 dark:text-slate-100 dark:disabled:bg-slate-800',
          error
            ? 'border-red-500'
            : 'border-slate-200 focus:border-indigo-500 dark:border-slate-600',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      {error ? (
        <span className="mt-1 block text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </span>
      ) : null}
    </label>
  )
}
