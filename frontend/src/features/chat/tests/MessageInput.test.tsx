import React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import MessageInput from "./../components/MessageInput"

const emitMock = jest.fn()

jest.mock("@/lib/socket", () => ({
    socket: {
        connected: true,
        emit: (...args: any[]) => emitMock(...args),
    },
}))

describe("MessageInput", () => {
    beforeEach(() => {
        emitMock.mockClear()
    })

    it("envia mensagem ao clicar no botão enviar", async () => {
        const user = userEvent.setup()
        render(<MessageInput />)

        const input = screen.getByPlaceholderText("Digite uma mensagem…")
        await user.type(input, "Olá!")
        await user.click(screen.getByLabelText("Enviar mensagem"))

        expect(emitMock).toHaveBeenCalledWith("message", expect.objectContaining({ text: "Olá!" }))
    })
})
