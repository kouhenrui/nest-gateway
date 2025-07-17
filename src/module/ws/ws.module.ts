import { Module } from '@nestjs/common';
// import { WsGateway } from './ws.gateway';
import { WsService } from './ws.service';

@Module({
  providers: [WsService],
})
export class WsModule {}
