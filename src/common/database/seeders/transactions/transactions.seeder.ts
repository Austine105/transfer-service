import { Command } from 'nestjs-command';
import { Inject, Injectable } from '@nestjs/common';
import { transactions as transactionsData } from './transactions.data.json';
import { TransactionModel as Transaction } from 'src/modules/transaction/transaction.model';
import { TRANSACTION_REPOSITORY } from 'src/modules/transaction/constants';

@Injectable()
export class TransactionSeeder {
  constructor(
    @Inject(TRANSACTION_REPOSITORY) private readonly transactionRepo: typeof Transaction,
  ) { }

  @Command({ command: 'seeders:transactions', describe: 'create transactions', autoExit: false })
  async createTransactions() {
    try {
      await this.transactionRepo.bulkCreate(transactionsData);
      console.log('All transactions seeded');
    }
    catch (error) {
      console.error('transaction seeding error: ' + error)
    }
  }
}
// to run this seeder only, use: npx nestjs-command seeders:transactions
