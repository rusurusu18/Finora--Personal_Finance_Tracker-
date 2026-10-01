import Card from '../ui/Card'

export default function SectionCard({ title, description, action, icon: Icon, children }) {
  return (
    <Card className="p-5">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          {Icon ? <Icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" aria-hidden="true" /> : null}
          <div>
            <h2 className="text-base font-semibold">{title}</h2>
            {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
          </div>
        </div>
        {action}
      </div>
      {children}
    </Card>
  )
}
