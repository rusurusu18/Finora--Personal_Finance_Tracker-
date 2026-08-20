import AccountCard from './AccountCard'
import EmptyState from '../ui/EmptyState'

export default function AccountList({ accounts, currency, onEdit, onDelete, onAdd }) {
  if (!accounts.length) {
    return (
      <EmptyState
        title="No money sources yet"
        description="Add a bank account, wallet, or cash source to start."
        actionLabel="Add source"
        onAction={onAdd}
      />
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {accounts.map((account) => (
        <AccountCard
          key={account.id}
          account={account}
          currency={currency}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
