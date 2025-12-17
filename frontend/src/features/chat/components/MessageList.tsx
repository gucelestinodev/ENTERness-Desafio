import { useEffect, useRef } from "react"
import { useChat } from "../store/chat"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

export default function MessageList() {
  const { messages, status, user } = useChat()
  const endRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, status])

  return (
    <ScrollArea className="h-full rounded-md border p-3">
      <div className="space-y-2">
        {status.map((s, i) => (
          <div
            key={`s-${i}`}
            className="text-muted-foreground italic animate-fade-in text-center text-sm"
          >
            {s}
          </div>
        ))}
        {messages.map((m, i) => {
          const isMe = user && m.user === user
          return (
            <div
              key={i}
              className={cn("flex w-full animate-slide-up", isMe ? "justify-end" : "justify-start")}
            >
              <div className="max-w-[75%]">
                <div
                  className={cn(
                    "rounded-2xl px-4 py-3 shadow-sm border",
                    isMe
                      ? "bg-black text-white border-black"
                      : "bg-white text-black border-neutral-200"
                  )}
                >
                  {!isMe ? (
                    <div className="text-xs font-semibold mb-1 text-neutral-500">
                      {m.user}:
                    </div>
                  ) : null}
                  <p className="text-sm leading-relaxed whitespace-pre-wrap wrap-break-word">
                    {m.text}
                  </p>
                  {m.imageUrl ? (
                    <img
                      src={m.imageUrl}
                      alt="upload"
                      className="mt-2 max-h-60 rounded-lg border"
                    />
                  ) : null}
                </div>
              </div>
            </div>
          )
        })}
        <div ref={endRef} />
      </div>
    </ScrollArea>
  )
}
