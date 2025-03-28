/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadGatewayException,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { JwtClaims } from '../config/common';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async use(req: Request, res: Response, next: (error?: any) => void) {
    if (!(req.headers['x-app'] === this.configService.get<string>('APP_NAME')))
      throw new BadGatewayException('缺少请求参数');
    const path: string = req.originalUrl;
    const whitePathStr = this.configService.get<string>('WHITE_PATH');
    const whitePath: string[] = whitePathStr
      ? whitePathStr.startsWith('[')
        ? JSON.parse(whitePathStr)
        : whitePathStr.split(',')
      : [];
    const prefix = whitePath.some((s) => {
      const regex = new RegExp(`^${s.replace(/\*/g, '.*')}$`);
      return regex.test(path);
    });
    if (!whitePath.includes(path) && !prefix) {
      const token = this.extractTokenFromHeader(req);
      if (!token) {
        console.error('token不存在');
        throw new UnauthorizedException('token不存在,请先登录');
      }
      try {
        const payload: JwtClaims = await this.jwtService.verifyAsync(token, {
          secret: this.configService.get<string>('JWT_SECRET'),
        });
        req['acc'] = payload;
      } catch {
        throw new UnauthorizedException('token不正确,请先验证是否为本人账号');
      }
    }
    next();
    console.log('casbin中间件结束');
  }
  private extractTokenFromHeader(request: Request): string | undefined {
    const authorizationHeader: string = request.headers['authorization'] ?? '';
    const [type, token] = authorizationHeader.split('') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
