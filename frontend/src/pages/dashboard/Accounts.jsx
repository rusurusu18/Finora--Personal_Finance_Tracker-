import { useState } from 'react'
import { useFinance } from '../../hooks/useFinance'
import { useToast } from '../../components/ui/Toast'
import AccountList from '../../components/finance/AccountList'
import Button from '../../components/ui/Button'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import Select from '../../components/ui/Select'
import { ACCOUNT_TYPES } from '../../utils/constants'
import { FiPlus } from 'react-icons/fi'
import { useLanguage } from '../../contexts/useLanguage'

export default function Accounts() {
  const { t } = useLanguage()
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
      push(t('Account updated.'), 'success')
    } else {
      await addAccount(payload)
      push(t('Account added.'), 'success')
    }
    setOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t('Accounts')}</h1>
          <p className="text-sm text-slate-500">{t('Bank accounts, cash, and digital wallets.')}</p>
        </div>
        <Button onClick={openCreate}><FiPlus aria-hidden="true" />{t('Add source')}</Button>
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
        title={t(editing ? 'Edit money source' : 'Add money source')}
        onClose={() => setOpen(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              {t('Cancel')}
            </Button>
            <Button onClick={save}>{t('Save')}</Button>
          </>
        }
      >
        <div className="grid gap-3">
          <Input
            id="account-name"
            label={t('Name')}
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
          />
          <Select
            id="account-type"
            label={t('Type')}
            value={form.type}
            onChange={(event) => setForm({ ...form, type: event.target.value })}
          >
            {ACCOUNT_TYPES.map((item) => (
              <option key={item.value} value={item.value}>
                {t(item.label)}
              </option>
            ))}
          </Select>
          <Input
            id="account-institution"
            label={t(form.type === 'bank' ? 'Bank' : 'Provider')}
            value={form.institution}
            onChange={(event) => setForm({ ...form, institution: event.target.value })}
          />
          <Input
            id="account-balance"
            label={t('Balance')}
            type="number"
            value={form.balance}
            onChange={(event) => setForm({ ...form, balance: event.target.value })}
          />
        </div>
      </Modal>

      <ConfirmDialog
        open={Boolean(pending)}
        title={t('Delete money source?')}
        description={t('This source and its associated transactions will be permanently removed.')}
        confirmLabel={t('Delete')}
        onClose={() => setPending(null)}
        onConfirm={async () => {
          await removeAccount(pending.id)
          setPending(null)
          push(t('Account deleted.'), 'success')
        }}
      />
    </div>
  )
}
