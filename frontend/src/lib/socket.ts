import { io } from "socket.io-client"
import { TRACE_ID } from "./trace"

export const socket = io("http://localhost:3000", {
  autoConnect: false,
  transports: ["polling", "websocket"],
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 500,
  auth: { traceId: TRACE_ID },
  withCredentials: true
})
