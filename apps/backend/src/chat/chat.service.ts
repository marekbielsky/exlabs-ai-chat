import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { metrics, sampleReport } from '../data/sample-data';
import { User, UsersService } from '../users/users.service';

export const BOS = '~~~~';

const systemMessage = `You are an experienced startup founder with a deep understanding of the Venture Capital game. Your task is to mentor a founder in preparing an investor report about the recent progress of your business.

IMPORTANT: You MUST follow this EXACT template structure for your report, but DO NOT include the template itself in your response:
${sampleReport}

Instructions:
1. Use the EXACT same markdown formatting, sections, and emojis
2. Only update numerical values based on the provided metrics data
3. Keep all qualitative content (descriptions, team updates, etc.) exactly as shown
4. Maintain all table structures and column headers
5. Do not add or remove any sections
6. Keep the same greeting and closing format
7. Do not include the template in your response

Provide only the report content, and do not add anything beyond the report content.`;

const defaultSystemMessage: OpenAI.Chat.Completions.ChatCompletionMessageParam =
  { role: 'system', content: systemMessage };

export enum MessageMode {
  Report = 'report',
  Assistant = 'assistant',
  User = 'user',
}

interface SavedChat {
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[];
  report: string;
  state?: string;
  startDate: Date;
  endDate: Date;
}

@Injectable()
export class ChatService {
  private openai: OpenAI;
  private users: {
    [userId: string]: {
      chats: {
        [chatId: string]: SavedChat;
      };
    };
  };
  private readonly logger = new Logger(ChatService.name);

  private conversationScript: {
    state: string;
    isAssistantMsgComplete: boolean;
    updatesReport?: boolean;
    assistantMsg: string;
    transitions: string[];
  }[] = [
    {
      state: 'START',
      isAssistantMsgComplete: true,
      updatesReport: true,
      assistantMsg:
        "Welcome to Connectd AI Update Tool! You can already see the first iteration of your investor report. Let's improve it further.\n\n Do you want to answer my followup question, or directly provide feedback for the report, or move on to the next task?",
      transitions: ['FOLLOWUP_1', 'FEEDBACK_1', 'END'],
    },
    {
      state: 'FOLLOWUP_1',
      isAssistantMsgComplete: false,
      updatesReport: false,
      assistantMsg:
        'I will come up with one, specific followup question for you. Please provide an answer. Here is the question: ',
      transitions: ['FOLLOWUP_2'],
    },
    {
      state: 'FOLLOWUP_2',
      isAssistantMsgComplete: true,
      updatesReport: true,
      assistantMsg:
        'Thank you for the answer. Do you want to answer more followup questions or provide feedback for some specific section of the report?',
      transitions: ['FOLLOWUP_1', 'FEEDBACK_1', 'END'],
    },
    {
      state: 'FEEDBACK_1',
      isAssistantMsgComplete: true,
      updatesReport: false,
      assistantMsg:
        'Which of report sections would you like to provide feedback for?',
      transitions: ['FEEDBACK_2'],
    },
    {
      state: 'FEEDBACK_2',
      isAssistantMsgComplete: true,
      updatesReport: false,
      assistantMsg: 'What feedback do you have for this section?',
      transitions: ['FEEDBACK_3'],
    },
    {
      state: 'FEEDBACK_3',
      isAssistantMsgComplete: true,
      updatesReport: true,
      assistantMsg:
        'Thank you for the feedback. Do you want to provide feedback for more sections or answer followup questions?',
      transitions: ['FEEDBACK_1', 'FOLLOWUP_1', 'END'],
    },
    {
      state: 'END',
      isAssistantMsgComplete: true,
      updatesReport: false,
      assistantMsg:
        'Thank you for your time. If you have any more questions or need further assistance, feel free to ask.',
      transitions: [],
    },
  ];

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

  private prepareInitialUserMessage(
    user: User,
    startDate: Date,
    endDate: Date,
  ) {
    return `
        Here's information about me in JSON format:
        ${JSON.stringify(user)}
        
        Here are some metrics for my company:
        ${metrics}
        
        I want to generate a report covering time between ${startDate.toDateString()} and ${endDate.toDateString()}.`;
  }

  private prepareChatHistory(userId: string, chatId: string) {
    const chat = this.users[userId].chats[chatId];

    return chat.messages.map((message, index) => {
      if (message.role === 'assistant' && index >= chat.messages.length - 2) {
        return {
          ...message,
          content: [BOS, message.content.toString(), BOS, chat.report].join(
            ' ',
          ),
        };
      }

      return message;
    });
  }

