import { useChat } from "@/features/chat/store/chat"
import { useChatSocket } from "@/features/chat/hooks/useChatSocket"
import ChatHeader from "@/features/chat/components/ChatHeader"
import RoomsSidebar from "@/features/chat/components/RoomsSidebar"
import StatusStrip from "@/features/chat/components/StatusStrip"
import MessageList from "@/features/chat/components/MessageList"
import MessageInput from "@/features/chat/components/MessageInput"
import { Card, CardContent } from "@/components/ui/card"

export default function ChatPage() {
  const { user } = useChat()
  useChatSocket()
  if (!user) return null

  return (
    <div className="h-dvh w-screen overflow-hidden bg-gradient-to-b from-background to-muted/30">
      <ChatHeader />
      <div className="h-[calc(100dvh-56px)] grid grid-cols-1 lg:grid-cols-[280px_1fr] overflow-hidden">
        <aside className="hidden lg:block h-full border-r">
          <RoomsSidebar className="h-full" />
        </aside>
        <main className="h-full overflow-hidden px-4 py-3">
          <div className="h-full flex flex-col gap-3">
            <StatusStrip />
            <Card className="flex-1 overflow-hidden shadow-sm">
              <CardContent className="h-full flex flex-col gap-3 p-4">
                <div className="flex-1 min-h-0">
                  <MessageList />
                </div>
                <MessageInput />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
