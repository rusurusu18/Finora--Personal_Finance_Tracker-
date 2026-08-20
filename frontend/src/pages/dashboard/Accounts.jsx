import { useState } from 'react'
import { useFinance } from '../../hooks/useFinance'
import { useToast } from '../../ui/Toast'
import AccountList from '../../finance/AccountList'
import Button from '../../ui/Button'
import ConfirmDialog from '../../ui/ConfirmDialog'
import Input from '../../ui/Input'
import Modal from '../../ui/Modal'
import Select from '../../ui/Select'
import { ACCOUNT_TYPES } from '../../utils/constants'

export default function Accounts() {
  const { accounts, settings, addAccount, editAccount, removeAccount } = useFinance()
  const { push } = useToast()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [pending, setPending] = useState(null)
  const [form, setForm] = useState({ name: '', type: 'bank', balance: '', institution: '' })

  function openCreate() {
    setEditing(null)
    setForm({ name: '', type: 'bank', balance: '', institution: '' })
    setOpen(true)
  }

  function openEdit(account) {
    setEditing(account)
    setForm({
      name: account.name,
      type: account.type,
      balance: account.balance,
      institution: account.institution || account.provider || '',
    })
    setOpen(true)
  }

  async function save() {
    const payload = {
      name: form.name,
      type: form.type,
      balance: Number(form.balance),
      institution: form.type === 'bank' ? form.institution : undefined,
      provider: form.type !== 'bank' ? form.institution || form.name : undefined,
    }
    if (editing) {
      await editAccount(editing.id, payload)
      push('Account updated.', 'success')
    } else {
      await addAccount(payload)
      push('Account added.', 'success')
    }
    setOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Accounts</h1>
          <p className="text-sm text-slate-500">Bank accounts, cash, and digital wallets.</p>
        </div>
        <Button onClick={openCreate}>Add source</Button>
      </div>

      <AccountList
        accounts={accounts}
        currency={settings.currency}
        onEdit={openEdit}
        onDelete={setPending}
        onAdd={openCreate}
      />

      <Modal
        open={open}
        title={editing ? 'Edit money source' : 'Add money source'}
        onClose={() => setOpen(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={save}>Save</Button>
          </>
        }
      >
        <div className="grid gap-3">
          <Input
            id="account-name"
            label="Name"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
          />
          <Select
            id="account-type"
            label="Type"
            value={form.type}
            onChange={(event) => setForm({ ...form, type: event.target.value })}
          >
            {ACCOUNT_TYPES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </Select>
          <Input
            id="account-institution"
            label={form.type === 'bank' ? 'Bank' : 'Provider'}
            value={form.institution}
            onChange={(event) => setForm({ ...form, institution: event.target.value })}
          />
          <Input
            id="account-balance"
            label="Balance"
            type="number"
            value={form.balance}
            onChange={(event) => setForm({ ...form, balance: event.target.value })}
          />
        </div>
      </Modal>

      <ConfirmDialog
        open={Boolean(pending)}
        title="Delete money source?"
        description="This source will be removed from the preview data."
        confirmLabel="Delete"
        onClose={() => setPending(null)}
        onConfirm={async () => {
          await removeAccount(pending.id)
          setPending(null)
          push('Account deleted.', 'success')
        }}
      />
    </div>
  )
}
