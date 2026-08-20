import { useState } from 'react'
import { useFinance } from '../../hooks/useFinance'
import { useToast } from '../../ui/Toast'
import BudgetCard from '../../finance/BudgetCard'
import Button from '../../ui/Button'
import ConfirmDialog from '../../ui/ConfirmDialog'
import Input from '../../ui/Input'
import Modal from '../../ui/Modal'
import Select from '../../ui/Select'
import StatusPill from '../../sections/StatusPill'
import { CATEGORIES } from '../../utils/constants'
import { clampPercent, percent } from '../../utils/helpers'

export default function Budgets() {
  const { budgets, settings, addBudget, editBudget, removeBudget } = useFinance()
  const { push } = useToast()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [pending, setPending] = useState(null)
  const [form, setForm] = useState({ category: 'Food', amount: '', spent: '', period: '2026-08' })

  function openCreate() {
    setEditing(null)
    setForm({ category: 'Food', amount: '', spent: '0', period: '2026-08' })
    setOpen(true)
  }

  function openEdit(budget) {
    setEditing(budget)
    setForm({
      category: budget.category,
      amount: budget.amount,
      spent: budget.spent,
      period: budget.period,
    })
    setOpen(true)
  }

  async function save() {
    const payload = {
      ...form,
      amount: Number(form.amount),
      spent: Number(form.spent),
      categoryId: CATEGORIES.find((item) => item.name === form.category)?.id || 3,
    }
    if (editing) {
      await editBudget(editing.id, payload)
      push('Budget updated.', 'success')
    } else {
      await addBudget(payload)
      push('Budget added.', 'success')
    }
    setOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Budgets</h1>
          <p className="text-sm text-slate-500">Monthly category limits with spent and remaining amounts.</p>
        </div>
        <Button onClick={openCreate}>Add budget</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {budgets.map((budget) => (
          <div key={budget.id} className="space-y-2">
            <StatusPill progress={clampPercent(percent(budget.spent, budget.amount))} />
            <BudgetCard
              budget={budget}
              currency={settings.currency}
              onEdit={openEdit}
              onDelete={setPending}
            />
          </div>
        ))}
      </div>

      <Modal
        open={open}
        title={editing ? 'Edit budget' : 'Add budget'}
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
          <Select
            id="budget-category"
            label="Category"
            value={form.category}
            onChange={(event) => setForm({ ...form, category: event.target.value })}
          >
            {CATEGORIES.filter((item) => item.type === 'expense').map((item) => (
              <option key={item.id} value={item.name}>
                {item.name}
              </option>
            ))}
          </Select>
          <Input
            id="budget-amount"
            label="Budget amount"
            type="number"
            value={form.amount}
            onChange={(event) => setForm({ ...form, amount: event.target.value })}
          />
          <Input
            id="budget-spent"
            label="Spent"
            type="number"
            value={form.spent}
            onChange={(event) => setForm({ ...form, spent: event.target.value })}
          />
        </div>
      </Modal>

      <ConfirmDialog
        open={Boolean(pending)}
        title="Delete budget?"
        description="This category limit will be removed from the preview data."
        confirmLabel="Delete"
        onClose={() => setPending(null)}
        onConfirm={async () => {
          await removeBudget(pending.id)
          setPending(null)
          push('Budget deleted.', 'success')
        }}
      />
    </div>
  )
}
