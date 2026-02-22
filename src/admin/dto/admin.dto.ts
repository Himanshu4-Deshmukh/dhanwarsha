import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreditWalletDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsNumber()
  @Min(1)
  amount: number;
}
