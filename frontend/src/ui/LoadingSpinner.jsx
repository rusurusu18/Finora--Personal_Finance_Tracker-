import { cn } from '../utils/helpers'

export default function LoadingSpinner({ label = 'Loading', className = '' }) {
  return (
    <div className={cn('flex items-center justify-center gap-3 py-10', className)} role="status">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
      <span className="text-sm text-slate-500 dark:text-slate-400">{label}</span>
    </div>
  )
}
