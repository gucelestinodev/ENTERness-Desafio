import { useChat } from "../store/chat";
import { Badge } from "@/components/ui/badge";

export default function StatusStrip() {
  const { user, room } = useChat();
  if (!user) return null;
  return (
    <div className="flex items-center gap-2">
      <h3 className="text-lg font-semibold">Olá, {user}</h3>
      {room ? <Badge variant="secondary">Sala: {room}</Badge> : null}
    </div>
  );
}
