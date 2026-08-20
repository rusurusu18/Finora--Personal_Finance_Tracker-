import Input from '../ui/Input'
import Select from '../ui/Select'
import { CATEGORIES, PAYMENT_SOURCES, TRANSACTION_TYPES } from '../utils/constants'

export default function TransactionFilters({ filters, onChange }) {
  function update(key, value) {
    onChange({ ...filters, [key]: value })
  }

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
      <Input
        id="search"
        label="Search"
        placeholder="Salary, rent, eSewa..."
        value={filters.search}
        onChange={(event) => update('search', event.target.value)}
      />
      <Select id="type" label="Type" value={filters.type} onChange={(event) => update('type', event.target.value)}>
        <option value="">All types</option>
        {TRANSACTION_TYPES.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </Select>
      <Select
        id="category"
        label="Category"
        value={filters.category}
        onChange={(event) => update('category', event.target.value)}
      >
        <option value="">All categories</option>
        {CATEGORIES.map((item) => (
          <option key={item.id} value={item.name}>
            {item.name}
          </option>
        ))}
      </Select>
      <Select
        id="source"
        label="Payment source"
        value={filters.paymentSource}
        onChange={(event) => update('paymentSource', event.target.value)}
      >
        <option value="">All sources</option>
        {PAYMENT_SOURCES.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </Select>
      <Select id="sort" label="Sort" value={filters.sort} onChange={(event) => update('sort', event.target.value)}>
        <option value="date-desc">Newest first</option>
        <option value="date-asc">Oldest first</option>
        <option value="amount-desc">Amount high to low</option>
        <option value="amount-asc">Amount low to high</option>
      </Select>
      <Input
        id="from"
        label="From"
        type="date"
        value={filters.from}
        onChange={(event) => update('from', event.target.value)}
      />
      <Input
        id="to"
        label="To"
        type="date"
        value={filters.to}
        onChange={(event) => update('to', event.target.value)}
      />
    </div>
  )
}
