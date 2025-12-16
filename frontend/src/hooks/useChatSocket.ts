import { useEffect } from 'react';
import { socket } from '../lib/socket';
import { useChat } from '../features/chat/store/chat';

export function useChatSocket() {
  const { user, room, addMessage, addStatus, setHistory } = useChat();

  useEffect(() => {
    if (!user) return;
    socket.connect();
    socket.emit('login', { name: user, room });

    socket.on('message', addMessage);
    socket.on('status', addStatus);
    socket.on('history', setHistory);

    return () => {
      socket.off('message', addMessage);
      socket.off('status', addStatus);
      socket.off('history', setHistory);
      socket.disconnect();
    };
  }, [user, room, addMessage, addStatus, setHistory]);
}
