//  敏感信息枚举类型
const enum sensitive {
  phone = 'phone',
  email = 'email',
  idCard = 'idCard',
  bankCard = 'bankCard',
  name = 'name',
}

const enum CaptchaType {
  ALPHANUMERIC = 'alphanumeric', // 字母+数字
  NUMERIC = 'numeric', // 纯数字
  MATH = 'math', // 数学计算
}

interface JwtClaims {
  id: number;
  role: string;
  name?: string;
  phone?: string;
}

interface LoggerOptions {
  name: string;
  id: string;
  context?: string;
}

const enum LogLevel {
  info = 'info',
  warn = 'warn',
  error = 'error',
  debug = 'debug',
  fatal = 'fatal',
}
//日志内容
interface Log {
  logger: string; // 日志记录器名称
  ID: string; //日志ID
  level: LogLevel; //'info' | 'warn' | 'error' | 'debug' | 'fatal'; // 日志级别，严格限定为固定值
  timestamp: string; // 时间戳，使用 ISO 8601 格式的字符串
  event: string; // 必填字段，记录事件的名称
  message?: string; // 必填字段，描述日志的主要信息
  data?: Record<string, any>; // 可选字段，记录附加的数据结构
  error?: {
    name?: string; // 错误名称
    message?: string; // 错误信息
    stack?: string; // 错误堆栈
  }; // 可选字段，用于记录错误信息
  ip?: string; // 可选字段，记录 IP 地址
  metadata?: Record<string, any>; // 可选字段，用于存储额外的上下文信息
  requestId?: string; // 可选字段，用于追踪请求 ID
  userId?: string; // 可选字段，记录用户标识
}
export { sensitive, CaptchaType, JwtClaims, LoggerOptions, Log, LogLevel };
