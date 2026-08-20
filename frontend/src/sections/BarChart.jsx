import { Bar, BarChart as Chart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatCurrency } from '../utils/helpers'

export default function BarChart({ data, currency, dataKey = 'value', nameKey = 'name' }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <Chart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
          <XAxis dataKey={nameKey} tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip formatter={(value) => formatCurrency(value, currency)} />
          <Bar dataKey={dataKey} fill="#4f46e5" radius={[8, 8, 0, 0]} />
        </Chart>
      </ResponsiveContainer>
    </div>
  )
}
