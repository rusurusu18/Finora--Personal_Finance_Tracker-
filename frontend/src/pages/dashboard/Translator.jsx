import { useState } from 'react'
import { Languages, LoaderCircle, Sparkles } from 'lucide-react'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import { useLanguage } from '../../contexts/useLanguage'
import { translateText } from '../../services/translationApi'

export default function Translator() {
  const { t } = useLanguage()
  const [english, setEnglish] = useState('')
  const [nepali, setNepali] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleTranslate(event) {
    event.preventDefault()
    if (!english.trim() || loading) return

    setLoading(true)
    setError('')
    try {
      const data = await translateText(english)
      setNepali(data.nepali)
    } catch (requestError) {
      setError(requestError.message || t('Translation failed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-300">
          <Sparkles className="h-4 w-4" />
          {t('English to Nepali')}
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">{t('Translator')}</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {t('Translate English text into Nepali. Translations are saved to your account.')}
        </p>
      </div>

      <form onSubmit={handleTranslate}>
        <Card className="grid gap-5 p-5 md:grid-cols-2 md:p-6">
          <label className="flex min-w-0 flex-col gap-2" htmlFor="translation-english">
            <span className="text-sm font-semibold">{t('English')}</span>
            <textarea
              id="translation-english"
              value={english}
              onChange={(event) => setEnglish(event.target.value)}
              placeholder={t('Enter English text...')}
              maxLength={5000}
              rows={9}
              required
              className="w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm leading-6 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900"
            />
            <span className="text-right text-xs text-slate-500">{english.length}/5000</span>
          </label>

          <div className="flex min-w-0 flex-col gap-2">
            <label className="text-sm font-semibold" htmlFor="translation-nepali">{t('Nepali')}</label>
            <div
              id="translation-nepali"
              className="min-h-56 flex-1 whitespace-pre-wrap rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm leading-7 dark:border-slate-700 dark:bg-slate-900/70"
              aria-live="polite"
            >
              {nepali || <span className="text-slate-400">{t('Your translation will appear here.')}</span>}
            </div>
          </div>

          <div className="md:col-span-2">
            {error ? <p className="mb-3 text-sm text-red-600" role="alert">{error}</p> : null}
            <Button type="submit" disabled={loading || !english.trim()}>
              {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Languages className="h-4 w-4" />}
              {loading ? t('Translating...') : t('Translate')}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  )
}