import { useEffect, useMemo, useRef, useState } from 'react'
import { Bot, ChevronDown, MessageCircle, Send, Sparkles, X } from 'lucide-react'
import { useFinance } from '../../hooks/useFinance'
import { useAuth } from '../../contexts/AuthContext'

const STORAGE_KEY = 'finora_chat_messages'

const starterMessages = [
  {
    id: 'welcome',
    role: 'assistant',
    content: 'Hi! I’m Finora Guide. Ask me about your balance, spending, budgets, or savings goals.',
  },
]

function readMessages() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
    return Array.isArray(saved) && saved.length ? saved : starterMessages
  } catch {
    return starterMessages
  }
}

function formatMoney(value, currency) {
  return `${currency} ${Number(value || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
}

function createReply(question, { totals, monthStats, budgetRemaining, savingsGoals, settings }) {
  const prompt = question.toLowerCase()
  const currency = settings.currency

  if (prompt.includes('balance') || prompt.includes('money') || prompt.includes('worth')) {
    return `Your current tracked balance is ${formatMoney(totals.total, currency)}: ${formatMoney(totals.bank, currency)} in bank accounts, ${formatMoney(totals.wallets, currency)} in wallets, and ${formatMoney(totals.cash, currency)} in cash.`
  }

  if (prompt.includes('spend') || prompt.includes('expense') || prompt.includes('spent')) {
    return `This month you have recorded ${formatMoney(monthStats.expenses, currency)} in expenses and ${formatMoney(monthStats.income, currency)} in income. Your tracked savings are ${formatMoney(monthStats.savings, currency)}.`
  }

  if (prompt.includes('budget')) {
    return `You have ${formatMoney(budgetRemaining, currency)} remaining across your budgets. Check the Budgets page for the category-by-category breakdown.`
  }

  if (prompt.includes('save') || prompt.includes('goal')) {
    if (!savingsGoals.length) {
      return 'You do not have any savings goals yet. Add one from the Savings page to start tracking progress.'
    }
    const goal = savingsGoals[0]
    return `You have ${savingsGoals.length} savings goal${savingsGoals.length === 1 ? '' : 's'}. Your next focus could be ${goal.name}, currently at ${formatMoney(goal.currentAmount, currency)} of ${formatMoney(goal.targetAmount, currency)}.`
  }

  if (prompt.includes('hello') || prompt.includes('hi') || prompt.includes('help')) {
    return 'I can help you read your Finora data. Try “What is my balance?”, “How much did I spend?”, “How is my budget?”, or “Show my savings goals.”'
  }

  return 'I can answer questions about your balance, monthly spending, budgets, and savings goals. Try asking about one of those.'
}

export default function Chatbot() {
  const { user } = useAuth()
  const { totals, monthStats, budgetRemaining, savingsGoals, settings, loading } = useFinance()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState(readMessages)
  const messagesEndRef = useRef(null)

  const context = useMemo(
    () => ({ totals, monthStats, budgetRemaining, savingsGoals, settings }),
    [totals, monthStats, budgetRemaining, savingsGoals, settings],
  )

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-30)))
    if (open) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  function submit(event) {
    event.preventDefault()
    const question = input.trim()
    if (!question || loading) return

    const userMessage = { id: `${Date.now()}-user`, role: 'user', content: question }
    const assistantMessage = {
      id: `${Date.now()}-assistant`,
      role: 'assistant',
      content: createReply(question, context),
    }
    setMessages((current) => [...current, userMessage, assistantMessage])
    setInput('')
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {open ? (
        <section className="flex h-[min(32rem,calc(100vh-7rem))] w-[min(22rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/15 dark:border-slate-700 dark:bg-slate-900" aria-label="Finora Guide chat">
          <header className="flex items-center justify-between bg-slate-950 px-4 py-3 text-white dark:bg-indigo-950">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500" aria-hidden="true">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">Finora Guide</p>
                <p className="text-xs text-slate-300">Your personal finance assistant</p>
              </div>
            </div>
            <button type="button" onClick={() => setOpen(false)} className="rounded-lg p-1.5 text-slate-300 hover:bg-white/10 hover:text-white" aria-label="Close chat">
              <X className="h-5 w-5" />
            </button>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4 dark:bg-slate-950">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <p className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-5 ${message.role === 'user' ? 'rounded-br-md bg-indigo-600 text-white' : 'rounded-bl-md border border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'}`}>
                  {message.content}
                </p>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={submit} className="border-t border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
            <label className="sr-only" htmlFor="finora-chat-input">Ask Finora Guide</label>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-1.5 focus-within:border-indigo-400 dark:border-slate-700 dark:bg-slate-950">
              <input id="finora-chat-input" value={input} onChange={(event) => setInput(event.target.value)} placeholder={user ? `Ask about your finances, ${user.name?.split(' ')[0] || 'there'}` : 'Ask about your finances'} className="min-w-0 flex-1 bg-transparent px-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white" />
              <button type="submit" disabled={!input.trim() || loading} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40" aria-label="Send message">
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </section>
      ) : null}

      <button type="button" onClick={() => setOpen((value) => !value)} className="group flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-700" aria-expanded={open} aria-label={open ? 'Close Finora Guide' : 'Open Finora Guide'}>
        {open ? <ChevronDown className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
        <span className="hidden sm:inline">{open ? 'Close' : 'Ask Finora Guide'}</span>
        {!open ? <Sparkles className="h-4 w-4 text-indigo-200" aria-hidden="true" /> : null}
      </button>
    </div>
  )
}
