import { useEffect } from "react";
import { socket } from "@/lib/socket";
import { useChat } from "../store/chat";

export function useChatSocket() {
  const { user, room, addMessage, addStatus, setHistory } = useChat();

  useEffect(() => {
    if (!user) return;

    socket.connect();
    socket.emit("login", { name: user, room });

    const handleMessage = (m: any) => addMessage(m);
    const handleStatus  = (s: string) => addStatus(s);
    const handleHistory = (h: any[]) => setHistory(h);

    socket.on("message", handleMessage);
    socket.on("status", handleStatus);
    socket.on("history", handleHistory);

    return () => {
      socket.off("message", handleMessage);
      socket.off("status", handleStatus);
      socket.off("history", handleHistory);
      socket.disconnect();
    };
  }, [user, room, addMessage, addStatus, setHistory]);
}
