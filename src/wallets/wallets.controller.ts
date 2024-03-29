import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { GetUser } from '../common/decorators/user.decorator';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../users/enums/role.enum';
import { Roles } from '../common/decorators/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { ApiResponse } from '../common/interfaces/api-response.interface';
import { Wallet } from './entities/wallet.entity';
import { TopupDto } from './dto/topup.dto';
import { TransferDto } from './dto/transfer.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

/**
 * Controller responsible for handling wallet-related endpoints.
 * @public
 */
@ApiTags('wallets')
@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  /**
   * Endpoint to create a new wallet.
   * @param {User} user - The authenticated user.
   * @param {CreateWalletDto} createWalletDto - The data to create the wallet.
   * @returns {Promise<ApiResponse<Wallet>>} A response containing the created wallet.
   */
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Wallet added successfully', type: Wallet })
  @ApiBadRequestResponse({ description: 'Invalid data provided' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRole.customer)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async create(
    @GetUser() user: User,
    @Body() createWalletDto: CreateWalletDto,
  ): Promise<ApiResponse<Wallet>> {
    const payload = await this.walletsService.create(user, createWalletDto);
    return { message: 'Wallet added successfully', data: payload };
  }

  /**
   * Endpoint to retrieve all wallets.
   * @returns {Promise<ApiResponse<Wallet[]>>} A response containing the retrieved wallets.
   */
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Wallets retrieved successfully',
    type: Wallet,
    isArray: true,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @Get()
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.superadmin, UserRole.helpsupport)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async findAll(): Promise<ApiResponse<Wallet[]>> {
    const payload = await this.walletsService.findAll();
    return { message: 'Wallets retrieved successfully', data: payload };
  }

  /**
   * Endpoint to retrieve a specific wallet by ID.
   * @param {string} id - The ID of the wallet to retrieve.
   * @returns {Promise<ApiResponse<Wallet>>} A response containing the retrieved wallet.
   */
  @ApiOkResponse({ description: 'Wallet retrieved successfully', type: Wallet })
  @ApiNotFoundResponse({ description: 'Wallet not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiParam({ name: 'id', type: 'integer', description: 'ID of the wallet' })
  @ApiBearerAuth()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  async findOne(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<ApiResponse<Wallet>> {
    const payload = await this.walletsService.findOne(+id);
    return { message: 'Wallet retrieved successfully', data: payload };
  }

  /**
   * Endpoint to top up the balance of a wallet.
   * @param {number} id - The ID of the wallet to top up.
   * @param {TopupDto} topupDto - DTO containing the amount to be topped up.
   * @returns {Promise<ApiResponse<Wallet>>} A response containing the updated wallet.
   */
  @ApiOkResponse({
    description: 'Wallet balance topped up successfully',
    type: Wallet,
  })
  @ApiBadRequestResponse({ description: 'Invalid data provided' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'ID of the wallet to top up',
  })
  @ApiBearerAuth()
  @Patch(':id/topup')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.customer)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async topUp(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() topupDto: TopupDto,
  ): Promise<ApiResponse<Wallet>> {
    const wallet = await this.walletsService.topUp(id, topupDto.amount);
    return { message: 'Wallet balance topped up successfully', data: wallet };
  }

  /**
   * Endpoint to transfer money from one wallet to another.
   * Both wallets must have the same currency.
   * @param {TransferDto} transferDto - DTO containing transfer details.
   * @returns {Promise<ApiResponse<any>>} A response indicating the success of the transfer.
   */
  @ApiOkResponse({
    description: 'Money transferred successfully',
    type: Wallet,
  })
  @ApiBadRequestResponse({ description: 'Invalid data provided' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBearerAuth()
  @Patch('transfer')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.customer)
  @UseGuards(AuthGuard('jwt'))
  async transfer(
    @GetUser() user: User,
    @Body() transferDto: TransferDto,
  ): Promise<ApiResponse<Wallet>> {
    const payload = await this.walletsService.transfer(user, transferDto);
    return { message: 'Money transferred successfully', data: payload };
  }
}
