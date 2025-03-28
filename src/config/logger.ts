import { Log, LoggerOptions, LogLevel } from './common';
import {
  createLogger,
  format,
  transports,
  Logger as WinstonLogger,
} from 'winston';

export class loggerManager {
  private logger: Logger;

  constructor(option: LoggerOptions) {
    this.logger = new Logger(option);
  }

  // 获取单例实例
  //   public static getInstance(option?: LoggerOptions): LoggerManager {
  //     if (!LoggerManager.instance) {
  //       LoggerManager.instance = new LoggerManager(option || {});
  //     }
  //     return LoggerManager.instance;
  //   }

  public async info(
    event: string,
    message?: string,
    data?: Record<string, any>,
  ): Promise<void> {
    await this.logger.log(LogLevel.info, event, message, data);
  }
  public async warn(
    event: string,
    message?: string,
    data?: Record<string, any>,
  ): Promise<void> {
    await this.logger.log(LogLevel.warn, event, message, data); // await this.logger.warn(event, message, data);
  }
  public async error(
    event: string,
    message?: string,
    error?: Error,
    data?: Record<string, any>,
  ): Promise<void> {
    await this.logger.log(LogLevel.error, event, message, data, error);
  }
  public async debug(
    event: string,
    message?: string,
    data?: Record<string, any>,
  ): Promise<void> {
    await this.logger.log(LogLevel.debug, event, message, data);
  }
  public async fatal(
    event: string,
    message?: string,
    data?: Record<string, any>,
  ): Promise<void> {
    await this.logger.log(LogLevel.fatal, event, message, data);
  }
}

// 日志实现类
class Logger {
  private logger: WinstonLogger;
  private name: string;
  private id: string;

  constructor(option: LoggerOptions) {
    this.id = option.id;
    this.name = option.name;
    // 初始化 winston 日志
    this.logger = createLogger({
      level: 'info',
      format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.json(),
      ),
      transports: [new transports.Console()],
    });
  }

  // 格式化日志
  private formatLog(
    level: LogLevel,
    event: string,
    message?: string,
    data?: Record<string, any>,
    error?: Error,
  ): Log {
    return {
      logger: this.name,
      ID: this.id,
      level: level,
      timestamp: new Date().toISOString(),
      event,
      message,
      data,
      error: error
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
          }
        : undefined,
    };
  }

  // 日志写入队列
  public async log(
    level: LogLevel,
    event: string,
    message?: string,
    data?: Record<string, any>,
    error?: Error,
  ): Promise<void> {
    const logEntry = this.formatLog(level, event, message, data, error);
    // eslint-disable-next-line @typescript-eslint/await-thenable
    await this.logger.log(level, logEntry);
  }
}
