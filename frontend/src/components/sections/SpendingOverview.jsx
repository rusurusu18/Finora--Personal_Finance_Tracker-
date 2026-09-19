import DonutChart from './DonutChart'
import SectionCard from './SectionCard'

export default function SpendingOverview({ data, currency }) {
  return (
    <SectionCard title="Category spending" description="Where expenses went this period.">
      <DonutChart data={data} currency={currency} />
    </SectionCard>
  )
}
