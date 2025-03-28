import { Injectable } from '@nestjs/common';
import {
  decryptAES,
  encryptAES,
  getCaptcha,
  getSelfSalt,
  replaceSensitiveInfo,
} from '../../util/common';
import { CaptchaType, sensitive } from '../../config/common';
import { RedisService } from '../redis/redis.service';
import { CustomError } from '../../config/commonException';

@Injectable()
export class AppService {
  constructor(private redisService: RedisService) {}
  getHello(): string {
    return 'Hello World!';
  }
  postHello() {
    try {
      const unSafeValue = '3202450154@google.email';
      const safeValue = replaceSensitiveInfo(unSafeValue, sensitive.email);
      const salt = getSelfSalt(32);
      console.log(salt, salt.length, 'salt');
      const encryptData = encryptAES(unSafeValue, salt);
      const decryptData = decryptAES(encryptData, salt);
      return {
        unSafeValue,
        safeValue,
        encryptData,
        decryptData,
      };
    } catch (error: unknown) {
      console.log(error, '7777');
      throw error;
    }
  }

  async getCaptcha() {
    try {
      const captchaType: CaptchaType = CaptchaType.ALPHANUMERIC;
      const result = getCaptcha(captchaType);
      const { base64, text, id } = result;
      await this.redisService.set('captcha', text, 60);
      const res: Record<string, string> = {
        base64,
        id,
      };
      return res;
    } catch (error: unknown) {
      console.log(error, '7777');
      throw error;
    }
  }

  async verifyCaptcha(body: Record<string, string>): Promise<boolean> {
    try {
      const { id, result } = body;
      if (!body.captcha) throw new CustomError('验证码不存在');
      if (!(await this.redisService.exists(`captcha:${id}`)))
        throw new Error('验证码不存在');
      const text = await this.redisService.get(`captcha:${id}`);
      if (test.length < 1) throw new CustomError('验证码不存在');
      return text === result;
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        console.error('错误信息:', error.message);
        throw error;
      } else {
        console.error('未知错误:', error);
        const e = `未知错误:${String(error)}`;
        throw new Error(e); // 将未知错误转换为 Error
      }
    }
  }
}
