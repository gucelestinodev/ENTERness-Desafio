import ChatPage from "@/pages/Chat";
import LoginPage from "@/pages/Login";
import { useChat } from "@/features/chat/store/chat";

export default function App() {
  const { user } = useChat();
  return user ? <ChatPage /> : <LoginPage />;
}
