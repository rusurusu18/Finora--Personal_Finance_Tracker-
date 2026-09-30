import Button from '../ui/Button'
import { useLanguage } from '../../contexts/useLanguage'

export default function HeroSection({ onGetStarted, onSignIn }) {
  const { t } = useLanguage()
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 lg:py-24">
      <div>
        <p className="text-sm font-medium text-indigo-600">{t('Personal finance for Nepal')}</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
          {t('Know Where Your Money Is.')}
          <span className="mt-2 block">{t("Know Where It's Going.")}</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300">
          {t('Finora brings bank accounts, cash, eSewa, Khalti, and Fonepay into one calm picture so you can track spending, set budgets, and see whether your goals are realistic.')}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button onClick={onGetStarted}>{t('Get Started')}</Button>
          <Button variant="secondary" onClick={onSignIn}>
            {t('Sign in')}
          </Button>
        </div>
        <p className="mt-6 text-sm text-slate-500">
          {t('Built around NPR.')}
        </p>
      </div>

    </section>
  )
}
