import { Area, AreaChart as Chart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatCurrency } from '../utils/helpers'

export default function AreaChart({ data, currency }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <Chart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip formatter={(value) => formatCurrency(value, currency)} />
          <Area type="monotone" dataKey="income" stroke="#4f46e5" fill="#c7d2fe" name="Income" />
          <Area type="monotone" dataKey="expense" stroke="#dc2626" fill="#fecaca" name="Expense" />
        </Chart>
      </ResponsiveContainer>
    </div>
  )
}
