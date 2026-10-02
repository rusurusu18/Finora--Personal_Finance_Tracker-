import Input from '../ui/Input'
import Select from '../ui/Select'
import { TRANSACTION_TYPES } from '../../utils/constants'
import { useLanguage } from '../../contexts/useLanguage'

export default function TransactionFilters({ filters, onChange, categories }) {
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
      <Input
        id="from"
        label={t('From')}
        type="date"
        value={filters.from}
        onChange={(event) => update('from', event.target.value)}
      />
      <Input
        id="to"
        label={t('To')}
        type="date"
        value={filters.to}
        onChange={(event) => update('to', event.target.value)}
      />
    </div>
  )
}
