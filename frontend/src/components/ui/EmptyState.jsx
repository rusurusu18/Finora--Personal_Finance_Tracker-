import Button from './Button'
import { FiInbox } from 'react-icons/fi'
import { useLanguage } from '../../contexts/useLanguage'

export default function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
    icon: Icon = FiInbox,
}) {
  const { t } = useLanguage()
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 px-6 py-12 text-center dark:border-slate-600">
      <Icon className="mx-auto mb-3 h-6 w-6 text-slate-400" aria-hidden="true" />
      <h3 className="text-base font-semibold text-slate-900 dark:text-white">{t(title)}</h3>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{t(description)}</p>
      {actionLabel ? (
        <Button className="mt-5" onClick={onAction}>
          {t(actionLabel)}
        </Button>
      ) : null}
    </div>
  )
}
