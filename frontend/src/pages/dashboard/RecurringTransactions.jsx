import { useEffect, useState } from 'react'
import { FiPause, FiPlay, FiPlus, FiRepeat, FiTrash2 } from 'react-icons/fi'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import EmptyState from '../../components/ui/EmptyState'
import { useFinance } from '../../hooks/useFinance'
import { useToast } from '../../components/ui/Toast'
import { useLanguage } from '../../contexts/useLanguage'
import {
  createRecurringTransaction,
  deleteRecurringTransaction,
  getRecurringTransactions,
  updateRecurringTransaction,
} from '../../config/services'
import {
  convertDateToBikramSambat,
  convertDateToGregorian,
  formatCurrency,
  formatDate,
  localDateISO,
} from '../../utils/helpers'

const frequencies = ['daily', 'weekly', 'monthly', 'yearly']

const createForm = (calendar) => ({
  title: '',
  amount: '',
  type: 'expense',
  categoryId: '',
  accountId: '',
  frequency: 'monthly',
  interval: '1',
  startDate: calendar === 'BS' ? convertDateToBikramSambat(localDateISO()) : localDateISO(),
  endDate: '',
  notes: '',
})

function toGregorianDate(value, calendar) {
  if (!value) return null
  const converted = convertDateToGregorian(value, calendar)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(converted) || Number.isNaN(new Date(`${converted}T00:00:00Z`).getTime())) {
    throw new Error('Enter a valid date.')
  }
  return converted
}

// Recurring transactions page for scheduled income and expenses.

