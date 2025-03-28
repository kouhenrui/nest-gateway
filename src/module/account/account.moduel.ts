import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '../../entities/account.entity';
import { AccountController } from './account.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account]), // 注册 Account 实体
  ],
  controllers: [AccountController],
  providers: [],
})
export class AccountModule {}
