import { useEffect, useRef } from "react"
import { socket } from "@/lib/socket"
import { useChat } from "@/features/chat/store/chat"
import type { RoomInfo } from "@/features/chat/store/chat"

export function useChatSocket() {
  const { user, room, addMessage, addStatus, setHistory, setRoomsOnline } = useChat()
  const lastRoomRef = useRef<string>("")

  useEffect(() => {
    if (!user) return

    const onConnect = () => {
      socket.emit("login", { name: user, room })
      lastRoomRef.current = room ?? ""
    }

    const onRoomsList = (list: RoomInfo[]) => {
      setRoomsOnline(list)
    }

    socket.on("connect", onConnect)
    socket.on("message", addMessage)
    socket.on("status", addStatus)
    socket.on("history", setHistory)
    socket.on("rooms:list", onRoomsList)

    socket.connect()

    return () => {
      socket.off("connect", onConnect)
      socket.off("message", addMessage)
      socket.off("status", addStatus)
      socket.off("history", setHistory)
      socket.off("rooms:list", onRoomsList)
      socket.disconnect()
    }
  }, [user])

  useEffect(() => {
    if (!user) return
    if (!room) return

    if (!socket.connected) return

    if (lastRoomRef.current && lastRoomRef.current !== room) {
      socket.emit("joinRoom", { room })
    }
    lastRoomRef.current = room
  }, [room, user])
}
