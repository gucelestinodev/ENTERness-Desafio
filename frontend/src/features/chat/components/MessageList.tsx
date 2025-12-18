import { useEffect, useRef } from "react"
import { useChat } from "../store/chat"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export default function MessageList() {
  const { messages, user } = useChat()
  const endRef = useRef<HTMLDivElement | null>(null)

  const [open, setOpen] = useState(false)
  const [activeImg, setActiveImg] = useState<string | null>(null)

  const openImage = (src: string) => {
    setActiveImg(src)
    setOpen(true)
  }

  const downloadImage = async (src: string) => {
    const res = await fetch(src)
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url

    const ext = blob.type.split("/")[1] || "png"
    a.download = `imagem.${ext}`

    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <ScrollArea className="h-full rounded-md border p-3">
      <div className="space-y-2">
        {messages.map((m, i) => {
          const isSystem = m.kind === "system" || m.user === "__system__"

          if (isSystem) {
            return (
              <div
                key={`sys-${i}`}
                className="text-muted-foreground italic animate-fade-in text-center text-sm py-2"
              >
                {m.text}
              </div>
            )
          }

          const isMe = user && m.user === user
          return (
            <div
              key={i}
              className={cn(
                "flex w-full animate-slide-up",
                isMe ? "justify-end" : "justify-start"
              )}
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
                      {m.user}
                    </div>
                  ) : null}
                  <p className="text-sm leading-relaxed whitespace-pre-wrap wrap-break-word">
                    {m.text}
                  </p>
                  {m.imageUrl ? (
                    <button
                      type="button"
                      onClick={() => openImage(m.imageUrl!)}
                      className="mt-2 block"
                      title="Abrir imagem"
                    >
                      <img
                        src={m.imageUrl}
                        alt="upload"
                        className="max-h-60 rounded-lg border cursor-pointer hover:opacity-90 transition"
                      />
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          )
        })}
        <div ref={endRef} />
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden">
          {activeImg ? (
            <div className="relative bg-black">
              <img
                src={activeImg}
                alt="Imagem"
                className="w-full max-h-[80vh] object-contain"
              />

              <div className="absolute top-3 right-3 flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => downloadImage(activeImg)}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Baixar
                </Button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </ScrollArea>
  )
}
