import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
// import { Logger } from '../config/log4js';

interface Response<T> {
  data: T;
  code: number;
  message: string;
  err?: any;
  status: boolean;
}
export const ResponseSUccess = <T>(data: T): Response<T> => ({
  data,
  err: null,
  code: 20,
  message: '请求成功',
  status: true,
});

export const ResponseFail = <T>(data: T, err: any): Response<T> => ({
  data,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  err: err,
  code: 20,
  status: false,
  message: '请求失败',
});
@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // const req = context.getArgByIndex(1).req;
    return next.handle().pipe(
      map((data) => {
        // const logFormat = JSON.stringify({
        //   IP: req.ip,
        //   user: req.user,
        //   res_url: req.originalUrl,
        //   res_method: req.method,
        // });
        // console.log('格式化返回');
        // Logger.access(logFormat);
        return ResponseSUccess(data);
      }),
    );
  }
}
