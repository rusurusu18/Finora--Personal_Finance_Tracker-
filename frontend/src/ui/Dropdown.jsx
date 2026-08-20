import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useClickOutside } from '../hooks/useClickOutside'
import { cn } from '../utils/helpers'

export default function Dropdown({ label, children, align = 'right' }) {
  const [open, setOpen] = useState(false)
  const ref = useClickOutside(() => setOpen(false))

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {label}
        <ChevronDown className="h-4 w-4" />
      </button>
      {open ? (
        <div
          role="menu"
          className={cn(
            'absolute z-20 mt-2 min-w-44 rounded-xl border border-slate-200 bg-white p-1 shadow-lg dark:border-slate-700 dark:bg-slate-800',
            align === 'right' ? 'right-0' : 'left-0',
          )}
        >
          <div onClick={() => setOpen(false)}>{children}</div>
        </div>
      ) : null}
    </div>
  )
}

export function DropdownItem({ children, onClick }) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className="block w-full rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700"
    >
      {children}
    </button>
  )
}
