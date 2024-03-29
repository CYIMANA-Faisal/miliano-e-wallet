import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

/**
 * Service responsible for managing transactions.
 */
@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  /**
   * Creates a new transaction.
   * @param {CreateTransactionDto} createTransactionDto - The DTO containing transaction details.
   * @returns {Promise<void>} Promise indicating the completion of the operation.
   */
  async create(createTransactionDto: CreateTransactionDto): Promise<void> {
    const transaction = this.transactionRepository.create(createTransactionDto);
    await this.transactionRepository.save(transaction);
  }
}
