import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { WalletService } from '../wallet/wallet.service';
import { WalletTransactionsService } from '../wallet-transactions/wallet-transactions.service';
import { BetsService } from '../bets/bets.service';
import { SlotsService } from '../slots/slots.service';
import { PaymentsService } from '../payments/payments.service';
import { CreditWalletDto } from './dto/admin.dto';
import { TransactionType } from '../common/enums';

@Injectable()
export class AdminService {
  constructor(
    private usersService: UsersService,
    private walletService: WalletService,
    private walletTransactionsService: WalletTransactionsService,
    private betsService: BetsService,
    private slotsService: SlotsService,
    private paymentsService: PaymentsService,
  ) {}

  async getAllUsers() {
    return this.usersService.findAll();
  }

  async getAllBets() {
    return this.betsService.getAllBets();
  }

  async getAllTransactions() {
    return this.walletTransactionsService.getAllTransactions();
  }

  async getAllPaymentRequests() {
    return this.paymentsService.getAllRequests();
  }

  async approvePayment(requestId: string, adminRemark: string) {
    return this.paymentsService.approve(requestId, adminRemark);
  }

  async rejectPayment(requestId: string, adminRemark: string) {
    return this.paymentsService.reject(requestId, adminRemark);
  }

  async creditWallet(creditWalletDto: CreditWalletDto) {
    return this.walletService.credit(
      creditWalletDto.userId,
      creditWalletDto.amount,
      TransactionType.ADMIN_CREDIT,
    );
  }

  async getSlotProfit(slotId: string) {
    const bets = await this.betsService.getSlotBets(slotId);
    const slot = await this.slotsService.findById(slotId);

    let totalBetAmount = 0;
    let totalPayout = 0;

    bets.forEach((bet) => {
      totalBetAmount += bet.amount;
      if (bet.number === slot.winningNumber) {
        totalPayout += slot.winAmount;
      }
    });

    const profit = totalBetAmount - totalPayout;

    return {
      slotId,
      totalBets: bets.length,
      totalBetAmount,
      totalPayout,
      profit,
    };
  }
}
