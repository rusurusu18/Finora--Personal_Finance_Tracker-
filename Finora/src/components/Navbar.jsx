import React, { useState } from 'react'

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)

  const handleThemeToggle = () => {
    document.documentElement.classList.toggle('dark')
    setIsDark((value) => !value)
  }

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <nav className="glass border-b border-white/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <a href="#" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold">
                F
              </div>
              <span className="text-2xl font-bold">Finora</span>
            </a>

            <div className="hidden lg:flex items-center gap-8 font-medium">
              <a href="#" className="hover:text-blue-600 transition">Home</a>
              <a href="#" className="hover:text-blue-600 transition">Features</a>
              <a href="#" className="hover:text-blue-600 transition">Pricing</a>
              <a href="#" className="hover:text-blue-600 transition">Testimonials</a>
              <a href="#" className="hover:text-blue-600 transition">Contact</a>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleThemeToggle}
                className="w-11 h-11 rounded-xl bg-white shadow hover:scale-105 dark:bg-slate-800 flex items-center justify-center transition"
              >
                <span className="text-lg">{isDark ? '☀️' : '🌙'}</span>
              </button>

              <a
                href="#"
                className="hidden md:flex px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
              >
                Get Started
              </a>

              <button
                type="button"
                onClick={() => setIsOpen((value) => !value)}
                className="lg:hidden w-11 h-11 rounded-xl bg-white dark:bg-slate-800 shadow flex items-center justify-center transition"
              >
                <span className="text-2xl">≡</span>
              </button>
            </div>
          </div>
        </div>

        <div className={`${isOpen ? 'flex' : 'hidden'} lg:hidden border-t bg-white dark:bg-slate-900`}>
          <div className="flex flex-col p-6 gap-5">
            <a href="#" className="font-medium hover:text-blue-600 transition">
              Home
            </a>
            <a href="#" className="font-medium hover:text-blue-600 transition">
              Features
            </a>
            <a href="#" className="font-medium hover:text-blue-600 transition">
              Pricing
            </a>
            <a href="#" className="font-medium hover:text-blue-600 transition">
              Testimonials
            </a>
            <a href="#" className="font-medium hover:text-blue-600 transition">
              Contact
            </a>
            <button className="mt-2 bg-blue-600 text-white rounded-xl py-3 font-semibold">
              Get Started
            </button>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Navbar


    
                   