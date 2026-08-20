const sources = ['NPR', 'Cash', 'Bank', 'eSewa', 'Khalti', 'Fonepay']

export default function NepalFirstSection() {
  return (
    <section className="bg-white py-16 dark:bg-slate-900">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-2xl font-semibold tracking-tight">Built for the way you manage money in Nepal.</h2>
        <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">
          Balances are shown in NPR by default. Sources match everyday use: cash in hand, a bank account,
          and wallets you already pay with.
        </p>
        <ul className="mt-8 flex flex-wrap gap-3">
          {sources.map((source) => (
            <li
              key={source}
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium dark:border-slate-700"
            >
              {source}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
