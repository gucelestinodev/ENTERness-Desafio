import { useChat } from "@/features/chat/store/chat";
import { useChatSocket } from "@/features/chat/hooks/useChatSocket";
import StatusStrip from "@/features/chat/components/StatusStrip";
import MessageList from "@/features/chat/components/MessageList";
import MessageInput from "@/features/chat/components/MessageInput";
import { Card, CardContent } from "@/components/ui/card";

export default function ChatPage() {
  const { user } = useChat();
  useChatSocket();

  if (!user) return null;

  return (
    <div className="min-h-dvh p-4">
      <div className="container space-y-3">
        <StatusStrip />
        <Card>
          <CardContent className="pt-6">
            <MessageList />
            <MessageInput />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
