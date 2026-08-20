import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { formatCurrency } from '../utils/helpers'

const colors = ['#4f46e5', '#059669', '#d97706', '#dc2626', '#0ea5e9', '#7c3aed']

export default function DonutChart({ data, currency }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
            {data.map((entry, index) => (
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
