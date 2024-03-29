import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { BcryptService } from '../common/services/bcrypt.service';
import { ConfigService } from '@nestjs/config';
import { UserRole } from '../users/enums/role.enum';
import { User } from '../users/entities/user.entity';

@Injectable()
export class UserSeedService {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly bcryptService: BcryptService,
    public readonly configService: ConfigService,
  ) {}

  async createSuperAdminUser(): Promise<void> {
    const superAdminEmail = this.configService.get('SUPER_ADMIN_EMAIL');
    const existingUser = await this.entityManager.findOne(User, {
      where: { email: superAdminEmail },
    });

    if (existingUser) {
      return;
    }

    const user = new User();
    user.email = superAdminEmail;
    user.password = await this.bcryptService.hash(
      this.configService.get('SUPER_ADMIN_PASSWORD'),
    );
    user.role = UserRole.superadmin;
    user.isActive = true;
    user.name = 'Super Admin';
    user.phoneNumber = this.configService.get('SUPER_ADMIN_PHONE_NUMBER');

    await this.entityManager.save(User, user);
  }

  async createHelpSupportUser() {
    const helpSupportEmail = this.configService.get('HELP_SUPPORT_EMAIL');
    const existingUser = await this.entityManager.findOne(User, {
      where: { email: helpSupportEmail },
    });

    if (existingUser) {
      return;
    }

    const user = new User();
    user.email = helpSupportEmail;
    user.password = await this.bcryptService.hash(
      this.configService.get('HELP_SUPPORT_PASSWORD'),
    );
    user.role = UserRole.helpsupport;
    user.isActive = true;
    user.name = 'Help Support';
    user.phoneNumber = this.configService.get('HELP_SUPPORT_PHONE_NUMBER');

    await this.entityManager.save(User, user);
  }
}
