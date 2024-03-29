import { IsNotEmpty, IsNumber } from 'class-validator';

export class TopupDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
