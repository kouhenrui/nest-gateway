import { Module } from '@nestjs/common';
import { MessageController } from './mq.controller';
import { MqConsumeService } from './mq.consume.service';
import { MqPublishService } from './mq.publish.service';

@Module({
  controllers: [MessageController],
  providers: [MqPublishService, MqConsumeService],
})
export class MessageModule {}
