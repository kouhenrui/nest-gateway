/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
// import { Logger } from '../config/log4js';
// import { InjectRepository } from '@nestjs/typeorm';
// import { OperateLog } from 'src/entity/new/operate_log.entity';
// import { Repository } from 'typeorm';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  // constructor(
  //   // @InjectRepository(OperateLog)
  //   // private operateLogRepository: Repository<OperateLog>,
  // ) {}
  catch(exception: any, host: ArgumentsHost) {
    const request = host.switchToHttp().getRequest();
    const response = host.switchToHttp().getResponse();
    console.log(exception.getStatus(), '.......');
    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;
    const error_info = exception.response ? exception.response : exception;
    const error_data = exception.response?.data ? exception.response.data : {};
    const error_msg = exception.response
      ? exception.response.message
        ? exception.response.message
        : exception.response.errorMsg
      : '系统繁忙，请稍后再试！';
    console.log('错误原因', error_msg);
    const error_code = exception.response?.errorCode
      ? exception.response.errorCode
      : -200;
    // 自定义异常结构体, 日志用
    const data = {
      timestamp: new Date().toISOString(),
      ip: request.ip,
      req_url: request.originalUrl,
      req_method: request.method,
      http_code: status >= 600 ? status : 200,
      status: false,
      params: request.params,
      query: request.query,
      body: request.body,
      errorData: error_data,
      errorMsg: status == 600 ? error_info.errorMsg : error_msg,
      errorCode: status == 600 ? error_info.errorInfo : error_code,
      error_info: error_info,
    };
    console.log(status, '异常状态码');
    // 404 错误定制
    if (status === HttpStatus.NOT_FOUND) {
      data.errorMsg = `${request.url} 接口资源不存在！`;
      data.http_code = 404;
    }

    // 405 错误定制
    if (status === HttpStatus.METHOD_NOT_ALLOWED) {
      data.errorMsg = `接口 ${request.url} 存在，但 ${request.method} 方法不被允许！`;
      data.http_code = 405;
    }

    // 500 错误定制
    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      data.errorMsg = '系统内部错误，请稍后重试';
    }
    // Logger.error(data);

    // const opreateLog = new OperateLog();
    // opreateLog.url = request.originalUrl;
    // opreateLog.method = request.method;
    // opreateLog.ip = request.ip;
    // opreateLog.status = String(status);
    // opreateLog.level = 'error';
    // this.operateLogRepository.save(opreateLog);
    // let return_status = 200;
    // if (status == 600) return_status = 200;
    // if (status == 401 || status == 400) return_status = status;
    // if (status == 302) return_status = status;
    response.status(status).json({
      data: data.errorData,
      msg: data.errorMsg,
      code: data.errorCode,
      status: false,
    });
  }
}
