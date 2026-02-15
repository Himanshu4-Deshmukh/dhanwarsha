import { IsDateString, IsNotEmpty, IsNumber, Min, Max, IsOptional } from 'class-validator';

export class CreateSlotDto {
  @IsDateString()
  @IsNotEmpty()
  startTime: string;

  @IsDateString()
  @IsNotEmpty()
  endTime: string;

  @IsOptional()
  @IsNumber()
  @Min(10)
  betAmount?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  winAmount?: number;
}

export class SetWinningNumberDto {
  @IsNumber()
  @Min(0)
  @Max(99)
  winningNumber: number;
}
