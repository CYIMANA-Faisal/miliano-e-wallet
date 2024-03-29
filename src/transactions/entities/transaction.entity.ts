import { Column, Entity, ManyToOne } from 'typeorm';
import { Audit } from '../../common/utils/audit.entity';
import { TransactionType } from '../enums/transaction-type.enum';
import { Wallet } from '../../wallets/entities/wallet.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Transaction extends Audit {
  @ApiProperty()
  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @ApiProperty()
  @Column({ type: 'double precision', default: 0.0 })
  amount: number;

  @ApiProperty()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  @ManyToOne(() => Wallet, (wallet) => wallet.transactions)
  wallet: Wallet;
}
