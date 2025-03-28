import { Module, OnModuleInit } from '@nestjs/common';
import { CasbinAuthService } from './casbin.service';

@Module({
  providers: [CasbinAuthService],
  exports: [CasbinAuthService],
})
export class CasbinModule implements OnModuleInit {
  constructor(private readonly casbinAuthService: CasbinAuthService) {}

  async onModuleInit() {
    await this.casbinAuthService.init();
  }
}
