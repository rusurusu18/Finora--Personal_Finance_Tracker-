import { useFinance } from '../../hooks/useFinance'
import Badge from '../../components/ui/Badge'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { FiBell } from 'react-icons/fi'
import { useLanguage } from '../../contexts/useLanguage'

// Notifications page showing inbox updates and reminders.

export default function Notifications() {
  const { t } = useLanguage()
  const { notifications, readNotification } = useFinance()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
          <FiBell className="h-5 w-5 text-slate-500" aria-hidden="true" />
          {t('Notifications')}
        </h1>
        <p className="text-sm text-slate-500">{t('Updates related to your account and financial activity.')}</p>
      </div>
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <p className="py-10 text-center text-sm text-slate-500">{t('No notifications yet.')}</p>
        ) : null}
        {notifications.map((item) => (
          <Card key={item.id} className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-medium">{item.title}</h2>
                  <Badge tone={item.type}>{t(item.read ? 'Read' : 'New')}</Badge>
                </div>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.body}</p>
              </div>
              {!item.read ? (
                <Button variant="secondary" size="sm" onClick={() => readNotification(item.id)}>
                  {t('Mark read')}
                </Button>
              ) : null}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
