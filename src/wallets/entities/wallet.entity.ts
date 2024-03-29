import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Audit } from '../../common/utils/audit.entity';
import { User } from '../../users/entities/user.entity';
import { Transaction } from '../../transactions/entities/transaction.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Wallet extends Audit {
  @ApiProperty()
  @Column({ length: 50 })
  name: string;

  @ApiProperty()
  @Column({ type: 'double precision', default: 0.0 })
  balance: number;

  @ApiProperty()
  @Column({ length: 3, default: 'RWF' })
  currency: string;

  @ManyToOne(() => User, (user) => user.wallets)
  user: User;

  @ApiProperty()
  @OneToMany(() => Transaction, (transaction) => transaction.wallet)
  transactions: Transaction[];
}
