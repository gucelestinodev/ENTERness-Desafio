import { useEffect, useRef } from "react";
import { useChat } from "../store/chat";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function MessageList() {
  const { messages, status } = useChat();
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  return (
    <ScrollArea className="h-80 rounded-md border p-3">
      <div className="space-y-2">
        {status.map((s, i) => (
          <div key={`s-${i}`} className="text-muted-foreground italic animate-fade-in">
            {s}
          </div>
        ))}

        {messages.map((m, i) => (
          <div key={i} className="animate-slide-up">
            <span className="font-semibold">{m.user}:</span>{" "}
            <span>{m.text}</span>
            {m.imageUrl ? (
              <img
                src={m.imageUrl}
                alt="upload"
                className="mt-2 max-h-60 rounded border"
              />
            ) : null}
          </div>
        ))}
        <div ref={endRef} />
      </div>
    </ScrollArea>
  );
}
