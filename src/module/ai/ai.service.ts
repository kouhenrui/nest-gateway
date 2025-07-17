import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
// import got from 'got';
@Injectable()
export class AiService {
  private ChatGPT = 'https://api.openai.com/v1/chat/completions';
  private API_KEY = 'sk-';
  //   private Claude = 'https://api.anthropic.com/v1/messages';
  //   private Bard =
  //     'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
  //   private Face = 'https://api-inference.huggingface.co/models/';

  constructor() {}
  /**
   * 调用 OpenAI API 生成文本
   */
  // eslint-disable-next-line @typescript-eslint/require-await
  async generateText(prompt: string): Promise<string> {
    try {
      console.log(prompt, 'prompt');
      //   const response: any = await got.post(this.ChatGPT, {
      //     json: {
      //       model: 'gpt-4',
      //       messages: [{ role: 'user', content: prompt }],
      //       max_tokens: 100,
      //     },
      //     headers: {
      //       Authorization: `Bearer ${this.API_KEY}`,
      //     },
      //     responseType: 'json',
      //   });

      //   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      //   const content = response.body?.choices?.[0]?.message?.content;
      //   if (!content) {
      //     throw new HttpException(
      //       'AI 返回数据为空',
      //       HttpStatus.INTERNAL_SERVER_ERROR,
      //     );
      //   }
      //   // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      //   return content;
      return 'content';
    } catch (error) {
      console.error('AI 请求失败:', error);
      throw new HttpException('AI 请求失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
