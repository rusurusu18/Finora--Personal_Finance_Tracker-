# Finora frontend

Nepal-focused personal finance UI. This folder is the React + Vite application.

## Stack

- React 19 + Vite
- Tailwind CSS 4
- React Router
- Lucide icons
- Recharts

## Scripts

```bash
npm install
npm run dev
npm run build
npm run lint
```

The dashboard stores transactions, accounts, budgets, savings goals, and loan plans through the backend API. Display language and calendar preferences are saved locally. Bikram Sambat conversion is supported for dates from 1921 through 2040 AD, the range supported by the date-conversion library.

Natural-language expense drafts are sent to Google Gemini by the backend and are not saved until the user reviews and confirms them. Configure `GEMINI_API_KEY` in the backend environment to enable parsing. Loan plans require the `LoanPlan` Prisma migration to be applied to the database.
