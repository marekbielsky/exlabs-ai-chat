import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { User, UsersService } from '../users/users.service';
import { metrics } from 'src/data/sample-data';
import { systemPrompt } from 'src/data/system-prompt';
import { responseSchema } from '../data/response-schema';
import { zodResponseFormat } from 'openai/helpers/zod';

interface ChatHistory {
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[];
  startDate: Date;
  endDate: Date;
}

@Injectable()
export class ChatService {
  private openai: OpenAI;
  private users: {
    [userId: string]: {
      chats: {
        [chatId: string]: ChatHistory;
      };
    };
  };
  private readonly logger = new Logger(ChatService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    this.logger.log('Initializing ChatService...');
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
    this.users = {};
    this.logger.log('ChatService initialized successfully.');
  }

  async *handleStart(
    user: User,
    chatId: string,
    startDate: Date,
    endDate: Date,
  ) {
    this.logger.log(`Starting chat for user ${user.id} and chat ${chatId}`);
    if (!this.users[user.id]) {
      this.users[user.id] = { chats: {} };
    }
    this.users[user.id].chats[chatId] = {
      messages: [],
      startDate,
      endDate,
    };

    // Extract user metrics
    // TODO: https://exlabs.atlassian.net/browse/CON-13882
    const userMetrics = metrics;

    // Generate conversation history
    this.users[user.id].chats[chatId].messages.push({
      role: 'system',
      content: systemPrompt,
    });

    this.users[user.id].chats[chatId].messages.push({
      role: 'user',
      content: `Hello, my name is ${user.name} from company ${user.businessName}. I would like to generate a report for the period from ${startDate} to ${endDate}. Following are my company's metrics: ${userMetrics}`,
    });

    const chunks = [];

    const stream = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: this.users[user.id].chats[chatId].messages,
      stream: true,
      response_format: zodResponseFormat(responseSchema, 'response_schema'),
      temperature: 0,
    });

    for await (const chunk of stream) {
      const delta = chunk.choices[0].delta.content;
      this.logger.log(`Received completion: ${delta}`);
      chunks.push(delta);
      yield delta;
    }

    this.users[user.id].chats[chatId].messages.push({
      role: 'assistant',
      content: chunks.join(''),
    });
  }

  async *handleMessage(user: User, chatId: string, message: string) {
    this.logger.log(`Handling message for user ${user.id} and chat ${chatId}`);

    if (!this.users[user.id] || !this.users[user.id].chats[chatId]) {
      throw new Error(`Chat ${chatId} for user ${user.id} does not exist.`);
    }

    this.users[user.id].chats[chatId].messages.push({
      role: 'user',
      content: message,
    });

    const chunks = [];

    const stream = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: this.users[user.id].chats[chatId].messages,
      stream: true,
      response_format: zodResponseFormat(responseSchema, 'response_schema'),
      temperature: 0.1,
    });

    for await (const chunk of stream) {
      const delta = chunk.choices[0].delta.content;
      this.logger.log(`Received completion: ${delta}`);
      chunks.push(delta);
      yield delta;
    }

    this.users[user.id].chats[chatId].messages.push({
      role: 'assistant',
      content: chunks.join(''),
    });
  }
}
