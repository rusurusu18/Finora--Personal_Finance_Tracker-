export default function About() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">About Finora</h1>
      <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">
        Finora is a Nepal-focused personal finance workspace. The goal is not a generic expense list. It is
        a clear view of where money sits, where it is going, and whether savings goals are realistic.
      </p>
      <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">
        This phase is frontend-only, with mock data and service functions that can later call REST APIs
        backed by Node.js, Express, MySQL, and JWT authentication.
      </p>
    </main>
  )
}
