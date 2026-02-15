import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard, RolesGuard } from '../common/guards';
import { Roles } from '../common/decorators';
import { Role } from '../common/enums';
import { CreditWalletDto } from './dto/admin.dto';
import { UpdatePaymentRequestDto } from '../payments/dto/create-payment-request.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  async getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Get('bets')
  async getAllBets() {
    return this.adminService.getAllBets();
  }

  @Get('transactions')
  async getAllTransactions() {
    return this.adminService.getAllTransactions();
  }

  @Get('payment-requests')
  async getAllPaymentRequests() {
    return this.adminService.getAllPaymentRequests();
  }

  @Post('payment-requests/:id/approve')
  async approvePayment(@Param('id') id: string, @Body() dto: UpdatePaymentRequestDto) {
    return this.adminService.approvePayment(id, dto.adminRemark);
  }

  @Post('payment-requests/:id/reject')
  async rejectPayment(@Param('id') id: string, @Body() dto: UpdatePaymentRequestDto) {
    return this.adminService.rejectPayment(id, dto.adminRemark);
  }

  @Post('credit-wallet')
  async creditWallet(@Body() creditWalletDto: CreditWalletDto) {
    return this.adminService.creditWallet(creditWalletDto);
  }

  @Get('slots/:id/profit')
  async getSlotProfit(@Param('id') id: string) {
    return this.adminService.getSlotProfit(id);
  }
}
