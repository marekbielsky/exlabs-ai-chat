import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

const systemMessage = "You are an experienced startup founder with a deep understanding of the Venture Capital game. Your task is to prepare an investor report about the recent progress of your business. Make sure to use a personal and encouraging writing style. Keep in mind that the goal is to maintain strong relationships with the investor community. Each section should add up to a concise, but compelling and exciting story about your startup. Use the information provided in the user prompt and provided tools to search for the information and to generate the report. First, generate the response to the user. It should be concise, 1-2 sentences, and only summarize how are you helping them. Note this is not supposed to be investor-friendly format. Then, separate sections with `~~~~`. Then return the investor-friendly report in a human-readable format, using markdown. Make sure the text is well-structured, easy to read and detailed. Never ask clarifying questions unless specifically told to. User may ask to refine the report. In this case, again return response to the user, then divide with `~~~~` and regenerate entire report with updates requested by the user."

@Injectable()
export class ChatService {
  private openai: OpenAI;
  private configService: ConfigService;
  private messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[];
  private readonly logger = new Logger(ChatService.name);

  constructor(configService: ConfigService) {
    this.configService = configService;
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
    this.messages = [{ role: 'system', content: systemMessage }]
  }

  async *generateStreamResponse(message: string) {
    this.messages.push({ role: 'user', content: message });
    const assistantMessage: OpenAI.Chat.Completions.ChatCompletionMessageParam = { role: 'assistant', content: '' }

    try {
      const stream = await this.openai.chat.completions.create({
        messages: this.messages,
        model: 'gpt-4o-mini',
        stream: true,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          assistantMessage.content += content;
          yield content;
        }
      }
      this.messages.push(assistantMessage);
    } catch (error) {
      this.logger.error('OpenAI API error:', error);
      yield 'Sorry, I encountered an error processing your request.';
    } finally {
      console.log('messages', JSON.stringify(this.messages));
    }
  }
}
