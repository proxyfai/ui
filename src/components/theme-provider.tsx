"use client"

import * as React from "react"

export type Theme = "light" | "dark" | "system"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: "light" | "dark"
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined)

const DEFAULT_STORAGE_KEY = "ui-theme"

interface ThemeProviderProps {
  children: React.ReactNode
  /** localStorage key to persist theme preference */
  storageKey?: string
  /** Default theme when no preference is stored */
  defaultTheme?: Theme
}

function ThemeProvider({
  children,
  storageKey = DEFAULT_STORAGE_KEY,
  defaultTheme = "dark",
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(defaultTheme)
  const [resolvedTheme, setResolvedTheme] = React.useState<"light" | "dark">(
    defaultTheme === "system" ? "dark" : defaultTheme
  )

  React.useEffect(() => {
    const stored = localStorage.getItem(storageKey) as Theme | null
    if (stored) {
      setThemeState(stored)
    }
  }, [storageKey])

  React.useEffect(() => {
    const root = document.documentElement

    const resolved: "light" | "dark" = theme === "system"
      ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      : theme

    setResolvedTheme(resolved)
    root.classList.remove("light", "dark")
    root.classList.add(resolved)
    root.style.colorScheme = resolved
  }, [theme])

  const setTheme = React.useCallback(
    (newTheme: Theme) => {
      setThemeState(newTheme)
      localStorage.setItem(storageKey, newTheme)
    },
    [storageKey]
  )

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

function useTheme() {
  const context = React.useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider")
  }
  return context
}

function useThemeSafe() {
  const context = React.useContext(ThemeContext)
  return (
    context ?? {
      theme: "dark" as Theme,
      setTheme: () => {},
      resolvedTheme: "dark" as const,
    }
  )
}

export { ThemeProvider, useTheme, useThemeSafe, ThemeContext }
