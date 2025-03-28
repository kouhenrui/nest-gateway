import {
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationPipe,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { TransformInterceptor } from 'src/middleware/transform.interceptor';
import { AllExceptionsFilter } from 'src/middleware/exception.filter';
import { CustomException } from 'src/config/commonException';
// import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from '@nestjs-modules/ioredis';
// import { I18nModule } from 'nestjs-i18n';
// import { ConfigService } from '@nestjs/config';
import { CasbinAuthService } from '../casbin/casbin.service';
import { HttpModule } from '@nestjs/axios';
import { AuthGuard } from 'src/middleware/auth.guard';
import { JwtService } from '@nestjs/jwt';
// import { Account } from '../../entities/account.entity';
import config from '../../config/config';
import { RedisService } from '../redis/redis.service';
// import { JwtMiddleware } from '../../middleware/jwt.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 如果希望全局可用配置，可以设置为 true
      load: [config],
    }),
    // 主数据库连接
    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: (configService: ConfigService) => ({
    //     name: 'main', // 连接名
    //     type: 'mysql',
    //     host: configService.get<string>('DATABASE_HOST'),
    //     port: configService.get<number>('DATABASE_PORT'),
    //     username: configService.get<string>('DATABASE_USERNAME'),
    //     password: configService.get<string>('DATABASE_PASSWORD'),
    //     database: configService.get<string>('DATABASE_NAME'),
    //     entities: [__dirname + '/../../entities/*.entity{.ts,.js}'], //[../../entities], // 你的实体类
    //     synchronize: true, // 根据需要开启同步
    //     // autoLoadEntities: true,
    //     extra: {
    //       connectionLimit: 10, // 设置最大连接数
    //     },
    //   }),
    //   inject: [ConfigService],
    // }),
    // TypeOrmModule.forFeature([Account]), // 注册 Account 实体
    // 日志数据库连接
    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: (configService: ConfigService) => ({
    //     name: 'log', // 连接名
    //     type: 'mysql',
    //     host: configService.get<string>('LOG_DATABASE_HOST'),
    //     port: configService.get<number>('LOG_DATABASE_PORT'),
    //     username: configService.get<string>('LOG_DATABASE_USERNAME'),
    //     password: configService.get<string>('LOG_DATABASE_PASSWORD'),
    //     database: configService.get<string>('LOG_DATABASE_NAME'),
    //     entities: [], // 你的日志数据库实体
    //     synchronize: true, // 根据需要开启同步
    //     extra: {
    //       connectionLimit: 10, // 设置最大连接数
    //     },
    //   }),
    //   inject: [ConfigService],
    // }),
    //redis连接
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'single',
        url: `${configService.get<string>('REDIS_HOST')}:${configService.get<number>('REDIS_PORT')}`,
        options: {
          db: 0, // Redis database index
          // username: configService.get<string>('REDIS_USERNAME'),
          // password: configService.get<string>('REDIS_PASSWORD'), // If applicable
          ttl: 3600, // Optional: Set TTL (time to live) for cache
        },
      }),
      inject: [ConfigService],
    }),

    // CasbinModule.forRootAsync({
    //   useFactory: () => ({
    //     model: 'path/to/model.conf', // Casbin 模型文件路径
    //     adapter: 'redis', // 使用 Redis 作为适配器
    //     adapterConfig: {
    //       host: 'localhost',
    //       port: 6379,
    //     },
    //   }),
    // }),

    //http请求
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5,
      }),
    }),
    // I18nModule.forRootAsync({
    //   name: 'i18n',
    //   useFactory: (configService: ConfigService) => ({
    //     fallbackLanguage: configService.get<string>('I18N_FALLBACK_LANGUAGE'),
    //     loaderOptions: {
    //       path: path.join(__dirname, '../../i18n/'),
    //       watch: true,
    //     },
    //   }),
    //   inject: [ConfigService],
    // }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtService, //jwt生成验证
    RedisService, //redis服务
    CasbinAuthService, //权限操作服务
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: APP_FILTER,
      useClass: CustomException, //使用异常抛出
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor, //统一返回格式
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter, //错误捕捉拦截
    },
    { provide: APP_GUARD, useClass: AuthGuard },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply() // 应用 jwt全局 中间件JwtMiddleware
      .forRoutes('*'); // 将其应用到所有路由
  }
}
