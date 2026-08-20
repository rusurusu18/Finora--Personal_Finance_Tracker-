import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { cn } from '../utils/helpers'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts((items) => items.filter((item) => item.id !== id))
  }, [])

  const push = useCallback((message, tone = 'info') => {
    const id = Date.now() + Math.random()
    setToasts((items) => [...items, { id, message, tone }])
    window.setTimeout(() => dismiss(id), 3200)
  }, [dismiss])

  const value = useMemo(() => ({ push, dismiss }), [push, dismiss])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 bottom-20 z-50 flex w-[min(100%-2rem,22rem)] flex-col gap-2 md:bottom-4">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onDismiss={() => dismiss(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

export default function Toast({ message, tone = 'info', onDismiss }) {
  const tones = {
    success: 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200',
    warning: 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200',
    danger: 'border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200',
    info: 'border-slate-200 bg-white text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100',
  }

  return (
    <div
      role="status"
      className={cn(
        'pointer-events-auto rounded-xl border px-4 py-3 text-sm shadow-lg',
        tones[tone],
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p>{message}</p>
        {onDismiss ? (
          <button type="button" className="text-xs opacity-70" onClick={onDismiss}>
            Close
          </button>
        ) : null}
      </div>
    </div>
  )
}
