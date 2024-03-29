import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserRole } from './enums/role.enum';

/**
 * Service responsible for user management operations.
 * @remarks
 * This service provides functionality for creating and finding users.
 * @public
 */
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  /**
   * Creates a new user.
   * @param createUserDto - Information required for user creation.
   * @returns A promise resolving to the created user.
   * @throws ConflictException - If a user with the provided email already exists.
   */
  async create(createUserDto: CreateUserDto) {
    const userExist = await this.findUserByEmail(createUserDto.email);
    if (userExist) {
      throw new ConflictException('User with this email already exists');
    } else {
      try {
        const user = await this.usersRepository.save({
          ...createUserDto,
          isActive: false,
          role: UserRole.customer,
        });
        return user;
      } catch (error) {
        throw error;
      }
    }
  }

  /**
   * Finds a user by email.
   * @param email - Email of the user to find.
   * @returns A promise resolving to the user found by the email.
   */
  async findUserByEmail(email: string): Promise<User> {
    return await this.usersRepository.findOne({ where: { email: email } });
  }
}
