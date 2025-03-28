import { Body, Controller, Post, Put, Request } from '@nestjs/common';
import { AccountService } from './account.service';
import { CustomError } from '../../config/commonException';

@Controller('account')
export class AccountController {
  constructor(private accountService: AccountService) {}
  async AccountList() {
    try {
      return await this.accountService.AccountList();
    } catch (error: any) {
      console.log(error);
      throw error;
    }
  }

  @Post('/login')
  async Login(@Body() body: Record<string, string>) {
    try {
      return await this.accountService.Login(body);
    } catch (error: any) {
      console.log(error);
      throw error;
    }
  }

  @Put('/refresh/token')
  async RefreshToken(@Request() req: any) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const acc = req['acc'];
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      if (!acc) throw new CustomError('token不存在');
      return await this.accountService.RefreshToken(acc);
    } catch (error: unknown) {
      if (error instanceof CustomError) console.log(error.message);
      console.log(error);
      throw error;
    }
  }
}
