import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { formatCurrency } from '../../utils/helpers'
import { useLanguage } from '../../contexts/useLanguage'

const colors = ['#4f46e5', '#059669', '#d97706', '#dc2626', '#0ea5e9', '#7c3aed']

export default function DonutChart({ data, currency }) {
  const { t } = useLanguage()
  const translatedData = data.map((entry) => ({ ...entry, name: t(entry.name) }))
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={translatedData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
            {translatedData.map((entry, index) => (
              <Cell key={entry.name} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => formatCurrency(value, currency)} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
