import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ThemeProvider, useTheme, useThemeSafe } from "../components/theme-provider"

function ThemeConsumer() {
  const { theme, resolvedTheme, setTheme } = useTheme()
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="resolved">{resolvedTheme}</span>
      <button onClick={() => setTheme("light")}>Light</button>
      <button onClick={() => setTheme("dark")}>Dark</button>
      <button onClick={() => setTheme("system")}>System</button>
    </div>
  )
}

function SafeConsumer() {
  const { resolvedTheme } = useThemeSafe()
  return <span data-testid="safe-theme">{resolvedTheme}</span>
}

describe("ThemeProvider", () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove("light", "dark")
    document.documentElement.style.colorScheme = ""
  })

  it("defaults to dark theme", () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    )
    expect(screen.getByTestId("theme")).toHaveTextContent("dark")
    expect(screen.getByTestId("resolved")).toHaveTextContent("dark")
  })

  it("respects custom defaultTheme", () => {
    render(
      <ThemeProvider defaultTheme="light">
        <ThemeConsumer />
      </ThemeProvider>
    )
    expect(screen.getByTestId("theme")).toHaveTextContent("light")
  })

  it("setTheme updates the class on html", async () => {
    const user = userEvent.setup()
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    )

    await user.click(screen.getByText("Light"))
    expect(screen.getByTestId("resolved")).toHaveTextContent("light")
    expect(document.documentElement.classList.contains("light")).toBe(true)
  })

  it("persists to localStorage", async () => {
    const user = userEvent.setup()
    render(
      <ThemeProvider storageKey="test-theme">
        <ThemeConsumer />
      </ThemeProvider>
    )

    await user.click(screen.getByText("Light"))
    expect(localStorage.getItem("test-theme")).toBe("light")
  })

  it("reads from localStorage on mount", () => {
    localStorage.setItem("ui-theme", "light")
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    )
    // After effect runs it should pick up the stored value
    expect(screen.getByTestId("theme")).toHaveTextContent("light")
  })
})

describe("useTheme", () => {
  it("throws when used outside provider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {})
    expect(() => render(<ThemeConsumer />)).toThrow(
      "useTheme must be used within ThemeProvider"
    )
    spy.mockRestore()
  })
})

describe("useThemeSafe", () => {
  it("returns fallback when used outside provider", () => {
    render(<SafeConsumer />)
    expect(screen.getByTestId("safe-theme")).toHaveTextContent("dark")
  })
})
