import { Body, Controller, Post } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('generate-text')
  async generateText(@Body('prompt') prompt: string) {
    return await this.aiService.generateText(prompt);
  }
}
