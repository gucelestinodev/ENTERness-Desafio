import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, jest, beforeEach } from "@jest/globals"

import Login from "./../../../pages/Login"
import { useChat } from "../store/chat"

jest.mock("../store/chat", () => ({
    useChat: jest.fn(),
}))

describe("Login", () => {
    const setUserRoom = jest.fn()

    beforeEach(() => {
        jest.clearAllMocks()

            ; (useChat as any).mockReturnValue({
                setUserRoom,
            })
    })

    it("permite entrar com nome e sala aleatória", async () => {
        const user = userEvent.setup()

        render(<Login />)

        const nameInput = screen.getByPlaceholderText(/ex:\s*gustavo/i)
        const roomInput = screen.getByPlaceholderText(/geral,\s*suporte/i)
        const button = screen.getByRole("button", { name: /entrar/i })

        await user.type(nameInput, "Gustavo")
        await user.type(roomInput, "minha sala")
        await user.click(button)

        expect(setUserRoom).toHaveBeenCalledWith("Gustavo", "minha sala")
    })
})
