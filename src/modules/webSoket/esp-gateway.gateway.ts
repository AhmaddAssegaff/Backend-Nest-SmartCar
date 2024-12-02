import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
})
export class EspGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  // Handle saat ESP32 terhubung
  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    client.emit('message', { data: 'some data' }); // Mengirimkan pesan ke ESP32
  }

  // Handle saat ESP32 disconnect
  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // Mendengarkan pesan dari ESP32
  @SubscribeMessage('esp-message')
  handleMessage(@MessageBody() data: any, client: Socket): string {
    console.log('Message received from ESP32:', data);

    // Kirim balasan ke ESP32
    client.emit('server-response', { message: 'Data received', data });

    return 'Message received';
  }
}
