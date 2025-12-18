import { render, screen } from "@testing-library/react"
import MessageList from "./../components/MessageList"

jest.mock("@/components/ui/scroll-area", () => {
    const React = require("react")
    return { ScrollArea: ({ children }: any) => <div>{children}</div> }
})

const useChatMock = jest.fn()

jest.mock("../store/chat", () => ({
    useChat: () => useChatMock(),
}))

describe("MessageList", () => {
    it("renderiza mensagem system centralizada", () => {
        useChatMock.mockReturnValue({
            user: "Gustavo",
            messages: [{ kind: "system", user: "__system__", text: "Mara entrou na sala" }],
        })

        render(<MessageList />)

        expect(screen.getByText("Mara entrou na sala")).toBeInTheDocument()
    })

    it("não mostra nome do usuário nas mensagens enviadas por mim", () => {
        useChatMock.mockReturnValue({
            user: "Gustavo",
            messages: [{ user: "Gustavo", text: "oi" }],
        })

        render(<MessageList />)

        expect(screen.getByText("oi")).toBeInTheDocument()
        expect(screen.queryByText("Gustavo")).not.toBeInTheDocument()
    })

    it("mostra nome do remetente nas mensagens recebidas", () => {
        useChatMock.mockReturnValue({
            user: "Gustavo",
            messages: [{ user: "Lucas", text: "fala" }],
        })

        render(<MessageList />)

        expect(screen.getByText("Lucas")).toBeInTheDocument()
        expect(screen.getByText("fala")).toBeInTheDocument()
    })

    it("renderiza imagem quando imageUrl existe", () => {
        useChatMock.mockReturnValue({
            user: "Gustavo",
            messages: [{ user: "Lucas", text: "print", imageUrl: "data:image/png;base64,AAA" }],
        })

        render(<MessageList />)

        const img = screen.getByRole("img")
        expect(img).toBeInTheDocument()
        expect(img).toHaveAttribute("src", "data:image/png;base64,AAA")
    })
})
