import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
@Controller('/app')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {}
  @Get('/health')
  health() {
    return 'ok';
  }

  @Get('/get/captcha')
  async getCaptcha() {
    try {
      return await this.appService.getCaptcha();
    } catch (error: any) {
      if (error instanceof Error) console.log(error.message);
      console.log(error, '生成验证码错误');
      throw error;
    }
  }

  @Post('/verify/captcha')
  async verifyCaptcha(@Body() body: Record<string, string>) {
    try {
      return await this.appService.verifyCaptcha(body);
    } catch (error: any) {
      console.log(error, '验证验证码错误');
      throw error;
    }
  }

  @Get('/hello')
  getHello() {
    return 'Hello World!';
    // const database: Record<string, any> = {};
    // database.host = this.configService.get<string>('DATABASE_HOST');
    // database.port = this.configService.get<string>('DATABASE_PORT');
    // return database;
    // return this.configService.get<string>('DATABASE_HOST');
  }

  @Post('/test/swagger')
  postHello(@Body() body: any) {
    try {
      console.log(body, '请求参数');
      return this.appService.postHello();
    } catch (error: any) {
      console.log(error);
      throw error;
    }
  }
}
