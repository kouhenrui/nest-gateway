/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { CasbinAuthService } from '../module/casbin/casbin.service';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private casbinAuthService: CasbinAuthService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const path: string = request.url;
    const method = request.method;
    const user = request.user;
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
    //若是白名单请求路径直接返回true
    if (!(whitePath.includes(path) || prefix)) {
      //解析token是否存在
      if (!user) {
        return false;
      }
      const casbinEnforce = await this.casbinAuthService.enforce(
        user.nick_name,
        path,
        method,
      );
      //判断是否有权限请求接口
      if (!casbinEnforce) {
        return false;
      }
    }

    return true;
  }
}
