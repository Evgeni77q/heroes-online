import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RealtimeService } from '../services/realtime.service';
import { JoinWorldPayload } from '../types/events.types';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private playerByClient = new Map<string, string>();

  constructor(private realtime: RealtimeService) {}

  afterInit() {
    this.realtime.setServer(this.server);
  }

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    const playerId = this.playerByClient.get(client.id);
    if (playerId) {
      this.realtime.unregisterClient(playerId);
      this.playerByClient.delete(client.id);
    }
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('join_world')
  handleJoinWorld(
    @MessageBody() data: JoinWorldPayload,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(data.worldId);
    this.realtime.registerClient(data.playerId, client);
    this.playerByClient.set(client.id, data.playerId);

    return {
      event: 'joined_world',
      data: { worldId: data.worldId },
    };
  }

  @SubscribeMessage('ping')
  handlePing() {
    return { event: 'pong' };
  }
}
