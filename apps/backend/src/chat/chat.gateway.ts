import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { User, UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtTokenPayload } from '../auth/auth.service';
import { Logger } from '@nestjs/common';

interface SocketWithUserData extends Socket {
  user: User;
  chatId: string;
  startDate: Date;
  endDate: Date;
}

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
  },
})
export class ChatGateway implements OnGatewayConnection {
  private readonly logger = new Logger(ChatGateway.name);

  constructor(
    private readonly chatService: ChatService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() socket: SocketWithUserData,
    @MessageBody() message: string,
  ): Promise<void> {
    socket.emit('message', '<|startoftext|>');
    for await (const completion of this.chatService.handleMessage(
      socket.user,
      socket.chatId,
      message,
    )) {
      socket.emit('message', completion);
    }
    socket.emit('message', '<|endoftext|>');
  }

  @SubscribeMessage('start')
  async handleStart(
    @ConnectedSocket() socket: SocketWithUserData,
  ): Promise<void> {
    socket.emit('message', '<|startoftext|>');
    for await (const completion of this.chatService.handleStart(
      socket.user,
      socket.chatId,
      socket.startDate,
      socket.endDate,
    )) {
      socket.emit('message', completion);
    }
    socket.emit('message', '<|endoftext|>');
  }

  async handleConnection(@ConnectedSocket() socket: SocketWithUserData) {
    this.logger.log('New connection attempt:', {
      headers: socket.handshake.headers,
      query: socket.handshake.query,
    });
    try {
      const token = socket.handshake.headers.authorization?.replace(
        'Bearer ',
        '',
      );
      const chatId = socket.handshake.query.reportId as string;

      if (!token || !chatId) {
        throw new Error('Authorization token or chatId is missing');
      }

      const payload = await this.jwtService.verifyAsync<JwtTokenPayload>(token);
      this.logger.log(`Token verified: ${payload.name}`);

      const user = await this.usersService.findOneByName(payload.name);
      this.logger.log(`User found: ${user.businessName} (${user.id})`);

      if (!user) {
        throw new Error('User does not exist');
      }

      // TODO verify that the user is a chat owner

      socket.user = user;
      socket.chatId = chatId;
      socket.startDate = new Date(
        (socket.handshake.query.startDate ?? '2024-01-01') as string,
      );
      socket.endDate = new Date(
        (socket.handshake.query.endDate ?? '2024-12-31') as string,
      );
      this.logger.log(
        `Connection established: ${user.businessName} (${user.id}) -> Chat ID: ${chatId}`,
      );
    } catch (e) {
      console.error('Error during connection:', e);
      socket.disconnect();
    }
  }
}
