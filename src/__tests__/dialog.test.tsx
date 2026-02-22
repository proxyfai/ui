import { describe, it, expect } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "../components/dialog"

describe("Dialog", () => {
  it("opens when trigger is clicked", async () => {
    const user = userEvent.setup()
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Title</DialogTitle>
            <DialogDescription>Description</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )

    await user.click(screen.getByText("Open"))
    await waitFor(() => {
      expect(screen.getByText("Title")).toBeInTheDocument()
    })
  })

  it("renders title and description", async () => {
    const user = userEvent.setup()
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>My Title</DialogTitle>
            <DialogDescription>My Description</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )

    await user.click(screen.getByText("Open"))
    await waitFor(() => {
      expect(screen.getByText("My Title")).toBeInTheDocument()
      expect(screen.getByText("My Description")).toBeInTheDocument()
    })
  })

  it("shows close button by default", async () => {
    const user = userEvent.setup()
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogTitle>Title</DialogTitle>
        </DialogContent>
      </Dialog>
    )

    await user.click(screen.getByText("Open"))
    await waitFor(() => {
      expect(screen.getByText("Close")).toBeInTheDocument() // sr-only text
    })
  })

  it("hides close button when showCloseButton is false", async () => {
    const user = userEvent.setup()
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent showCloseButton={false}>
          <DialogTitle>Title</DialogTitle>
        </DialogContent>
      </Dialog>
    )

    await user.click(screen.getByText("Open"))
    await waitFor(() => {
      expect(screen.getByText("Title")).toBeInTheDocument()
    })
    expect(screen.queryByText("Close")).not.toBeInTheDocument()
  })

  it("renders footer", async () => {
    const user = userEvent.setup()
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogTitle>Title</DialogTitle>
          <DialogFooter>
            <button>Save</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )

    await user.click(screen.getByText("Open"))
    await waitFor(() => {
      expect(screen.getByText("Save")).toBeInTheDocument()
    })
  })

  it("closes on close button click", async () => {
    const user = userEvent.setup()
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogTitle>Title</DialogTitle>
          <DialogClose data-testid="close-btn">Close Dialog</DialogClose>
        </DialogContent>
      </Dialog>
    )

    await user.click(screen.getByText("Open"))
    await waitFor(() => {
      expect(screen.getByText("Title")).toBeInTheDocument()
    })
    await user.click(screen.getByTestId("close-btn"))
    await waitFor(() => {
      expect(screen.queryByText("Title")).not.toBeInTheDocument()
    })
  })
})
