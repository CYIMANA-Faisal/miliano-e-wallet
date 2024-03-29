import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ApiResponse } from '../common/interfaces/api-response.interface';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/entities/user.entity';
import { Token } from './interfaces/token.interface';
import { ApiTags } from '@nestjs/swagger';

/**
 * Controller responsible for handling authentication-related endpoints.
 * @remarks
 * This controller provides endpoints for user registration and login.
 * @public
 */
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Endpoint for user registration.
   * @param userInfo - Information required for user registration.
   * @returns A promise resolving to an API response containing registered user data.
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() userInfo: CreateUserDto): Promise<ApiResponse<User>> {
    const payload = await this.authService.register(userInfo);
    return { message: 'Registered successfully', data: payload };
  }

  /**
   * Endpoint for user login.
   * @param loginDto - Information required for user login.
   * @returns A promise resolving to an API response containing authentication token.
   */
  @Post('login')
  @HttpCode(HttpStatus.CREATED)
  async login(@Body() loginDto: LoginDto): Promise<ApiResponse<Token>> {
    const payload = await this.authService.login(loginDto);
    return { message: 'Login successfully', data: payload };
  }
}
