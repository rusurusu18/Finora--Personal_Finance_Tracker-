import { useFinance } from '../../hooks/useFinance'
import Badge from '../../ui/Badge'
import Card from '../../ui/Card'
import Button from '../../ui/Button'

export default function Notifications() {
  const { notifications, readNotification } = useFinance()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Notifications</h1>
        <p className="text-sm text-slate-500">Preview alerts generated from mock finance activity.</p>
      </div>
      <div className="space-y-3">
        {notifications.map((item) => (
          <Card key={item.id} className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-medium">{item.title}</h2>
                  <Badge tone={item.type}>{item.read ? 'Read' : 'New'}</Badge>
                </div>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.body}</p>
              </div>
              {!item.read ? (
                <Button variant="secondary" size="sm" onClick={() => readNotification(item.id)}>
                  Mark read
                </Button>
              ) : null}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
