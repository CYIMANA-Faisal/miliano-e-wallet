import { Module, forwardRef } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { WalletsController } from './wallets.controller';
import { Wallet } from './entities/wallet.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsService } from '../transactions/transactions.service';
import { TransactionsModule } from '../transactions/transactions.module';
import { Transaction } from '../transactions/entities/transaction.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wallet, Transaction]),
    forwardRef(() => TransactionsModule),
  ],
  controllers: [WalletsController],
  providers: [WalletsService, TransactionsService],
})
export class WalletsModule {}
