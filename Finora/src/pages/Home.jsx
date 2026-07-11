import React from 'react'
import Button from '../components/Button'
import Feature from './Feature'

const Home = () => {
  return (
    <>
      <main id="home" className="pt-[88px] hero-gradient">
        <div className="max-w-7xl mx-auto px-6 pb-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold">
              🚀 Smart Personal Finance Platform
            </span>

            <h1 className="mt-8 text-5xl lg:text-7xl font-black leading-tight">
              Take Control
              <span className="text-blue-600"> of Your Money</span>
            </h1>

            <p className="mt-8 text-xl text-slate-600 dark:text-slate-300 leading-9">
              Track your income, manage expenses, monitor savings, create budgets,
              and gain valuable financial insights with one modern dashboard.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Button>Start Tracking</Button>
              <Button variant="secondary">Live Demo</Button>
            </div>

            <div className="mt-14 flex flex-wrap gap-10">
              <div>
                <h2 className="text-4xl font-bold">25K+</h2>
                <p className="text-slate-500 dark:text-slate-400">Users</p>
              </div>
              <div>
                <h2 className="text-4xl font-bold">$12M+</h2>
                <p className="text-slate-500 dark:text-slate-400">Tracked</p>
              </div>
              <div>
                <h2 className="text-4xl font-bold">98%</h2>
                <p className="text-slate-500 dark:text-slate-400">Satisfaction</p>
              </div>
            </div>
          </div>

          <div className="floating">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-slate-500 dark:text-slate-400">Total Balance</p>
                  <h2 className="text-4xl font-bold mt-2">$24,580</h2>
                </div>
                <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold">
                  +18%
                </div>
              </div>

              <div className="mt-10 space-y-5">
                <div className="bg-slate-100 dark:bg-slate-800 p-5 rounded-2xl flex justify-between">
                  <span>Income</span>
                  <strong className="text-green-600">+$8,250</strong>
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 p-5 rounded-2xl flex justify-between">
                  <span>Expenses</span>
                  <strong className="text-red-500">-$2,180</strong>
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 p-5 rounded-2xl flex justify-between">
                  <span>Savings</span>
                  <strong className="text-blue-600">$18,200</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
      <Feature />
    </>
  )
}

export default Home