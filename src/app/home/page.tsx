'use client'

import { useEffect, useState } from 'react'
import { CalendarDemo } from "@/components/Calendar"
import { Moon, Sun } from 'lucide-react'
import { SliderDemo } from '@/components/Slider'
import PrivateRoute from '@/components/auth/private-route'

export default function HomePage() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Kiểm tra trạng thái dark mode trong localStorage hoặc theo prefers-color-scheme
    const saved = localStorage.getItem('theme')
    if (saved === 'dark') {
      setIsDark(true)
      document.documentElement.classList.add('dark')
    } else if (saved === 'light') {
      setIsDark(false)
      document.documentElement.classList.remove('dark')
    } else {
      // Mặc định theo prefers-color-scheme
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setIsDark(prefersDark)
      if (prefersDark) document.documentElement.classList.add('dark')
      else document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
      setIsDark(false)
    } else {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
      setIsDark(true)
    }
  }

  return (
     <PrivateRoute>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        <header className="flex justify-between items-center p-4">
          <h1 className=" dark:text-white text-2xl font-bold  text-amber-400">Hello World</h1>
          <button
            onClick={toggleDarkMode}
            aria-label="Toggle Dark Mode"
            className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            {isDark ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </header>

        <main className="p-4">
          <CalendarDemo />
        </main>

        <main className="p-4">
          <SliderDemo />
        </main>
      </div>
     </PrivateRoute>
  )
}