import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  providers: [ChatGateway, ChatService],
  imports: [UsersModule, AuthModule, JwtModule],
})
export class ChatModule {}
