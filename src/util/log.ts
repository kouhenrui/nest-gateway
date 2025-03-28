// src/logger/loggerManager.ts
import { Logger } from '@nestjs/common';

// 定义日志级别
enum LogLevel {
  info = 'info',
  warn = 'warn',
  error = 'error',
  debug = 'debug',
  fatal = 'fatal',
}

// 定义日志选项
interface LoggerOptions {
  context?: string; // 日志上下文
  level?: LogLevel; // 日志级别
  name?: string; // 日志名称
  id?: string;
}
interface LogError {
  name?: string;
  message?: string;
  stack?: string;
}

interface LogData {
  event: string; // 必填字段
  message?: string; // 可选字段
  data?: Record<string, any>; // 可选字段
  error?: LogError; // 可选字段
  // name: string;
  // ID: string;
}
// LoggerManager 管理类
export class LoggerManager {
  private static instance: LoggerManager; // 单例实例
  private logger: Logger; // NestJS Logger
  private name: string;
  private id: string;

  // 私有构造函数，防止外部实例化
  private constructor(option: LoggerOptions) {
    this.logger = new Logger(option.context || 'AppLogger');
    this.name = option.name || 'AppLogger';
    this.id = option.id || 'AppLogger';
  }

  // 获取单例实例
  public static getInstance(option?: LoggerOptions): LoggerManager {
    if (!LoggerManager.instance) {
      LoggerManager.instance = new LoggerManager(option || {});
    }
    return LoggerManager.instance;
  }

  // 通用日志方法
  private log(
    level: LogLevel,
    dataLog: LogData,
    // message?: string,
    // data?: Record<string, any>,
    // error?: Error,
  ) {
    const logData: Record<string, any> = {
      // event,
      // ...(message ? { message } : {}),
      // ...(data ? { ...data } : {}),
      // ...(error
      //   ? {
      //       error: {
      //         name: error.name || 'UnknownError',
      //         message: error.message || 'No error message provided',
      //         stack: error.stack || '',
      //       },
      //     }
      //   : {}),
      ...dataLog,
      name: this.name,
      ID: this.id,
    };

    switch (level) {
      case LogLevel.info:
        this.logger.log(logData, dataLog.event);
        break;
      case LogLevel.warn:
        this.logger.warn(logData, dataLog.event);
        break;
      case LogLevel.error:
        this.logger.error(logData, dataLog.event);
        break;
      case LogLevel.debug:
        this.logger.debug(logData, dataLog.event);
        break;
      case LogLevel.fatal:
        // eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/restrict-template-expressions
        this.logger.error(`[FATAL] ${logData}`, dataLog.event);
        break;
    }
  }

  // 公开日志方法
  public info(body: LogData) {
    this.log(LogLevel.info, body);
  }

  public warn(body: LogData) {
    this.log(LogLevel.warn, body);
  }

  public error(body: LogData) {
    this.log(LogLevel.error, body);
  }

  public debug(body: LogData) {
    this.log(LogLevel.debug, body);
  }

  public fatal(body: LogData) {
    this.log(LogLevel.fatal, body);
  }
}
