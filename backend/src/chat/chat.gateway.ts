import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

type ChatMessage = { user: string; text: string; room?: string; imageUrl?: string };
type User = { id: string; name: string; room: string };

type RoomInfo = { name: string; usersCount: number };

const FIXED_ROOMS = ['geral', 'suporte', 'desenvolvimento'] as const;

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN?.split(",") ?? ["http://localhost:5173"],
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  private users = new Map<string, User>();
  private history = new Map<string, ChatMessage[]>();
  private roomUsers = new Map<string, Set<string>>();
  private knownRooms = new Set<string>([...FIXED_ROOMS]);

  private normalizeRoom(room?: string) {
    const r = (room ?? '').trim().toLowerCase();
    const normalized = r || 'geral';
    this.knownRooms.add(normalized);
    return normalized;
  }


  private getHistory(room: string) {
    return this.history.get(room) ?? [];
  }

  private addToRoomIndex(room: string, socketId: string) {
    const set = this.roomUsers.get(room) ?? new Set<string>();
    set.add(socketId);
    this.roomUsers.set(room, set);
  }

  private removeFromRoomIndex(room: string, socketId: string) {
    const set = this.roomUsers.get(room);
    if (!set) return;

    set.delete(socketId);

    if (set.size === 0) {
      this.roomUsers.delete(room);
    } else {
      this.roomUsers.set(room, set);
    }
  }


  private currentRoomsList(): RoomInfo[] {
    const list = Array.from(this.knownRooms).map((name) => ({
      name,
      usersCount: this.roomUsers.get(name)?.size ?? 0,
    }));

    const fixedOrder = new Map(FIXED_ROOMS.map((r, i) => [r, i]));
    return list.sort((a, b) => {
      const fa = fixedOrder.has(a.name as any);
      const fb = fixedOrder.has(b.name as any);
      if (fa && fb) return (fixedOrder.get(a.name as any) ?? 0) - (fixedOrder.get(b.name as any) ?? 0);
      if (fa) return -1;
      if (fb) return 1;
      return a.name.localeCompare(b.name);
    });
  }

  private broadcastRooms() {
    const list = this.currentRoomsList()
    this.server.emit("rooms:list", list)
  }



  handleConnection(socket: Socket) {
    socket.emit("rooms:list", this.currentRoomsList())
  }


  handleDisconnect(socket: Socket) {
    const user = this.users.get(socket.id);
    if (!user) return;

    const room = user.room;
    this.removeFromRoomIndex(room, socket.id);

    this.server.to(room).emit("status", `${user.name} saiu da sala`);
    this.users.delete(socket.id);
    this.broadcastRooms();
  }

  @SubscribeMessage('login')
  login(
    @MessageBody() payload: { name: string; room?: string },
    @ConnectedSocket() socket: Socket,
  ) {
    const room = this.normalizeRoom(payload.room);

    socket.rooms.forEach((r) => r !== socket.id && socket.leave(r));

    socket.join(room);
    this.users.set(socket.id, { id: socket.id, name: payload.name, room });

    this.addToRoomIndex(room, socket.id);

    this.server.to(room).emit('status', `${payload.name} entrou na sala`);
    socket.emit('history', this.getHistory(room));

    this.broadcastRooms();
  }

  @SubscribeMessage('message')
  message(@MessageBody() payload: { text: string; imageUrl?: string }, @ConnectedSocket() socket: Socket) {
    const user = this.users.get(socket.id);
    if (!user) return;

    const room = user.room;

    const msg: ChatMessage = {
      user: user.name,
      text: payload.text ?? "",
      room,
      imageUrl: payload.imageUrl,
    };

    const list = this.history.get(room) ?? [];
    list.push(msg);
    this.history.set(room, list);
    this.server.to(room).emit('message', msg);
  }

  @SubscribeMessage('joinRoom')
  joinRoom(@MessageBody() payload: { room: string }, @ConnectedSocket() socket: Socket) {
    const user = this.users.get(socket.id);
    if (!user) return;

    const nextRoom = this.normalizeRoom(payload.room);
    const prevRoom = user.room;

    if (prevRoom === nextRoom) {
      socket.emit('history', this.getHistory(nextRoom));
      return;
    }

    socket.rooms.forEach((r) => r !== socket.id && socket.leave(r));

    this.removeFromRoomIndex(prevRoom, socket.id);
    socket.join(nextRoom);
    this.addToRoomIndex(nextRoom, socket.id);

    user.room = nextRoom;

    this.server.to(prevRoom).emit('status', `${user.name} saiu da sala`);
    this.server.to(nextRoom).emit('status', `${user.name} entrou na sala`);

    socket.emit('history', this.getHistory(nextRoom));

    this.broadcastRooms();
  }
}
