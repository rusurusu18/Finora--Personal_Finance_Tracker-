import DonutChart from './DonutChart'
import SectionCard from './SectionCard'
import { useLanguage } from '../../contexts/useLanguage'

export default function SpendingOverview({ data, currency }) {
  const { t } = useLanguage()
  return (
    <SectionCard title={t('Category spending')} description={t('Where expenses went this period.')}>
      <DonutChart data={data} currency={currency} />
    </SectionCard>
  )
}
