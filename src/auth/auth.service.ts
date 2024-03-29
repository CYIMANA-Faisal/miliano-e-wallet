import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { BcryptService } from '../common/services/bcrypt.service';
import { TokenPayload } from './interfaces/jwt.payload.interface';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { UserRole } from '../users/enums/role.enum';
import { Token } from './interfaces/token.interface';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';

/**
 * Service responsible for authentication-related operations.
 * @remarks
 * This service handles user registration, login, and token generation.
 * @public
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly bcryptService: BcryptService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Registers a new user.
   * @param userInfo - Information required for user registration.
   * @returns A promise resolving to the created user.
   */
  async register(userInfo: CreateUserDto): Promise<User> {
    userInfo.password = await this.bcryptService.hash(userInfo.password);
    const createdUser = await this.userService.create(userInfo);
    return createdUser;
  }

  /**
   * Logs in a user.
   * @param loginDto - Information required for user login.
   * @returns A promise resolving to a token for authentication.
   * @throws UnauthorizedException - If credentials are invalid.
   */
  async login(loginDto: LoginDto): Promise<Token> {
    const user = await this.userService.findUserByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Unvalid credentials, Please try again');
    } else {
      const isValidPassword = await this.bcryptService.compare(
        loginDto.password,
        user.password,
      );
      if (!isValidPassword) {
        throw new UnauthorizedException(
          'Unvalid credentials! Please try again',
        );
      } else {
        const tokens = {
          accessToken: await this.generateJwtAccessToken(user.id, user.role),
        };
        return tokens;
      }
    }
  }

  /**
   * Generates a JWT access token for a user.
   * @param userId - ID of the user.
   * @param role - Role of the user.
   * @returns A promise resolving to the JWT access token.
   */
  async generateJwtAccessToken(
    userId: number,
    role: UserRole,
  ): Promise<string> {
    const payload: TokenPayload = { id: userId, role: role };
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get<string>(
        'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
      ),
      algorithm: 'RS256',
    });
    return token;
  }
}
