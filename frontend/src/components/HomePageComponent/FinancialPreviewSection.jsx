import MoneySourceCard from '../finance/MoneySourceCard'

export default function FinancialPreviewSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MoneySourceCard label="Total money" amount={86450} currency="NPR" />
        <MoneySourceCard label="Bank" amount={55000} currency="NPR" />
        <MoneySourceCard label="Wallets" amount={19450} currency="NPR" />
        <MoneySourceCard label="Cash" amount={12000} currency="NPR" />
      </div>
    </section>
  )
}
