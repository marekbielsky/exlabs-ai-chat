import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService, MessageMode } from './chat.service';
import { User, UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtTokenPayload } from '../auth/auth.service';
import { Logger } from '@nestjs/common';

interface SocketWithUserData extends Socket {
  user: User;
  chatId: string;
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
    this.logger.log('handleMessage invoked:', {
      userId: socket.user.id,
      chatId: socket.chatId,
      message,
    });
    this.server.emit('message', message);

    let prevMode = null;

    for await (const { token, mode } of this.chatService.generateResponse(
      socket.user.id,
      socket.chatId,
      message,
    )) {
      // this.logger.log('Generated response token:', { token, mode });
      this.processToken(token, mode);
      prevMode = mode;
    }
  }

  @SubscribeMessage('start')
  async handleStart(
    @ConnectedSocket() socket: SocketWithUserData,
  ): Promise<void> {
    this.logger.log('handleStart invoked:', {
      userId: socket.user.id,
      chatId: socket.chatId,
    });
    this.logger.log('Restoring conversation:', socket.chatId);
    let countRestoredMessages = 0;
    for await (const { stream, mode } of this.chatService.restoreConversation(
      socket.user.id,
      socket.chatId,
    )) {
      await this.processStream(stream, mode);
      countRestoredMessages++;
    }

    if (countRestoredMessages == 0) {
      this.logger.log('No messages restored, generating initial response');
      for await (const {
        token,
        mode,
      } of this.chatService.generateInitialResponse(
        socket.user.id,
        socket.chatId,
      )) {
        this.processToken(token, mode);
      }
    }
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
      this.logger.log('JWT payload verified:', payload);

      const user = await this.usersService.findOneByName(payload.name);
      this.logger.log('User fetched from database:', user);

      if (!user) {
        throw new Error('User does not exist');
      }

      // TODO verify that the user is a chat owner

      socket.user = user;
      socket.chatId = chatId;
      this.logger.log('Connection established:', { user, chatId });
    } catch (e) {
      console.error('Error during connection:', e);
      socket.disconnect();
    }
  }

  private async processStream(
    tokenStream: Iterable<string>,
    mode: MessageMode,
  ): Promise<void> {
    this.logger.log('Processing token stream:', { mode });
    for await (const token of tokenStream) {
      this.processToken(token, mode);
    }
  }

  private async processToken(token: string, mode: MessageMode): Promise<void> {
    this.server.emit(mode, token);
  }
}
