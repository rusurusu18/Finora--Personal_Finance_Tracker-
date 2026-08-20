import { Landmark, Smartphone, Wallet } from 'lucide-react'
import Card from '../ui/Card'
import { formatCurrency } from '../utils/helpers'

const icons = {
  bank: Landmark,
  wallet: Smartphone,
  cash: Wallet,
}

export default function AccountCard({ account, currency, onEdit, onDelete }) {
  const Icon = icons[account.type] || Wallet

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-100">
            <Icon className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <h3 className="font-semibold">{account.name}</h3>
            <p className="text-sm text-slate-500">{account.institution || account.provider || account.type}</p>
          </div>
        </div>
        <p className="text-lg font-semibold">{formatCurrency(account.balance, currency)}</p>
      </div>
      <div className="mt-4 flex gap-2">
        <button type="button" className="text-sm text-indigo-600" onClick={() => onEdit(account)}>
          Edit
        </button>
        <button type="button" className="text-sm text-red-600" onClick={() => onDelete(account)}>
          Delete
        </button>
      </div>
    </Card>
  )
}
