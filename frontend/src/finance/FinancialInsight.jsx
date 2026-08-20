import { AlertTriangle, CheckCircle2, Info, ShieldAlert } from 'lucide-react'
import { cn } from '../utils/helpers'

const styles = {
  success: {
    wrap: 'border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950',
    icon: CheckCircle2,
  },
  warning: {
    wrap: 'border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950',
    icon: AlertTriangle,
  },
  info: {
    wrap: 'border-indigo-200 bg-indigo-50 dark:border-indigo-900 dark:bg-indigo-950',
    icon: Info,
  },
  danger: {
    wrap: 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950',
    icon: ShieldAlert,
  },
}

export default function FinancialInsight({ tone = 'info', title, message }) {
  const config = styles[tone] || styles.info
  const Icon = config.icon

  return (
    <article className={cn('rounded-2xl border p-4', config.wrap)}>
      <div className="flex gap-3">
        <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <div>
          <h3 className="text-sm font-semibold">{title}</h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{message}</p>
        </div>
      </div>
    </article>
  )
}
