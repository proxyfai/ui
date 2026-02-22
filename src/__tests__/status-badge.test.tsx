import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { StatusBadge, type StatusConfig } from "../components/status-badge"

const Spinner = ({ className }: { className?: string }) => (
  <svg data-testid="spinner-icon" className={className} />
)
const CheckIcon = ({ className }: { className?: string }) => (
  <svg data-testid="check-icon" className={className} />
)
const XIcon = ({ className }: { className?: string }) => (
  <svg data-testid="x-icon" className={className} />
)

const config: Record<string, StatusConfig> = {
  running: {
    label: "Running",
    icon: Spinner,
    className: "bg-info/10 text-info",
  },
  completed: {
    label: "Completed",
    icon: CheckIcon,
    className: "bg-success/10 text-success",
  },
  failed: {
    label: "Failed",
    icon: XIcon,
    className: "bg-error/10 text-error",
  },
}

describe("StatusBadge", () => {
  it("renders label from config", () => {
    render(<StatusBadge status="running" config={config} />)
    expect(screen.getByText("Running")).toBeInTheDocument()
  })

  it("renders correct icon per status", () => {
    render(<StatusBadge status="completed" config={config} />)
    expect(screen.getByTestId("check-icon")).toBeInTheDocument()
  })

  it("applies correct className per status", () => {
    render(<StatusBadge status="failed" config={config} />)
    const badge = screen.getByText("Failed").closest("span")
    expect(badge).toHaveClass("bg-error/10")
  })

  it("hides icon when showIcon is false", () => {
    render(
      <StatusBadge status="running" config={config} showIcon={false} />
    )
    expect(screen.queryByTestId("spinner-icon")).not.toBeInTheDocument()
    expect(screen.getByText("Running")).toBeInTheDocument()
  })

  it("applies custom className", () => {
    render(
      <StatusBadge status="running" config={config} className="extra" />
    )
    const badge = screen.getByText("Running").closest("span")
    expect(badge).toHaveClass("extra")
  })

  it("applies animate-spin when animateStatus matches", () => {
    render(
      <StatusBadge
        status="running"
        config={config}
        animateStatus="running"
      />
    )
    const icon = screen.getByTestId("spinner-icon")
    expect(icon).toHaveClass("animate-spin")
  })

  it("does not apply animate-spin when animateStatus does not match", () => {
    render(
      <StatusBadge
        status="completed"
        config={config}
        animateStatus="running"
      />
    )
    const icon = screen.getByTestId("check-icon")
    expect(icon).not.toHaveClass("animate-spin")
  })

  it("has data-status attribute", () => {
    render(<StatusBadge status="running" config={config} />)
    const badge = screen.getByText("Running").closest("span")
    expect(badge).toHaveAttribute("data-status", "running")
  })

  it("returns null for unknown status", () => {
    const { container } = render(
      <StatusBadge status={"unknown" as unknown as Parameters<typeof StatusBadge>[0]["status"]} config={config} />
    )
    expect(container.innerHTML).toBe("")
  })
})
