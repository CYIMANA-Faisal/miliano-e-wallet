import { Module, forwardRef } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { WalletsModule } from '../wallets/wallets.module';

/**
 * Module responsible for managing transactions.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]), // Importing the Transaction entity into the module
    forwardRef(() => WalletsModule), // Importing the WalletsModule to handle circular dependencies
  ],
  controllers: [TransactionsController], // Registering the TransactionsController within the module
  providers: [TransactionsService], // Registering the TransactionsService within the module
  exports: [TransactionsService], // Exporting the TransactionsService to be available for dependency injection in other modules
})
export class TransactionsModule {}
