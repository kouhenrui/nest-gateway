import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, ClientRMQ, Transport } from '@nestjs/microservices';

@Injectable()
export class MqPublishService implements OnModuleInit {
  private readonly configService: ConfigService;

  // 创建多个客户端
  @Client({
    transport: Transport.RMQ,
    options: {
      // urls: [this.configService.get<string>('RABBIT_HOST_1')], // 第一个 RabbitMQ 实例
      // queue: this.configService.get<string>('RABBITMQ_QUEUE_1'), // 第一个队列
      queueOptions: {
        durable: false, //持久化队列
      },
      // exchange: this.configService.get<string>('RABBITMQ_EXCHANGE_1'), // 第一个交换机
      // routingKey: 'queue_1_routing_key', // 第一个队列的路由键
    },
  })
  private client1: ClientRMQ;

  @Client({
    transport: Transport.RMQ,
    options: {
      // urls: [this.configService.get<string>('RABBIT_HOST_2')], // 第二个 RabbitMQ 实例
      // queue: this.configService.get<string>('RABBITMQ_QUEUE_2'), // 第二个队列
      queueOptions: {
        durable: false,
      },
      // exchange: this.configService.get<string>('RABBITMQ_EXCHANGE_2'), // 第二个交换机
      // routingKey: 'queue_2_routing_key', // 第二个队列的路由键
    },
  })
  private client2: ClientRMQ;

  constructor(configService: ConfigService) {
    this.configService = configService;
  }

  // 模块初始化时连接 RabbitMQ
  async onModuleInit() {
    await Promise.all([this.client1.connect(), this.client2.connect()]);
  }

  // 发送消息到队列1
  async sendToQueue1(message: any) {
    // 使用指定的交换机和队列路由键
    // eslint-disable-next-line @typescript-eslint/await-thenable
    return await this.client1.emit('message_queue_1', message);
  }

  // 发送消息到队列2
  async sendToQueue2(message: any) {
    // 使用指定的交换机和队列路由键
    // eslint-disable-next-line @typescript-eslint/await-thenable
    return await this.client2.emit('message_queue_2', message);
  }
}
