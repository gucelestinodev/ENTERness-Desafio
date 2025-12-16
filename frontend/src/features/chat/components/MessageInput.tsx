import { useState } from "react";
import { socket } from "@/lib/socket";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

export default function MessageInput() {
  const [text, setText] = useState("");

  const send = () => {
    if (!text.trim()) return;
    socket.emit("message", { text });
    setText("");
  };

  return (
    <div className="mt-3 flex gap-2">
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Escreva uma mensagem..."
        onKeyDown={(e) => {
          if (e.key === "Enter") send();
        }}
      />
      <Button onClick={send} title="Enviar">
        <Send className="size-4" />
      </Button>
    </div>
  );
}
