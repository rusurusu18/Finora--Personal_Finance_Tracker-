import Button from '../ui/Button'
import { useLanguage } from '../../contexts/useLanguage'

export default function CtaSection({ onGetStarted }) {
  const { t } = useLanguage()
  return (
    <section className="mx-auto max-w-6xl px-4 pb-20">
      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center dark:border-slate-700 dark:bg-slate-800">
        <h2 className="text-2xl font-semibold tracking-tight">{t('Start understanding your money today.')}</h2>
        <p className="mx-auto mt-3 max-w-xl text-slate-600 dark:text-slate-300">
          {t('Create an account to organize your money, track spending, and build a plan around your goals.')}
        </p>
        <Button className="mt-6" onClick={onGetStarted}>
          {t('Get Started')}
        </Button>
      </div>
    </section>
  )
}
