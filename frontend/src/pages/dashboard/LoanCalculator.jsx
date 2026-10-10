import { useMemo, useState } from 'react'
import { Landmark, Trash2 } from 'lucide-react'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import Input from '../../components/ui/Input'
import { useFinance } from '../../hooks/useFinance'
import { useToast } from '../../components/ui/Toast'
import { useLanguage } from '../../contexts/useLanguage'
import { formatCurrency } from '../../utils/helpers'

const roundCurrency = (value) => Math.round((value + Number.EPSILON) * 100) / 100

function calculateEmi(principalValue, rateValue, termValue) {
  if (!principalValue || rateValue === '' || !termValue) return null

  const principal = Number(principalValue)
  const annualRate = Number(rateValue)
  const months = Number(termValue)
  if (
    !Number.isFinite(principal) || principal <= 0 ||
    !Number.isFinite(annualRate) || annualRate < 0 || annualRate > 100 ||
    !Number.isInteger(months) || months < 1 || months > 600
  ) {
    return null
  }

  const monthlyRate = annualRate / 1200
  const monthlyPayment = monthlyRate === 0
    ? principal / months
    : principal * monthlyRate * (1 + monthlyRate) ** months
      / ((1 + monthlyRate) ** months - 1)
  const totalPayment = roundCurrency(monthlyPayment * months)

  return {
    monthlyPayment: roundCurrency(monthlyPayment),
    totalPayment,
    totalInterest: roundCurrency(Math.max(0, totalPayment - principal)),
  }
}

// Loan calculator page for planning loans and repayment scenarios.

export default function LoanCalculator() {
  const { t } = useLanguage()
  const { settings, loanPlans, addLoanPlan, removeLoanPlan } = useFinance()
  const { push } = useToast()
  const [form, setForm] = useState({
    name: '',
    principal: '',
    annualInterestRate: '',
    termMonths: '',
  })
  const [saving, setSaving] = useState(false)
  const [pendingDelete, setPendingDelete] = useState(null)
  const calculation = useMemo(
    () => calculateEmi(form.principal, form.annualInterestRate, form.termMonths),
    [form.principal, form.annualInterestRate, form.termMonths],
  )

  async function savePlan() {
    if (!form.name.trim() || !calculation) return
    setSaving(true)
    try {
      await addLoanPlan(form)
      setForm({ name: '', principal: '', annualInterestRate: '', termMonths: '' })
      push(t('Loan plan saved.'), 'success')
    } catch (error) {
      push(error.message || t('The request could not be completed.'), 'danger')
    } finally {
      setSaving(false)
    }
  }

  async function deletePlan() {
    try {
      await removeLoanPlan(pendingDelete.id)
      setPendingDelete(null)
      push(t('Loan plan deleted.'), 'success')
    } catch (error) {
      push(error.message || t('The request could not be completed.'), 'danger')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t('Loan & EMI Calculator')}</h1>
        <p className="text-sm text-slate-500">{t('Calculate and save loan plans.')}</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.8fr)]">
        <Card className="p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              id="loan-name"
              label={t('Loan name')}
              value={form.name}
              maxLength={100}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
            />
            <Input
              id="loan-principal"
              label={t('Loan amount')}
              type="number"
              min="0.01"
              max="9999999999999"
              step="0.01"
              value={form.principal}
              onChange={(event) => setForm({ ...form, principal: event.target.value })}
            />
            <Input
              id="loan-rate"
              label={t('Annual interest rate (%)')}
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={form.annualInterestRate}
              onChange={(event) => setForm({ ...form, annualInterestRate: event.target.value })}
            />
            <Input
              id="loan-term"
              label={t('Loan term (months)')}
              type="number"
              min="1"
              max="600"
              step="1"
              value={form.termMonths}
              onChange={(event) => setForm({ ...form, termMonths: event.target.value })}
            />
          </div>
        </Card>

        <Card className="flex flex-col justify-between gap-5 p-5">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Landmark className="h-4 w-4" aria-hidden="true" />
              {t('Monthly EMI')}
            </div>
            <p className="mt-2 text-3xl font-semibold">
              {formatCurrency(calculation?.monthlyPayment || 0, settings.currency)}
            </p>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">{t('Total interest')}</dt>
                <dd className="font-medium">{formatCurrency(calculation?.totalInterest || 0, settings.currency)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">{t('Total repayment')}</dt>
                <dd className="font-medium">{formatCurrency(calculation?.totalPayment || 0, settings.currency)}</dd>
              </div>
            </dl>
          </div>
          <Button
            onClick={savePlan}
            disabled={!calculation || !form.name.trim() || saving}
          >
            {saving ? t('Saving…') : t('Save loan plan')}
          </Button>
        </Card>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">{t('Saved loan plans')}</h2>
        {loanPlans.length ? (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {loanPlans.map((plan) => (
              <Card key={plan.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{plan.name}</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {formatCurrency(plan.principal, settings.currency)} · {plan.annualInterestRate}% · {plan.termMonths} {t('months')}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                    aria-label={`${t('Delete')} ${plan.name}`}
                    onClick={() => setPendingDelete(plan)}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
                <div className="mt-4 space-y-2 text-sm">
                  <p className="flex justify-between gap-3">
                    <span className="text-slate-500">{t('Monthly EMI')}</span>
                    <span className="font-medium">{formatCurrency(plan.monthlyPayment, settings.currency)}</span>
                  </p>
                  <p className="flex justify-between gap-3">
                    <span className="text-slate-500">{t('Total interest')}</span>
                    <span className="font-medium">{formatCurrency(plan.totalInterest, settings.currency)}</span>
                  </p>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-5 text-sm text-slate-500">{t('No saved loan plans yet.')}</Card>
        )}
      </section>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={t('Delete loan plan?')}
        description={t('This loan plan will be permanently removed.')}
        confirmLabel={t('Delete')}
        onClose={() => setPendingDelete(null)}
        onConfirm={deletePlan}
      />
    </div>
  )
}
