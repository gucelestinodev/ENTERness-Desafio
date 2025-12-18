import { useRef, useState } from "react"
import { socket } from "@/lib/socket"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import EmojiPicker, { EmojiClickData } from "emoji-picker-react"
import { Smile } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Paperclip, Send, X } from "lucide-react"
import { cn } from "@/lib/utils"

export default function MessageInput() {
  const [text, setText] = useState("")
  const [isSending, setIsSending] = useState(false)

  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement | null>(null)

  const pickFile = () => fileRef.current?.click()

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      alert("Selecione uma imagem (PNG, JPG, etc).")
      e.target.value = ""
      return
    }

    const max = 2 * 1024 * 1024
    if (file.size > max) {
      alert("Imagem muito grande. Envie até 2MB.")
      e.target.value = ""
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setImagePreview(String(reader.result))
    }
    reader.readAsDataURL(file)
  }

  const clearImage = () => {
    setImagePreview(null)
    if (fileRef.current) fileRef.current.value = ""
  }

  const canSend = text.trim().length > 0 || !!imagePreview

  const send = async () => {
    if (!canSend) return
    if (!socket.connected) return

    setIsSending(true)
    try {
      socket.emit("message", {
        text: text.trim(),
        imageUrl: imagePreview ?? undefined,
      })

      setText("")
      clearImage()
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="space-y-2">
      {imagePreview ? (
        <div className="relative w-fit max-w-full">
          <img
            src={imagePreview}
            alt="preview"
            className="max-h-48 rounded-lg border"
          />
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="absolute -top-2 -right-2 h-7 w-7 rounded-full"
            onClick={clearImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : null}

      <div className="flex gap-2">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Digite uma mensagem…"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              send()
            }
          }}
          className="flex-1"
        />
        <Popover>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-10 w-10 p-0"
                    disabled={isSending}
                  >
                    <Smile className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
              </TooltipTrigger>
              <TooltipContent>Emojis</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <PopoverContent align="end" className="p-0">
            <EmojiPicker
              onEmojiClick={(emojiData: EmojiClickData) => {
                setText((prev) => prev + emojiData.emoji)
              }}
              searchDisabled={false}
              skinTonesDisabled={false}
              width={320}
              height={360}
            />
          </PopoverContent>
        </Popover>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className={cn("h-10 w-10 p-0")}
                onClick={pickFile}
                disabled={isSending}
              >
                <Paperclip className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Anexar Arquivo</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onFileChange}
        />

        <Button
          type="button"
          className="h-10 w-10 p-0"
          onClick={send}
          disabled={!canSend || isSending}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>

      {!socket.connected ? (
        <div className="text-xs text-muted-foreground italic">
          Offline. Reconectando…
        </div>
      ) : null}
    </div>
  );
}
