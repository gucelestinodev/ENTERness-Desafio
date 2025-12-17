import { create } from "zustand"
import type { ChatMessage, ChatState } from "@/features/chat/types/IChat"

const FIXED_ROOMS = ["geral", "suporte", "desenvolvimento"] as const
type FixedRoom = (typeof FIXED_ROOMS)[number]

export type RoomInfo = { name: string; usersCount: number }

const normalizeRoom = (room?: string) => (room ?? "").trim().toLowerCase()

type ExtendedState = ChatState & {
  fixedRooms: string[]
  roomsOnline: RoomInfo[]
  setRoomsOnline: (list: RoomInfo[]) => void

  rooms: string[]
  ensureRoom: (room?: string) => string
  upsertRoom: (room: string) => void

  switchRoom: (room: string) => void
}

export const useChat = create<ExtendedState>((set, get) => ({
  user: undefined,
  room: "geral",
  messages: [],
  status: [],

  fixedRooms: [...FIXED_ROOMS],

  roomsOnline: [],
  setRoomsOnline: (list) => {
    set({ roomsOnline: list })
  },

  rooms: [],

  ensureRoom: (r?: string) => {
    const room = normalizeRoom(r)
    return room || "geral"
  },

  upsertRoom: (r: string) => {
    const room = normalizeRoom(r)
    if (!room) return
    if (FIXED_ROOMS.includes(room as FixedRoom)) return
    set((s) => ({ rooms: s.rooms.includes(room) ? s.rooms : [...s.rooms, room] }))
  },

  setUserRoom: (user, inputRoom) => {
    const room = get().ensureRoom(inputRoom)
    if (!FIXED_ROOMS.includes(room as FixedRoom)) get().upsertRoom(room)

    localStorage.setItem("name", user)
    localStorage.setItem("room", room)

    set(() => ({ user, room }))
  },

  addMessage: (m: ChatMessage) => set((s) => ({ messages: [...s.messages, m] })),
  addStatus: (s: string) => set((st) => ({ status: [...st.status, s] })),
  setHistory: (list: ChatMessage[]) => set(() => ({ messages: list })),

  switchRoom: (newRoom) => {
    const { user } = get()
    if (!user) return

    const room = get().ensureRoom(newRoom)
    if (!FIXED_ROOMS.includes(room as FixedRoom)) get().upsertRoom(room)

    localStorage.setItem("room", room)
    
    set({ room, messages: [], status: [] })
  },
}))
