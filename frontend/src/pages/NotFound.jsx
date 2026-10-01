import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import { FiAlertCircle, FiGrid, FiHome } from 'react-icons/fi'
import { useLanguage } from '../contexts/useLanguage'

export default function NotFound() {
  const { t } = useLanguage()
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <FiAlertCircle className="mb-3 h-8 w-8 text-indigo-600" aria-hidden="true" />
      <p className="text-6xl font-bold text-indigo-600">404</p>

      <h1 className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white">
        {t('Page Not Found')}
      </h1>

      <p className="mt-3 text-slate-600 dark:text-slate-300">
        {t("Sorry, we couldn't find the page you're looking for. It may have been moved, deleted, or the URL may be incorrect.")}
      </p>

      <div className="mt-6 flex gap-3">
        <Link to="/">
          <Button><FiHome aria-hidden="true" />{t('Home')}</Button>
        </Link>

        <Link to="/dashboard">
          <Button variant="secondary"><FiGrid aria-hidden="true" />{t('Dashboard')}</Button>
        </Link>
      </div>
    </main>
  )
}
