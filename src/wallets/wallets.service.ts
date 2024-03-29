import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { Wallet } from './entities/wallet.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { TransferDto } from './dto/transfer.dto';
import { TransactionsService } from '../transactions/transactions.service';
import { TransactionType } from '../transactions/enums/transaction-type.enum';

/**
 * Service responsible for handling wallet-related operations.
 * @public
 */
@Injectable()
export class WalletsService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    private readonly transactionService: TransactionsService,
  ) {}

  /**
   * Creates a new wallet for the specified user.
   * @param {User} user - The user for whom the wallet is created.
   * @param {CreateWalletDto} createWalletDto - The data to create the wallet.
   * @returns {Promise<Wallet>} The created wallet.
   */
  async create(user: User, createWalletDto: CreateWalletDto): Promise<Wallet> {
    try {
      const wallet = this.walletRepository.create({
        ...createWalletDto,
        user: user,
      });
      const savedWallet = await this.walletRepository.save(wallet);

      // record the transaction
      if (createWalletDto.balance > 0.0) {
        await this.transactionService.create({
          type: TransactionType.Credit,
          amount: createWalletDto.balance,
          wallet: savedWallet,
        });
      }
      return savedWallet;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves all wallets.
   * @returns {Promise<Wallet[]>} An array of all wallets.
   */
  async findAll(): Promise<Wallet[]> {
    try {
      return await this.walletRepository.find({
        where: { deletedAt: null },
        relations: ['user'],
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves a wallet by its ID.
   * @param {number} id - The ID of the wallet to retrieve.
   * @returns {Promise<Wallet>} The retrieved wallet.
   * @throws {NotFoundException} Thrown if the wallet with the specified ID is not found.
   */
  async findOne(id: number): Promise<Wallet> {
    const wallet = await this.walletRepository.findOne({
      where: { id },
      relations: ['transactions'],
    });
    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }
    return wallet;
  }

  /**
   * Increases the balance of the specified wallet by the specified amount.
   * @param {number} walletId - The ID of the wallet to top up.
   * @param {number} amount - The amount to add to the wallet's balance.
   * @returns {Promise<Wallet>} The updated wallet.
   * @throws {NotFoundException} Thrown if the wallet with the specified ID is not found.
   */
  async topUp(walletId: number, amount: number): Promise<Wallet> {
    const wallet = await this.walletRepository.findOne({
      where: { id: walletId },
    });
    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    wallet.balance += amount;
    await this.walletRepository.save(wallet);

    // record the transaction
    await this.transactionService.create({
      type: TransactionType.Credit,
      amount,
      wallet,
    });

    return wallet;
  }

  /**
   * Transfer money from one wallet to another.
   * Both wallets must have the same currency.
   * @param {User} user - The authenticated user initiating the transfer.
   * @param {TransferDto} transferDto - DTO containing transfer details.
   * @returns {Promise<Wallet>}
   * @throws {BadRequestException} Thrown if the wallets have different currencies.
   * @throws {UnprocessableEntityException} Thrown if the source wallet has insufficient balance.
   */
  async transfer(user: User, transferDto: TransferDto): Promise<Wallet> {
    const sourceWallet = await this.walletRepository.findOne({
      where: { id: transferDto.sourceWalletId },
      relations: ['user'],
    });
    if (sourceWallet.user.id !== user.id) {
      throw new BadRequestException(
        'You can only transfer from your own wallet',
      );
    }
    const targetWallet = await this.walletRepository.findOne({
      where: { id: transferDto.destinationWalletId },
    });

    // Check if both wallets have the same currency
    if (sourceWallet.currency !== targetWallet.currency) {
      throw new BadRequestException(
        'Both wallets must have the same currency for the transfer',
      );
    }

    // Check if the source wallet has sufficient balance
    if (sourceWallet.balance < transferDto.amount) {
      throw new UnprocessableEntityException(
        'Source wallet has insufficient balance for the transfer',
      );
    }

    // Perform the transfer operation
    sourceWallet.balance -= transferDto.amount;
    targetWallet.balance += transferDto.amount;

    // Save the updated balances
    await this.walletRepository.save([sourceWallet, targetWallet]);

    // record the transaction
    await this.transactionService.create({
      type: TransactionType.Debit,
      amount: transferDto.amount,
      wallet: sourceWallet,
    });

    await this.transactionService.create({
      type: TransactionType.Credit,
      amount: transferDto.amount,
      wallet: targetWallet,
    });

    return sourceWallet;
  }
}
