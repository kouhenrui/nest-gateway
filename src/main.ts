import { NestFactory } from '@nestjs/core';
import { AppModule } from './module/app/app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { LoggerManager } from './util/log';
// import { IoAdapter } from '@nestjs/platform-socket.io'; // 导入适配器
// import { CasbinAuthService } from './module/casbin/casbin.service';
async function bootstrap() {
  const logger = LoggerManager.getInstance({ context: 'AppLogger' });
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });
  app.enableCors(); //支持跨域
  app.useGlobalPipes(new ValidationPipe());
  // 配置 WebSocket 适配器
  // app.useWebSocketAdapter(new IoAdapter(app));
  // 获取 ConfigService 实例
  const configService = app.get(ConfigService);

  // const casbinService = app.get(CasbinAuthService);
  // await casbinService.init();
  const config = new DocumentBuilder()
    .setTitle('api example')
    .setDescription('The API description')
    .setVersion('1.0')
    // .addTag('')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  // 从 ConfigService 中读取端口号
  const port = configService.get<string>('PORT')!; // 默认端口 3000
  logger.info({
    event: '打印数据',
    data: { port: port, env: process.env.NODE_ENV },
  });
  await app.listen(port, () => {
    logger.info({ event: '程序启动成功,打印端口号', message: port });
    // console.log('启动成功', port);
  });
}
void bootstrap();
