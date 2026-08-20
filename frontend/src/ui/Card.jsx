import { cn } from '../utils/helpers'

export default function Card({ children, className = '', as: Component = 'section', ...props }) {
  return (
    <Component
      className={cn(
        'rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800',
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  )
}
