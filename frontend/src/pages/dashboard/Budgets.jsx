import { useState } from 'react'
import { useFinance } from '../../hooks/useFinance'
import { useToast } from '../../components/ui/Toast'
import BudgetCard from '../../components/finance/BudgetCard'
import Button from '../../components/ui/Button'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import Select from '../../components/ui/Select'
import StatusPill from '../../components/sections/StatusPill'
import { clampPercent, percent } from '../../utils/helpers'
import { FiPlus } from 'react-icons/fi'
import { useLanguage } from '../../contexts/useLanguage'

// Budgets page for tracking spending categories and limits.

export default function Budgets() {
  const { t } = useLanguage()
  const { budgets, categories, settings, addBudget, editBudget, removeBudget } = useFinance()
  const { push } = useToast()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [pending, setPending] = useState(null)
  const currentPeriod = new Date().toISOString().slice(0, 7)
  const [form, setForm] = useState({ category: '', amount: '', period: currentPeriod })

  function openCreate() {
    setEditing(null)
    setForm({
      category: categories.find((item) => item.type === 'expense')?.name || '',
      amount: '',
      period: currentPeriod,
    })
    setOpen(true)
  }

  function openEdit(budget) {
    setEditing(budget)
    setForm({
      category: budget.category,
      amount: budget.amount,
      period: budget.period,
    })
    setOpen(true)
  }

  async function save() {
    const payload = {
      ...form,
      amount: Number(form.amount),
      categoryId: categories.find((item) => item.name === form.category)?.id,
    }
    if (editing) {
      await editBudget(editing.id, payload)
      push(t('Budget updated.'), 'success')
    } else {
      await addBudget(payload)
      push(t('Budget added.'), 'success')
    }
    setOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t('Budgets')}</h1>
          <p className="text-sm text-slate-500">{t('Monthly category limits with spent and remaining amounts.')}</p>
        </div>
        <Button onClick={openCreate}><FiPlus aria-hidden="true" />{t('Add budget')}</Button>
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
        title={t(editing ? 'Edit budget' : 'Add budget')}
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
          <Select
            id="budget-category"
            label={t('Category')}
            value={form.category}
            onChange={(event) => setForm({ ...form, category: event.target.value })}
          >
            {categories.filter((item) => item.type === 'expense').map((item) => (
              <option key={item.id} value={item.name}>
                {item.name}
              </option>
            ))}
          </Select>
          <Input
            id="budget-amount"
            label={t('Budget amount')}
            type="number"
            value={form.amount}
            onChange={(event) => setForm({ ...form, amount: event.target.value })}
          />
        </div>
      </Modal>

      <ConfirmDialog
        open={Boolean(pending)}
        title={t('Delete budget?')}
        description={t('This budget will be permanently removed.')}
        confirmLabel={t('Delete')}
        onClose={() => setPending(null)}
        onConfirm={async () => {
          await removeBudget(pending.id)
          setPending(null)
          push(t('Budget deleted.'), 'success')
        }}
      />
    </div>
  )
}
