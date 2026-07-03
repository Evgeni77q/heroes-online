import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@Injectable()
export class RealtimeService {
  private server?: Server;
  private clients = new Map<string, Socket>();

  setServer(server: Server) {
    this.server = server;
  }

  registerClient(playerId: string, client: Socket) {
    this.clients.set(playerId, client);
  }

  unregisterClient(playerId: string) {
    this.clients.delete(playerId);
  }

  emitToWorld(worldId: string, event: string, data: Record<string, unknown>) {
    this.server?.to(worldId).emit(event, data);
  }

  emitToPlayer(playerId: string, event: string, data: Record<string, unknown>) {
    const client = this.clients.get(playerId);
    client?.emit(event, data);
  }

  isReady() {
    return this.server !== undefined;
  }
}
