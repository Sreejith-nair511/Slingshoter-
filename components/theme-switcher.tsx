'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Sun, Moon, Zap } from 'lucide-react'

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-32 h-10" />
  }

  return (
    <div className="flex items-center gap-1 bg-zinc-800/50 rounded-lg p-1">
      <button
        onClick={() => setTheme('light')}
        className={`px-3 py-2 rounded transition-colors ${
          theme === 'light'
            ? 'bg-white text-zinc-900'
            : 'text-zinc-400 hover:text-white'
        }`}
        title="Light Mode"
      >
        <Sun size={16} />
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`px-3 py-2 rounded transition-colors ${
          theme === 'dark'
            ? 'bg-zinc-700 text-white'
            : 'text-zinc-400 hover:text-white'
        }`}
        title="Dark Mode"
      >
        <Moon size={16} />
      </button>
      <button
        onClick={() => setTheme('amd')}
        className={`px-3 py-2 rounded transition-colors ${
          theme === 'amd'
            ? 'bg-gradient-to-r from-red-900 to-red-800 text-white'
            : 'text-zinc-400 hover:text-white'
        }`}
        title="AMD Theme"
      >
        <Zap size={16} />
      </button>
    </div>
  )
}
