import { Injectable } from '@nestjs/common';
import { Account } from '../../entities/account.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomError } from '../../config/commonException';
import { hashPassword, uuid } from '../../util/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtClaims } from '../../config/common';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class AccountService {
  constructor(
    private jwtService: JwtService,
    private redisService: RedisService,
    private configService: ConfigService,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async AccountList() {
    try {
      return await this.accountRepository.find();
    } catch (error: any) {
      console.log(error);
      throw error;
    }
  }

  /**
   * 生成token
   * @param body JwtSignData
   * @returns {Promise<{token: string, exp: Date}>}
   * @throws CustomError
   */
  async GenerateToken(
    body: JwtClaims,
    access_token: string,
  ): Promise<{ token: string; exp: Date }> {
    try {
      // 配置JWT选项
      const jwtOptions: Record<string, any> = {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>('JWT_EXPIRES'),
        subject: this.configService.get<string>('JWT_SUBJECT'),
      };
      const expiresIn = Number(jwtOptions.expiresIn);
      if (isNaN(expiresIn)) throw new CustomError('JWT过期时间无效');
      const exp = new Date(Date.now() + expiresIn * 1000);
      const token = await this.jwtService.signAsync(body, jwtOptions);
      const redisData: { token: string; exp: Date } = { token, exp };
      await this.redisService.set(
        access_token,
        JSON.stringify(redisData),
        expiresIn,
      );
      return redisData;
    } catch (error: unknown) {
      // 如果捕获到的是CustomError，则抛出该错误
      if (error instanceof CustomError) {
        throw error;
      } else {
        // 打印错误并抛出
        console.error('生成Token时发生错误:', error);
        throw new Error('生成Token时发生错误');
      }
    }
  }

  /**
   * @description 登录接口
   * @param body {name: string, pwd: string} - 登录信息
   * @returns {Promise<{token: string, exp: Date}>} - token和过期时间
   * @throws CustomError - 账号或密码错误
   */
  async Login(
    body: Record<string, string>,
  ): Promise<{ token: string; exp: Date }> {
    try {
      const { name, pwd } = body;
      if (!name || !pwd) throw new CustomError('缺少参数');
      const account = await this.accountRepository.findOne({
        where: { user_name: name },
      });
      if (!account) throw new CustomError('账号或密码错误');
      if (account.password !== (await hashPassword(pwd, account.salt)))
        throw new CustomError('账号或密码错误');
      if (await this.redisService.exists(account.access_token)) {
        const redisData = await this.redisService.get(account.access_token);
        if (redisData && redisData.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const { token, exp } = JSON.parse(redisData);
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          return { token, exp };
        }
      }
      const signData: JwtClaims = {
        id: account.id,
        role: account.role,
      };
      const access_token = uuid();
      await this.accountRepository.update({ id: account.id }, { access_token });
      return await this.GenerateToken(signData, access_token);
    } catch (error: unknown) {
      if (error instanceof CustomError) console.log(error.message);
      throw error;
    }
  }

  /**
   *  refresh token
   * @param claim JwtClaims
   * @returns {Promise<{token: string, exp: Date}>}
   * @throws CustomError
   */
  async RefreshToken(claim: JwtClaims): Promise<{ token: string; exp: Date }> {
    try {
      const account = await this.accountRepository.findOneBy({ id: claim.id });
      if (!account) throw new CustomError('token不存在');
      const signData: JwtClaims = {
        id: account.id,
        role: account.role,
      };
      return await this.GenerateToken(signData, account.access_token);
    } catch (error: unknown) {
      if (error instanceof CustomError) console.log(error.message);
      throw error;
    }
  }
}
