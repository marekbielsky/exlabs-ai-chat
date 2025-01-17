import {
  Controller, Get, NotFoundException, Param, Request, UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @UseGuards(AuthGuard)
  @Get(':id/report')
  getReport(@Param('id') id: string, @Request() req) {
    const report = this.chatService.getReport(req.user.sub, id);

    if (report) {
      return report;
    }

    throw new NotFoundException('Report not found');
  }
}
