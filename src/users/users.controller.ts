import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';

/**
 * Controller responsible for handling user-related endpoints.
 * @remarks
 * This controller provides endpoints for user management.
 * @public
 */
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
}
