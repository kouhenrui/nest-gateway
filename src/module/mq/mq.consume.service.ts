import { Injectable } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';

@Injectable()
export class MqConsumeService {
  // 监听 queue_1 队列的消息
  @EventPattern('message_queue_1')
  async handleMessageFromQueue1(data: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await data;
    console.log('Received message from queue_1:', data);
  }

  // 监听 queue_2 队列的消息
  @EventPattern('message_queue_2')
  async handleMessageFromQueue2(data: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await data;
    console.log('Received message from queue_2:', data);
  }
}
