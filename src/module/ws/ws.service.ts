/* eslint-disable @typescript-eslint/require-await */
import { Injectable } from '@nestjs/common';

@Injectable()
export class WsService {
  /**
   * 处理消息逻辑
   */
  async processMessage(data: { user: string; message: string }) {
    const { user, message } = data;
    // 模拟处理逻辑
    const timestamp = new Date().toISOString();
    return { user, message, timestamp };
  }
}
