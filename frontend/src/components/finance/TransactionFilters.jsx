import { useState } from 'react'
import Input from '../ui/Input'
import Select from '../ui/Select'
import { TRANSACTION_TYPES } from '../../utils/constants'
import { useLanguage } from '../../contexts/useLanguage'
import { convertDateToBikramSambat, convertDateToGregorian } from '../../utils/helpers'

function CalendarFilter({ id, label, value, calendar, onChange }) {
  const { t } = useLanguage()
  const source = `${calendar}:${value}`
  const formattedValue = calendar === 'BS' && value
    ? convertDateToBikramSambat(value)
    : value
  const [input, setInput] = useState({ source, value: formattedValue, error: '' })

  if (input.source !== source) {
    setInput({ source, value: formattedValue, error: '' })
  }

  function handleChange(event) {
    const nextValue = event.target.value
    setInput({ source, value: nextValue, error: '' })
    if (!nextValue) {
      onChange('')
      return
    }

    let convertedValue
    try {
      convertedValue = convertDateToGregorian(nextValue, calendar)
    } catch {
      setInput({
        source,
        value: nextValue,
        error: t('Enter a valid Bikram Sambat date in YYYY-MM-DD format.'),
      })
      return
    }
    onChange(convertedValue)
  }

  return (
    <Input
      id={id}
      label={calendar === 'BS' ? `${label} (BS YYYY-MM-DD)` : label}
      type={calendar === 'BS' ? 'text' : 'date'}
      placeholder={calendar === 'BS' ? 'YYYY-MM-DD' : undefined}
      inputMode={calendar === 'BS' ? 'numeric' : undefined}
      value={input.value}
      error={input.error}
      onChange={handleChange}
    />
  )
}

export default function TransactionFilters({ filters, onChange, categories, calendar = 'AD' }) {
  const { t } = useLanguage()
  const uniqueCategories = [...new Map(categories.map((category) => [category.name, category])).values()]

  function update(key, value) {
    onChange({ ...filters, [key]: value })
  }

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
      <Input
        id="search"
        label={t('Search')}
        placeholder={t('Salary, rent, eSewa...')}
        value={filters.search}
        onChange={(event) => update('search', event.target.value)}
      />
      <Select id="type" label={t('Type')} value={filters.type} onChange={(event) => update('type', event.target.value)}>
        <option value="">{t('All types')}</option>
        {TRANSACTION_TYPES.map((item) => (
          <option key={item.value} value={item.value}>
            {t(item.label)}
          </option>
        ))}
      </Select>
      <Select
        id="category"
        label={t('Category')}
        value={filters.category}
        onChange={(event) => update('category', event.target.value)}
      >
        <option value="">{t('All categories')}</option>
        {uniqueCategories.map((item) => (
          <option key={item.id} value={item.name}>
            {t(item.name)}
          </option>
        ))}
      </Select>
      <Select id="sort" label={t('Sort')} value={filters.sort} onChange={(event) => update('sort', event.target.value)}>
        <option value="date-desc">{t('Newest first')}</option>
        <option value="date-asc">{t('Oldest first')}</option>
        <option value="amount-desc">{t('Amount high to low')}</option>
        <option value="amount-asc">{t('Amount low to high')}</option>
      </Select>
      <CalendarFilter
        id="from"
        label={t('From')}
        value={filters.from}
        calendar={calendar}
        onChange={(value) => update('from', value)}
      />
      <CalendarFilter
        id="to"
        label={t('To')}
        value={filters.to}
        calendar={calendar}
        onChange={(value) => update('to', value)}
      />
    </div>
  )
}
