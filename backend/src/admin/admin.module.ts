import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { UsersModule } from '../users/users.module';
import { WalletModule } from '../wallet/wallet.module';
import { WalletTransactionsModule } from '../wallet-transactions/wallet-transactions.module';
import { BetsModule } from '../bets/bets.module';
import { SlotsModule } from '../slots/slots.module';
import { PaymentsModule } from '../payments/payments.module';

@Module({
  imports: [
    UsersModule,
    WalletModule,
    WalletTransactionsModule,
    BetsModule,
    SlotsModule,
    PaymentsModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