  private *fakeTokenize(text: string, includeBOS = false) {
    if (includeBOS) {
      yield BOS;
    }
    const words = text.split(/(\s+)/);

    for (const word of words) {
      yield word;
    }
  }

  async *restoreConversation(userId: string, chatId: string) {
    if (!this.users[userId]) {
      this.users[userId] = { chats: {} };
    }

    const chat = this.users[userId].chats[chatId];

    if (chat) {
      for (const message of chat.messages.slice(2)) {
        // skip system and initial user message
        yield {
          stream: this.fakeTokenize(
            message.content.toString(),
            message.role === 'user',
          ),
          mode: message.role as MessageMode,
        };
      }
      yield {
        stream: this.fakeTokenize(chat.report),
        mode: MessageMode.Report,
      };
    }
  }

  async *generateInitialResponse(
    userId: string,
    chatId: string,
    startDate: Date,
    endDate: Date,
  ) {
    if (!this.users[userId]) {
      this.users[userId] = { chats: {} };
    }

    const user = await this.usersService.findOneById(userId);
    const chat: SavedChat = {
      messages: [defaultSystemMessage],
      report: sampleReport,
      state: null,
      startDate,
      endDate,
    };

    this.users[userId].chats[chatId] = chat;

    for await (const item of this.generateResponse(
      userId,
      chatId,
      this.prepareInitialUserMessage(user, startDate, endDate),
    )) {
      yield item;
    }
  }

  private async determineNextState(
    userId: string,
    chatId: string,
    message: string,
  ) {
    const chat = this.users[userId].chats[chatId];

    if (!chat.state) {
      console.log('No state found, returning START');

      return 'START';
    }

    const transitions = this.conversationScript.find(
      (state) => state.state === chat.state,
    ).transitions;

    console.log(
      `Trying to determine next state from: ${transitions} and messages: ${chat.messages[chat.messages.length - 1].content} and ${chat.messages[chat.messages.length - 2].content}`,
    );

    if (!transitions.length) {
      return null;
    } else if (transitions.length === 1) {
      return transitions[0];
    }

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            `Your role is to determine what option did the user select. The options are: ${transitions} and ERROR ` +
            "which should be used when the user's response does not seem to fall into any of those scripted categories. " +
            'Following is the last part of the conversation:\n' +
            `- ${chat.messages[chat.messages.length - 2].content}\n` +
            `- ${chat.messages[chat.messages.length - 1].content}`,
        },
        { role: 'assistant', content: 'Selected options is ' },
      ],
    });

    const selectedOption = response.choices[0].message.content.trim();

    console.log(`Selected option is: ${selectedOption}`);

    return selectedOption;
  }

  private async sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async *generateResponse(userId: string, chatId: string, message: string) {
    if (!this.users[userId] || !this.users[userId].chats[chatId]) {
      throw new Error('Chat not started');
    }

    const chat = this.users[userId].chats[chatId];

    chat.messages.push({ role: 'user', content: message });
    this.users[userId].chats[chatId] = chat;

    const report = [];

    try {
      const nextState = await this.determineNextState(userId, chatId, message);

      if (nextState === 'ERROR') {
        for await (const token of this.fakeTokenize(
          'Sorry, I did not understand your response. Please try again.',
          true,
        )) {
          yield { token, mode: MessageMode.Assistant };
          await this.sleep(5);
        }

        return;
      }

      const { assistantMsg, isAssistantMsgComplete, updatesReport } =
        this.conversationScript.find((state) => state.state === nextState);

      const assistantMessage: OpenAI.Chat.Completions.ChatCompletionMessageParam =
        { role: 'assistant', content: `${BOS} ${assistantMsg}` };

      for await (const token of this.fakeTokenize(
        assistantMessage.content.toString(),
      )) {
        yield { token, mode: MessageMode.Assistant };
        await this.sleep(5);
      }

      if (updatesReport) {
        assistantMessage.content += ` ${BOS}`;
        yield { token: BOS, mode: MessageMode.Report };
      }

      if (updatesReport || !isAssistantMsgComplete) {
        const stream = await this.openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [...chat.messages, assistantMessage],
          stream: true,
        });

        for await (const chunk of stream) {
          const token = chunk.choices[0].delta.content;

          if (updatesReport) {
            report.push(token);
          } else {
            assistantMessage.content += token;
          }

          yield {
            token,
            mode: updatesReport ? MessageMode.Report : MessageMode.Assistant,
          };
        }
      }

      chat.messages.push(assistantMessage);
      chat.report = report.join('');
      chat.state = nextState;
    } catch (error) {
      for await (const token of this.fakeTokenize(
        'Sorry, I encountered an error trying to process your request.',
      )) {
        yield { token, mode: MessageMode.Assistant };
      }
    }
  }
}
