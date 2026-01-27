// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest"
import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import ConfirmDeleteDialog from "@renderer/components/common/ConfirmDeleteDialog"
import { Button } from "@renderer/components/ui/button"

describe("ConfirmDeleteDialog", () => {
  it("abre al hacer clic en el trigger y se cierra al hacer clic en Cancelar", async () => {
    const user = userEvent.setup()
    render(
      <ConfirmDeleteDialog
        onConfirm={() => {}}
        title="Eliminar"
        trigger={<Button>Eliminar ítem</Button>}
      >
        <p>¿Continuar?</p>
      </ConfirmDeleteDialog>
    )
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: /Eliminar ítem/i }))
    const dialog = screen.getByRole("alertdialog")
    expect(dialog).toBeInTheDocument()
    const cancel = within(dialog).getByRole("button", { name: /Cancelar/i })
    await user.click(cancel)
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument()
  })

  it("llama onConfirm al hacer clic en el botón de confirmar", async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()
    render(
      <ConfirmDeleteDialog
        onConfirm={onConfirm}
        title="Eliminar"
        confirmText="Eliminar"
        trigger={<Button>Abrir</Button>}
      >
        <p>¿Continuar?</p>
      </ConfirmDeleteDialog>
    )
    await user.click(screen.getByRole("button", { name: /Abrir/i }))
    const dialog = screen.getByRole("alertdialog")
    await user.click(within(dialog).getByRole("button", { name: /Eliminar/i }))
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it("muestra el título y children según la entidad (aspirante)", async () => {
    const user = userEvent.setup()
    render(
      <ConfirmDeleteDialog
        onConfirm={() => {}}
        title="Eliminar aspirante"
        trigger={<Button>Eliminar</Button>}
      >
        <p>¿Deseas eliminar al aspirante?</p>
      </ConfirmDeleteDialog>
    )
    await user.click(screen.getByRole("button", { name: /Eliminar/i }))
    expect(screen.getByRole("alertdialog")).toHaveTextContent("Eliminar aspirante")
    expect(screen.getByRole("alertdialog")).toHaveTextContent("¿Deseas eliminar al aspirante?")
  })

  it("muestra el título según la entidad (ubicación)", async () => {
    const user = userEvent.setup()
    render(
      <ConfirmDeleteDialog
        onConfirm={() => {}}
        title="Eliminar ubicación"
        trigger={<Button>Eliminar</Button>}
      >
        <p>¿Eliminar esta ubicación?</p>
      </ConfirmDeleteDialog>
    )
    await user.click(screen.getByRole("button", { name: /Eliminar/i }))
    expect(screen.getByRole("alertdialog")).toHaveTextContent("Eliminar ubicación")
    expect(screen.getByRole("alertdialog")).toHaveTextContent("¿Eliminar esta ubicación?")
  })
})
