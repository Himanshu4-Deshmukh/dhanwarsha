import { Controller, Get, UseGuards } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from '../common/guards';
import { CurrentUser } from '../common/decorators';

@Controller('wallet')
@UseGuards(JwtAuthGuard)
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get()
  async getWallet(@CurrentUser() user: any) {
    return this.walletService.getWallet(user.userId);
  }

  @Get('balance')
  async getBalance(@CurrentUser() user: any) {
    const balance = await this.walletService.getBalance(user.userId);
    return { balance };
  }
}
