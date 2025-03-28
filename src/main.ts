import { NestFactory } from '@nestjs/core';
import { AppModule } from './module/app/app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { LoggerManager } from './util/log';
// import { CasbinAuthService } from './module/casbin/casbin.service';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); //支持跨域
  app.useGlobalPipes(new ValidationPipe());
  // 获取 ConfigService 实例
  const configService = app.get(ConfigService);
  const logger = LoggerManager.getInstance({ context: 'AppLogger' });
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
