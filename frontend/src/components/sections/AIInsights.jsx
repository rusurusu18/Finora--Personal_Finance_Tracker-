import { useState } from 'react'
import { getFinancialInsightsRequest } from '../../config/services'
import { useLanguage } from '../../contexts/useLanguage'
import Button from '../ui/Button'
import SectionCard from './SectionCard'
import { FiZap } from 'react-icons/fi'

const toneStyles = {
  positive: 'border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/40',
  warning: 'border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/40',
  neutral: 'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/50',
}

export default function AIInsights() {
  const { t } = useLanguage()
  const [insights, setInsights] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function generateInsights() {
    setLoading(true)
    setError('')
    try {
      const result = await getFinancialInsightsRequest()
      setInsights(result.insights)
    } catch (requestError) {
      setError(requestError.message || t('Could not generate financial insights.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <SectionCard
      icon={FiZap}
      title={t('AI-powered financial insights')}
      description={t('Gemini reviews category and income/expense totals from your last 60 days. Transaction descriptions are not sent.')}
      action={
        <Button variant="secondary" onClick={generateInsights} disabled={loading}>
          <FiZap aria-hidden="true" />
          {loading
            ? t('Generating insights…')
            : insights.length
              ? t('Refresh insights')
              : t('Generate insights')}
        </Button>
      }
    >
      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300" role="alert">
          {error}
        </p>
      ) : insights.length ? (
        <ul className="grid gap-3 sm:grid-cols-2">
          {insights.map((insight, index) => (
            <li
              key={`${insight.title}-${index}`}
              className={`rounded-xl border p-4 ${toneStyles[insight.tone] || toneStyles.neutral}`}
            >
              <h3 className="font-medium">{insight.title}</h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{insight.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-slate-500">
          {t('Generate a short, personalized summary of your recent spending and income trends.')}
        </p>
      )}
    </SectionCard>
  )
}
