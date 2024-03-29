import { Column, Entity, OneToMany, Unique } from 'typeorm';
import { UserRole } from '../enums/role.enum';
import { Audit } from '../../common/utils/audit.entity';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Wallet } from '../../wallets/entities/wallet.entity';

@Entity()
@Unique(['email'])
export class User extends Audit {
  @ApiProperty()
  @Column({ nullable: false })
  name: string;

  @ApiProperty()
  @Column({ nullable: false })
  email: string;

  @ApiProperty()
  @Column({ nullable: false })
  phoneNumber: string;

  @Column({ nullable: false })
  @Exclude()
  password: string;

  @ApiProperty()
  @Column({ default: true, type: 'boolean', nullable: false })
  isActive: boolean;

  @ApiProperty()
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.customer,
    nullable: false,
  })
  role: UserRole;

  @OneToMany(() => Wallet, (wallet) => wallet.user)
  wallets: Wallet[];
}
