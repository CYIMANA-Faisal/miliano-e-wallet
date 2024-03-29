import { TransactionType } from '../enums/transaction-type.enum';
import { Wallet } from '../../wallets/entities/wallet.entity';

export class CreateTransactionDto {
  type: TransactionType;
  amount: number;
  wallet: Wallet;
}
