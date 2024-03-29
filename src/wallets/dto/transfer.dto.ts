import { IsNotEmpty, IsNumber } from 'class-validator';

export class TransferDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsNumber()
  sourceWalletId: number;

  @IsNotEmpty()
  @IsNumber()
  destinationWalletId: number;
}
