// import { Injectable, NestMiddleware } from '@nestjs/common';
// import { Request, Response } from 'express';
// // import { Logger } from '../config/log4js';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// // import { OperateLog } from 'src/entity/new/operate_log.entity';

// @Injectable()
// export class LoggerMiddleware implements NestMiddleware {
//   use(req: Request, res: Response, next: () => void) {
//     // const code = res.statusCode; //响应状态吗
//     next();
//     //  组装日志信息
//     // const logFormat = `Method:${req.method}
//     //   Request original url: ${req.originalUrl}
//     //   IP:${req.ip}
//     //   Status code:${code} `;
//     // // 根据状态码进行日志类型区分
//     // if (code >= 500) {
//     //   Logger.error(logFormat);
//     // } else if (code >= 400) {
//     //   Logger.warn(logFormat);
//     // } else {
//     //   Logger.access(logFormat);
//     //   Logger.log(logFormat);
//     // }
//   }
// }

// // 函数式中间件
// export function logger(req: Request, res: Response, next: () => any) {
//   const code = res.statusCode; //响应状态码
//   next();
//   // 组装日志信息
//   const logFormat = `
//   >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//   Request original url: ${req.originalUrl}
//   Method: ${req.method}
//   IP: ${req.ip}
//   Status code: ${code}
//   Parmas: ${JSON.stringify(req.params)}
//   Query: ${JSON.stringify(req.query)}
//   Body: ${JSON.stringify(req.body)}
//   >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// `;
// //根据状态码，进行日志类型区分
// if (code >= 500) {
//   Logger.error(logFormat);
// } else if (code >= 400) {
//   Logger.warn(logFormat);
// } else {
//   Logger.access(logFormat);
//   Logger.log(logFormat);
// }
// }

// @Injectable()
// export class LoggerMiddle implements NestMiddleware {
//   constructor(
//     @InjectRepository(OperateLog)
//     private operateLogRepository: Repository<OperateLog>,
//   ) {}
//   async use(req: any, res: any, next: (error?: any) => void) {
//     console.log('log中间件开始');
//     const code = res.statusCode; //响应状态码
//     next();
//     // 组装日志信息
//     const logFormat = `
//     >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//     Request original url: ${req.originalUrl}
//     Method: ${req.method}
//     IP: ${req.ip}
//     Status code: ${code}
//     Parmas: ${JSON.stringify(req.params)}
//     Query: ${JSON.stringify(req.query)}
//     Body: ${JSON.stringify(req.body)}
//     >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//   `;
//     // const logData = { logFormat, code };
//     const opreateLog = new OperateLog();

//     opreateLog.url = req.originalUrl;
//     opreateLog.method = req.method;
//     opreateLog.ip = req.ip;
//     opreateLog.status = code;
//     // console.log(code,'响应状态码')
//     let level;
//     //根据状态码，进行日志类型区分
//     if (code >= 500) {
//       level = 'error';
//       Logger.error(logFormat);
//     } else if (code >= 400) {
//       level = 'warn';
//       Logger.warn(logFormat);
//     } else {
//       level = 'info';
//       Logger.access(logFormat);
//       Logger.log(logFormat);
//     }
//     console.log('log中间件结束');
//     opreateLog.level = level;
//     await this.operateLogRepository.save(opreateLog);
//   }
// }
