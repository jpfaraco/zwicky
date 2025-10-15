import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark')
    }
    return false
  })

  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDark])

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      setIsDark(true)
    }
  }, [])

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="relative inline-flex h-7 w-12 flex-shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      style={{
        backgroundColor: isDark ? 'hsl(var(--primary))' : 'hsl(var(--muted))'
      }}
      aria-label="Toggle theme"
    >
      <span
        className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-background shadow-lg transition-transform"
        style={{
          transform: isDark ? 'translateX(22px)' : 'translateX(2px)'
        }}
      >
        {isDark ? (
          <Moon className="h-3 w-3" />
        ) : (
          <Sun className="h-3 w-3" />
        )}
      </span>
    </button>
  )
}
