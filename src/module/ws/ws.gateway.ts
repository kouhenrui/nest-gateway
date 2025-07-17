import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayInit,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway(3001, {
  namespace: '/ws', // 可以选择自定义命名空间
  cors: {
    origin: '*', // 允许所有跨域
  },
})
export class WsGateway implements OnGatewayInit {
  @WebSocketServer() server: Server;

  afterInit() {
    console.log('WebSocket gateway initialized');
  }

  @SubscribeMessage('message') // 监听 'message' 事件
  handleMessage(@MessageBody() data: string): string {
    return `Received message: ${data}`;
  }
}
