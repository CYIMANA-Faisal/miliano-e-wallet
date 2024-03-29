import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Matches } from 'class-validator';

export class CreateWalletDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  balance: number;

  @ApiProperty()
  @IsNotEmpty()
  @Matches(/^(USD|RWF|EUR|)$/)
  currency: string;
}
