import { useMemo, useState } from 'react'
import { useDebounce } from '../../hooks/useDebounce'
import { useFinance } from '../../hooks/useFinance'
import { useToast } from '../../components/ui/Toast'
import TransactionFilters from '../../components/finance/TransactionFilters'
import TransactionList from '../../components/finance/TransactionList'
import Button from '../../components/ui/Button'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import Select from '../../components/ui/Select'
import { TRANSACTION_TYPES } from '../../utils/constants'
import { hasErrors, validateTransaction } from '../../utils/validators'
import { FiPlus } from 'react-icons/fi'
import { useLanguage } from '../../contexts/useLanguage'

const emptyForm = () => ({
  title: '',
  amount: '',
  type: 'expense',
  category: '',
  date: new Date().toISOString().slice(0, 10),
  paymentSource: '',
  accountId: '',
  description: '',
})

export default function Transactions() {
  const { t } = useLanguage()
  const { transactions, categories, accounts, settings, addTransaction, editTransaction, removeTransaction } =
    useFinance()
  const { push } = useToast()
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    category: '',
    paymentSource: '',
    sort: 'date-desc',
    from: '',
    to: '',
  })
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [editingId, setEditingId] = useState(null)
  const [open, setOpen] = useState(false)
  const [pendingDelete, setPendingDelete] = useState(null)
  const search = useDebounce(filters.search)

  const visible = useMemo(() => {
    let items = [...transactions]
    if (search) {
      const q = search.toLowerCase()
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.paymentSource.toLowerCase().includes(q),
      )
    }
    if (filters.type) items = items.filter((item) => item.type === filters.type)
    if (filters.category) items = items.filter((item) => item.category === filters.category)
    if (filters.paymentSource) items = items.filter((item) => item.paymentSource === filters.paymentSource)
    if (filters.from) items = items.filter((item) => item.date >= filters.from)
    if (filters.to) items = items.filter((item) => item.date <= filters.to)
    items.sort((a, b) => {
      if (filters.sort === 'date-asc') return a.date.localeCompare(b.date)
      if (filters.sort === 'amount-desc') return b.amount - a.amount
      if (filters.sort === 'amount-asc') return a.amount - b.amount
      return b.date.localeCompare(a.date)
    })
    return items
  }, [transactions, search, filters])

  function openCreate() {
    setEditingId(null)
    setForm({
      ...emptyForm(),
      category: categories.find((item) => item.type === 'expense')?.name || '',
      accountId: accounts[0]?.id || '',
      paymentSource: accounts[0]?.name || '',
    })
    setErrors({})
    setOpen(true)
  }

  function openEdit(transaction) {
    setEditingId(transaction.id)
    setForm({
      title: transaction.title,
      amount: transaction.amount,
      type: transaction.type,
      category: transaction.category,
      date: transaction.date,
      paymentSource: transaction.paymentSource,
      accountId: transaction.accountId,
      description: transaction.description || '',
    })
    setErrors({})
    setOpen(true)
  }

  async function handleSave() {
    const nextErrors = validateTransaction(form)
    if (!form.accountId) nextErrors.accountId = 'Add a money source before creating a transaction.'
    setErrors(nextErrors)
    if (hasErrors(nextErrors)) return

    const payload = {
      ...form,
      amount: Number(form.amount),
      categoryId: categories.find((item) => item.name === form.category)?.id || null,
    }

    if (editingId) {
      await editTransaction(editingId, payload)
      push(t('Transaction updated.'), 'success')
    } else {
      await addTransaction(payload)
      push(t('Transaction added.'), 'success')
    }
    setOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t('Transactions')}</h1>
          <p className="text-sm text-slate-500">{t('Search, filter, and manage your recorded activity.')}</p>
        </div>
        <Button onClick={openCreate}><FiPlus aria-hidden="true" />{t('Add transaction')}</Button>
      </div>

      <TransactionFilters filters={filters} categories={categories} onChange={setFilters} />

      <TransactionList
        transactions={visible}
        currency={settings.currency}
        onEdit={openEdit}
        onDelete={setPendingDelete}
        onAdd={openCreate}
      />

      <Modal
        open={open}
        title={t(editingId ? 'Edit transaction' : 'Add transaction')}
        onClose={() => setOpen(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              {t('Cancel')}
            </Button>
            <Button onClick={handleSave}>{t('Save')}</Button>
          </>
        }
      >
        <div className="grid gap-3">
          <Input
            id="title"
            label={t('Title')}
            value={form.title}
            error={errors.title}
            onChange={(event) => setForm({ ...form, title: event.target.value })}
          />
          <Input
            id="amount"
            label={t('Amount')}
            type="number"
            value={form.amount}
            error={errors.amount}
            onChange={(event) => setForm({ ...form, amount: event.target.value })}
          />
          <Select
            id="type"
            label={t('Type')}
            value={form.type}
            onChange={(event) => setForm({ ...form, type: event.target.value })}
          >
            {TRANSACTION_TYPES.map((item) => (
              <option key={item.value} value={item.value}>
                {t(item.label)}
              </option>
            ))}
          </Select>
          <Select
            id="category"
            label={t('Category')}
            value={form.category}
            onChange={(event) => setForm({ ...form, category: event.target.value })}
          >
            {categories.filter((item) => item.type === form.type).map((item) => (
              <option key={item.id} value={item.name}>
                {t(item.name)}
              </option>
            ))}
          </Select>
          <Select
            id="transaction-account"
            label={t('Account')}
            value={form.accountId}
            error={errors.accountId}
            onChange={(event) => {
              const account = accounts.find((item) => item.id === event.target.value)
              setForm({ ...form, accountId: event.target.value, paymentSource: account?.name || '' })
            }}
          >
            <option value="">{t('Select an account')}</option>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </Select>
          <Input
            id="date"
            label={t('Date')}
            type="date"
            value={form.date}
            error={errors.date}
            onChange={(event) => setForm({ ...form, date: event.target.value })}
          />
          <Input
            id="description"
            label={t('Description')}
            value={form.description}
            onChange={(event) => setForm({ ...form, description: event.target.value })}
          />
        </div>
      </Modal>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={t('Delete transaction?')}
        description={t('This permanently removes the transaction from your account.')}
        confirmLabel={t('Delete')}
        onClose={() => setPendingDelete(null)}
        onConfirm={async () => {
          await removeTransaction(pendingDelete.id)
          setPendingDelete(null)
          push(t('Transaction deleted.'), 'success')
        }}
      />
    </div>
  )
}