export default function RecurringTransactions() {
  const { t } = useLanguage()
  const { accounts, categories, settings } = useFinance()
  const { push } = useToast()
  const [schedules, setSchedules] = useState([])
  const [form, setForm] = useState(() => createForm(settings.calendar))
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [pendingDelete, setPendingDelete] = useState(null)

  async function refreshSchedules() {
    const result = await getRecurringTransactions()
    setSchedules(result)
  }

  useEffect(() => {
    getRecurringTransactions()
      .then(setSchedules)
      .catch((requestError) => setError(requestError.message || t('Could not load recurring transactions.')))
      .finally(() => setLoading(false))
  }, [t])

  async function saveSchedule(event) {
    event.preventDefault()
    setError('')

    let startDate
    let endDate
    try {
      startDate = toGregorianDate(form.startDate, settings.calendar)
      endDate = toGregorianDate(form.endDate, settings.calendar)
    } catch (dateError) {
      setError(t(dateError.message))
      return
    }

    if (!form.title.trim() || Number(form.amount) <= 0 || !form.accountId || !startDate) {
      setError(t('Enter a title, positive amount, account, and valid start date.'))
      return
    }
    if (!Number.isInteger(Number(form.interval)) || Number(form.interval) < 1 || Number(form.interval) > 365) {
      setError(t('Repeat interval must be a whole number from 1 to 365.'))
      return
    }
    if (endDate && endDate < startDate) {
      setError(t('End date must be on or after the start date.'))
      return
    }

    setSaving(true)
    try {
      const account = accounts.find((item) => item.id === form.accountId)
      const selectedCategory = categories.find((item) => item.id === form.categoryId)
      await createRecurringTransaction({
        ...form,
        title: form.title.trim(),
        accountId: form.accountId,
        categoryId: selectedCategory?.id || null,
        paymentSource: account?.institution || account?.name || '',
        startDate,
        endDate,
      })
      await refreshSchedules()
      setForm(createForm(settings.calendar))
      push(t('Recurring transaction added.'), 'success')
    } catch (requestError) {
      setError(requestError.message || t('The request could not be completed.'))
    } finally {
      setSaving(false)
    }
  }

  async function toggleSchedule(schedule) {
    try {
      const updated = await updateRecurringTransaction(schedule.id, !schedule.isActive)
      setSchedules((current) => current.map((item) => item.id === updated.id ? updated : item))
      push(t(updated.isActive ? 'Recurring transaction resumed.' : 'Recurring transaction paused.'), 'success')
    } catch (requestError) {
      push(requestError.message || t('The request could not be completed.'), 'danger')
    }
  }

  async function removeSchedule() {
    try {
      await deleteRecurringTransaction(pendingDelete.id)
      setSchedules((current) => current.filter((item) => item.id !== pendingDelete.id))
      setPendingDelete(null)
      push(t('Recurring transaction deleted.'), 'success')
    } catch (requestError) {
      push(requestError.message || t('The request could not be completed.'), 'danger')
    }
  }

  const availableCategories = categories.filter((item) => item.type === form.type)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t('Recurring transactions')}</h1>
        <p className="text-sm text-slate-500">{t('Schedule transactions to be recorded automatically on their due dates.')}</p>
      </div>

      <Card className="p-5">
        <h2 className="mb-4 flex items-center gap-2 font-semibold">
          <FiRepeat aria-hidden="true" />
          {t('Add recurring transaction')}
        </h2>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={saveSchedule}>
          <Input
            id="recurring-title"
            label={t('Title')}
            value={form.title}
            onChange={(event) => setForm({ ...form, title: event.target.value })}
          />
          <Input
            id="recurring-amount"
            label={t('Amount')}
            type="number"
            min="0.01"
            step="0.01"
            value={form.amount}
            onChange={(event) => setForm({ ...form, amount: event.target.value })}
          />
          <Select
            id="recurring-type"
            label={t('Type')}
            value={form.type}
            onChange={(event) => {
              const type = event.target.value
              const firstCategory = categories.find((item) => item.type === type)
              setForm({ ...form, type, categoryId: firstCategory?.id || '' })
            }}
          >
            <option value="expense">{t('Expense')}</option>
            <option value="income">{t('Income')}</option>
          </Select>
          <Select
            id="recurring-category"
            label={t('Category')}
            value={form.categoryId}
            onChange={(event) => setForm({ ...form, categoryId: event.target.value })}
          >
            <option value="">{t('Select a category')}</option>
            {availableCategories.map((category) => (
              <option key={category.id} value={category.id}>{t(category.name)}</option>
            ))}
          </Select>
          <Select
            id="recurring-account"
            label={t('Account')}
            value={form.accountId}
            onChange={(event) => setForm({ ...form, accountId: event.target.value })}
          >
            <option value="">{t('Select an account')}</option>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>{account.name}</option>
            ))}
          </Select>
          <div className="grid grid-cols-2 gap-3">
            <Select
              id="recurring-frequency"
              label={t('Frequency')}
              value={form.frequency}
              onChange={(event) => setForm({ ...form, frequency: event.target.value })}
            >
              {frequencies.map((frequency) => (
                <option key={frequency} value={frequency}>{t(frequency)}</option>
              ))}
            </Select>
            <Input
              id="recurring-interval"
              label={t('Every')}
              type="number"
              min="1"
              max="365"
              step="1"
              value={form.interval}
              onChange={(event) => setForm({ ...form, interval: event.target.value })}
            />
          </div>
          <Input
            id="recurring-start-date"
            label={settings.calendar === 'BS' ? `${t('First due date')} (BS YYYY-MM-DD)` : t('First due date')}
            type={settings.calendar === 'BS' ? 'text' : 'date'}
            placeholder={settings.calendar === 'BS' ? 'YYYY-MM-DD' : undefined}
            value={form.startDate}
            onChange={(event) => setForm({ ...form, startDate: event.target.value })}
          />
          <Input
            id="recurring-end-date"
            label={settings.calendar === 'BS' ? `${t('End date')} (BS YYYY-MM-DD)` : t('End date')}
            type={settings.calendar === 'BS' ? 'text' : 'date'}
            placeholder={settings.calendar === 'BS' ? 'YYYY-MM-DD' : undefined}
            value={form.endDate}
            onChange={(event) => setForm({ ...form, endDate: event.target.value })}
          />
          <Input
            id="recurring-notes"
            label={t('Description')}
            value={form.notes}
            onChange={(event) => setForm({ ...form, notes: event.target.value })}
          />
          {error ? <p className="text-sm text-red-600 md:col-span-2" role="alert">{t(error)}</p> : null}
          <div className="md:col-span-2">
            <Button type="submit" disabled={saving || !accounts.length}>
              <FiPlus aria-hidden="true" />
              {saving ? t('Saving...') : t('Save schedule')}
            </Button>
          </div>
        </form>
      </Card>

      <section aria-labelledby="recurring-list-heading">
        <h2 id="recurring-list-heading" className="mb-3 text-lg font-semibold">{t('Your schedules')}</h2>
        {loading ? (
          <p className="text-sm text-slate-500">{t('Loading...')}</p>
        ) : schedules.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {schedules.map((schedule) => {
              const completed = !schedule.isActive && schedule.endDate && schedule.nextRunAt > schedule.endDate
              return (
              <Card key={schedule.id} className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold">{schedule.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {t(schedule.type)} · {t(schedule.frequency)} · {schedule.interval}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {schedule.accountName}{schedule.category ? ` · ${t(schedule.category)}` : ''}
                    </p>
                  </div>
                  <p className="font-semibold">{formatCurrency(schedule.amount, settings.currency)}</p>
                </div>
                <div className="mt-4 space-y-1 text-sm">
                  <p>{t('Next due')}: {formatDate(schedule.nextRunAt, settings.calendar)}</p>
                  {schedule.endDate ? <p>{t('Ends')}: {formatDate(schedule.endDate, settings.calendar)}</p> : null}
                  <p className={schedule.isActive ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-500'}>
                    {t(completed ? 'Completed' : schedule.isActive ? 'Active' : 'Paused')}
                  </p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {!completed ? (
                    <Button variant="secondary" size="sm" onClick={() => toggleSchedule(schedule)}>
                      {schedule.isActive ? <FiPause aria-hidden="true" /> : <FiPlay aria-hidden="true" />}
                      {t(schedule.isActive ? 'Pause' : 'Resume')}
                    </Button>
                  ) : null}
                  <Button variant="ghost" size="sm" onClick={() => setPendingDelete(schedule)}>
                    <FiTrash2 aria-hidden="true" />
                    {t('Delete')}
                  </Button>
                </div>
              </Card>
              )
            })}
          </div>
        ) : (
          <EmptyState
            title={t('No recurring transactions yet')}
            description={t('Add a schedule to automatically record regular income or expenses.')}
          />
        )}
      </section>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={t('Delete recurring transaction?')}
        description={t('Deleting the schedule will keep transactions already recorded.')}
        confirmLabel={t('Delete')}
        onClose={() => setPendingDelete(null)}
        onConfirm={removeSchedule}
      />
    </div>
  )
}
