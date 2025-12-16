import { create } from 'zustand';
import { ChatState } from '../types/IChat';

export const useChat = create<ChatState>((set) => ({
  messages: [],
  status: [],
  setUserRoom: (user, room) => set(() => ({ user, room })),
  addMessage: (m) => set((s) => ({ messages: [...s.messages, m] })),
  addStatus: (sMsg) => set((s) => ({ status: [...s.status, sMsg] })),
  setHistory: (list) => set(() => ({ messages: list })),
}));
