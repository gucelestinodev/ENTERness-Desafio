import {
  WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

type ChatMessage = { user: string; text: string; room?: string };
type User = { id: string; name: string; room?: string };

@WebSocketGateway({ cors: { origin: ['http://localhost:5173'] } })
export class ChatGateway {
  @WebSocketServer() server: Server;

  private users = new Map<string, User>();          
  private history = new Map<string, ChatMessage[]>(); 

  private roomKey(room?: string) { return room ?? 'global'; }

  handleDisconnect(socket: Socket) {
    const user = this.users.get(socket.id);
    if (user) {
      this.server.to(this.roomKey(user.room)).emit('status', `${user.name} saiu da sala`);
      this.users.delete(socket.id);
    }
  }

  @SubscribeMessage('login')
  login(@MessageBody() payload: { name: string; room?: string }, @ConnectedSocket() socket: Socket) {
    this.users.set(socket.id, { id: socket.id, name: payload.name, room: payload.room });
    const room = this.roomKey(payload.room);
    socket.join(room);
    this.server.to(room).emit('status', `${payload.name} entrou na sala`);
    socket.emit('history', this.history.get(room) ?? []);
  }

  @SubscribeMessage('message')
  message(@MessageBody() payload: { text: string }, @ConnectedSocket() socket: Socket) {
    const user = this.users.get(socket.id);
    if (!user) return;
    const room = this.roomKey(user.room);
    const msg: ChatMessage = { user: user.name, text: payload.text, room: user.room };
    const list = this.history.get(room) ?? [];
    list.push(msg);
    this.history.set(room, list);
    this.server.to(room).emit('message', msg);
  }

  @SubscribeMessage('joinRoom')
  joinRoom(@MessageBody() payload: { room: string }, @ConnectedSocket() socket: Socket) {
    const user = this.users.get(socket.id);
    if (!user) return;
    socket.rooms.forEach(r => r !== socket.id && socket.leave(r));
    const room = this.roomKey(payload.room);
    socket.join(room);
    user.room = payload.room;
    this.server.to(room).emit('status', `${user.name} entrou em ${payload.room}`);
    socket.emit('history', this.history.get(room) ?? []);
  }
}
