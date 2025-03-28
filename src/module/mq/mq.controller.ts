import { Controller, Post, Body } from '@nestjs/common';
import { MqConsumeService } from './mq.consume.service';
import { MqPublishService } from './mq.publish.service';

@Controller('messages')
export class MessageController {
  constructor(
    private readonly mqConsumeService: MqConsumeService,
    private readonly mqPublishService: MqPublishService,
  ) {}

  // 发送消息到 queue_1
  @Post('send-queue1')
  async sendToQueue1(@Body() message: any) {
    await this.mqPublishService.sendToQueue1(message);
    return { message: 'Message sent to queue_1' };
  }

  // 发送消息到 queue_2
  @Post('send-queue2')
  async sendToQueue2(@Body() message: any) {
    await this.mqPublishService.sendToQueue2(message);
    return { message: 'Message sent to queue_2' };
  }
}
