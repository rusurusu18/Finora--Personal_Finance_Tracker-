import { useMemo, useState } from 'react'
import { useDebounce } from '../../hooks/useDebounce'
import { useFinance } from '../../hooks/useFinance'
import { useToast } from '../../ui/Toast'
import TransactionFilters from '../../finance/TransactionFilters'
import TransactionList from '../../finance/TransactionList'
import Button from '../../ui/Button'
import ConfirmDialog from '../../ui/ConfirmDialog'
import Input from '../../ui/Input'
import Modal from '../../ui/Modal'
import Select from '../../ui/Select'
import { CATEGORIES, PAYMENT_SOURCES, TRANSACTION_TYPES } from '../../utils/constants'
import { hasErrors, validateTransaction } from '../../utils/validators'

const emptyForm = {
  title: '',
  amount: '',
  type: 'expense',
  category: 'Food',
  date: '2026-08-20',
  paymentSource: 'Cash',
  description: '',
}

export default function Transactions() {
  const { transactions, settings, addTransaction, editTransaction, removeTransaction } = useFinance()
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
    setForm(emptyForm)
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
      description: transaction.description || '',
    })
    setErrors({})
    setOpen(true)
  }

  async function handleSave() {
    const nextErrors = validateTransaction(form)
    setErrors(nextErrors)
    if (hasErrors(nextErrors)) return

    const payload = {
      ...form,
      amount: Number(form.amount),
      accountId: 1,
      categoryId: CATEGORIES.find((item) => item.name === form.category)?.id || 3,
    }

    if (editingId) {
      await editTransaction(editingId, payload)
      push('Transaction updated.', 'success')
    } else {
      await addTransaction(payload)
      push('Transaction added.', 'success')
    }
    setOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Transactions</h1>
          <p className="text-sm text-slate-500">Search, filter, and manage activity. Stored in localStorage for now.</p>
        </div>
        <Button onClick={openCreate}>Add transaction</Button>
      </div>

      <TransactionFilters filters={filters} onChange={setFilters} />

      <TransactionList
        transactions={visible}
        currency={settings.currency}
        onEdit={openEdit}
        onDelete={setPendingDelete}
        onAdd={openCreate}
      />

      <Modal
        open={open}
        title={editingId ? 'Edit transaction' : 'Add transaction'}
        onClose={() => setOpen(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </>
        }
      >
        <div className="grid gap-3">
          <Input
            id="title"
            label="Title"
            value={form.title}
            error={errors.title}
            onChange={(event) => setForm({ ...form, title: event.target.value })}
          />
          <Input
            id="amount"
            label="Amount"
            type="number"
            value={form.amount}
            error={errors.amount}
            onChange={(event) => setForm({ ...form, amount: event.target.value })}
          />
          <Select
            id="type"
            label="Type"
            value={form.type}
            onChange={(event) => setForm({ ...form, type: event.target.value })}
          >
            {TRANSACTION_TYPES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </Select>
          <Select
            id="category"
            label="Category"
            value={form.category}
            onChange={(event) => setForm({ ...form, category: event.target.value })}
          >
            {CATEGORIES.map((item) => (
              <option key={item.id} value={item.name}>
                {item.name}
              </option>
            ))}
          </Select>
          <Select
            id="source"
            label="Payment source"
            value={form.paymentSource}
            onChange={(event) => setForm({ ...form, paymentSource: event.target.value })}
          >
            {PAYMENT_SOURCES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
          <Input
            id="date"
            label="Date"
            type="date"
            value={form.date}
            error={errors.date}
            onChange={(event) => setForm({ ...form, date: event.target.value })}
          />
          <Input
            id="description"
            label="Description"
            value={form.description}
            onChange={(event) => setForm({ ...form, description: event.target.value })}
          />
        </div>
      </Modal>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete transaction?"
        description="This removes the record from local preview data."
        confirmLabel="Delete"
        onClose={() => setPendingDelete(null)}
        onConfirm={async () => {
          await removeTransaction(pendingDelete.id)
          setPendingDelete(null)
          push('Transaction deleted.', 'success')
        }}
      />
    </div>
  )
}
