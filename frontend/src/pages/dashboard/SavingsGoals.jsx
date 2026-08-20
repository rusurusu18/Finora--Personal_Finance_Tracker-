import { useState } from 'react'
import { useFinance } from '../../hooks/useFinance'
import { useToast } from '../../ui/Toast'
import SavingsGoalCard from '../../finance/SavingsGoalCard'
import FinancialInsight from '../../finance/FinancialInsight'
import Button from '../../ui/Button'
import ConfirmDialog from '../../ui/ConfirmDialog'
import Input from '../../ui/Input'
import Modal from '../../ui/Modal'

export default function SavingsGoals() {
  const { savingsGoals, settings, addGoal, editGoal, removeGoal } = useFinance()
  const { push } = useToast()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [pending, setPending] = useState(null)
  const [form, setForm] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    targetDate: '2026-12-31',
  })

  function openCreate() {
    setEditing(null)
    setForm({ name: '', targetAmount: '', currentAmount: '0', targetDate: '2026-12-31' })
    setOpen(true)
  }

  function openEdit(goal) {
    setEditing(goal)
    setForm({
      name: goal.name,
      targetAmount: goal.targetAmount,
      currentAmount: goal.currentAmount,
      targetDate: goal.targetDate,
    })
    setOpen(true)
  }

  async function save() {
    const payload = {
      ...form,
      targetAmount: Number(form.targetAmount),
      currentAmount: Number(form.currentAmount),
    }
    if (editing) {
      await editGoal(editing.id, payload)
      push('Goal updated.', 'success')
    } else {
      await addGoal(payload)
      push('Goal added.', 'success')
    }
    setOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Savings goals</h1>
          <p className="text-sm text-slate-500">Emergency fund, laptop, travel, education, and more.</p>
        </div>
        <Button onClick={openCreate}>Add goal</Button>
      </div>

      <FinancialInsight
        tone="info"
        title="You are on track to reach your Emergency Fund goal."
        message="Keep the current monthly transfer and the first safety target stays realistic."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {savingsGoals.map((goal) => (
          <SavingsGoalCard
            key={goal.id}
            goal={goal}
            currency={settings.currency}
            onEdit={openEdit}
            onDelete={setPending}
          />
        ))}
      </div>

      <Modal
        open={open}
        title={editing ? 'Edit goal' : 'Add goal'}
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
            id="goal-name"
            label="Goal name"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
          />
          <Input
            id="goal-target"
            label="Target amount"
            type="number"
            value={form.targetAmount}
            onChange={(event) => setForm({ ...form, targetAmount: event.target.value })}
          />
          <Input
            id="goal-current"
            label="Current amount"
            type="number"
            value={form.currentAmount}
            onChange={(event) => setForm({ ...form, currentAmount: event.target.value })}
          />
          <Input
            id="goal-date"
            label="Target date"
            type="date"
            value={form.targetDate}
            onChange={(event) => setForm({ ...form, targetDate: event.target.value })}
          />
        </div>
      </Modal>

      <ConfirmDialog
        open={Boolean(pending)}
        title="Delete savings goal?"
        description="This goal will be removed from preview data."
        confirmLabel="Delete"
        onClose={() => setPending(null)}
        onConfirm={async () => {
          await removeGoal(pending.id)
          setPending(null)
          push('Goal deleted.', 'success')
        }}
      />
    </div>
  )
}
