import { useState } from 'react'
import { useFinance } from '../../hooks/useFinance'
import { useToast } from '../../components/ui/Toast'
import SavingsGoalCard from '../../components/finance/SavingsGoalCard'
import Button from '../../components/ui/Button'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import { FiPlus } from 'react-icons/fi'
import { useLanguage } from '../../contexts/useLanguage'

const defaultTargetDate = () =>
  new Date(Date.UTC(new Date().getUTCFullYear() + 1, 11, 31)).toISOString().slice(0, 10)

export default function SavingsGoals() {
  const { t } = useLanguage()
  const { savingsGoals, settings, addGoal, editGoal, removeGoal } = useFinance()
  const { push } = useToast()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [pending, setPending] = useState(null)
  const [form, setForm] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    targetDate: defaultTargetDate(),
  })

  function openCreate() {
    setEditing(null)
    setForm({ name: '', targetAmount: '', currentAmount: '0', targetDate: defaultTargetDate() })
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
      push(t('Goal updated.'), 'success')
    } else {
      await addGoal(payload)
      push(t('Goal added.'), 'success')
    }
    setOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t('Savings goals')}</h1>
          <p className="text-sm text-slate-500">{t('Emergency fund, laptop, travel, education, and more.')}</p>
        </div>
        <Button onClick={openCreate}><FiPlus aria-hidden="true" />{t('Add goal')}</Button>
      </div>

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
        title={t(editing ? 'Edit goal' : 'Add goal')}
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
            id="goal-name"
            label={t('Goal name')}
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
          />
          <Input
            id="goal-target"
            label={t('Target amount')}
            type="number"
            value={form.targetAmount}
            onChange={(event) => setForm({ ...form, targetAmount: event.target.value })}
          />
          <Input
            id="goal-current"
            label={t('Current amount')}
            type="number"
            value={form.currentAmount}
            onChange={(event) => setForm({ ...form, currentAmount: event.target.value })}
          />
          <Input
            id="goal-date"
            label={t('Target date')}
            type="date"
            value={form.targetDate}
            onChange={(event) => setForm({ ...form, targetDate: event.target.value })}
          />
        </div>
      </Modal>

      <ConfirmDialog
        open={Boolean(pending)}
        title={t('Delete savings goal?')}
        description={t('This savings goal will be permanently removed.')}
        confirmLabel={t('Delete')}
        onClose={() => setPending(null)}
        onConfirm={async () => {
          await removeGoal(pending.id)
          setPending(null)
          push(t('Goal deleted.'), 'success')
        }}
      />
    </div>
  )
}
