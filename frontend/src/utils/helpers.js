import { adToBs, bsToAd } from '@sbmdkl/nepali-date-converter'

export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function formatCurrency(amount, currency = 'NPR') {
  const value = Number(amount) || 0
  const formatted = value.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
  return `${currency} ${formatted}`
}

export function formatCompact(amount, currency = 'NPR') {
  return formatCurrency(amount, currency)
}

export function formatDate(value, calendar = 'AD') {
  if (!value) return '—'
  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return value
  if (calendar === 'BS') {
    try {
      return `${adToBs(value)} BS`
    } catch {
      return `${value} (AD; BS unavailable)`
    }
  }
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function convertDateToGregorian(value, calendar = 'AD') {
  if (!value) return value
  if (calendar !== 'BS') return value
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error('Enter a valid Bikram Sambat date in YYYY-MM-DD format.')
  }
  return bsToAd(value)
}

export function convertDateToBikramSambat(value) {
  return adToBs(value)
}

export function localDateISO(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function percent(part, total) {
  if (!total) return 0
  return Math.round((Number(part) / Number(total)) * 100)
}

export function clampPercent(value) {
  return Math.min(100, Math.max(0, value))
}

export function getGreeting(date = new Date()) {
  const hour = date.getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export function sumBy(items, predicate) {
  return items.reduce((total, item) => total + (predicate(item) ? Number(item.amount) || 0 : 0), 0)
}

export function groupBy(items, key) {
  return items.reduce((acc, item) => {
    const group = item[key]
    acc[group] = acc[group] || []
    acc[group].push(item)
    return acc
  }, {})
}

export function downloadCsv(filename, rows) {
  const csv = rows
    .map((row) =>
      row
        .map((cell) => {
          const value = String(cell ?? '')
          if (value.includes(',') || value.includes('"') || value.includes('\n')) {
            return `"${value.replaceAll('"', '""')}"`
          }
          return value
        })
        .join(','),
    )
    .join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export function nextId(items) {
  return items.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1
}

export function monthKey(date) {
  return String(date).slice(0, 7)
}

export function isCurrentMonth(date, now = new Date()) {
  const current = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  return monthKey(date) === current
}
