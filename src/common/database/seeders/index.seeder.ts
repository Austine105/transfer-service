import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { BalanceSeeder } from './balance/balances.seeder';
import { TransactionSeeder } from './transactions/transactions.seeder';

@Injectable()
export class Seeder {
  constructor(
    private readonly balanceSeeder: BalanceSeeder,
    private readonly transactionSeeder: TransactionSeeder
  ) { }

  @Command({ command: 'seeders:all', describe: 'Run All Seeders', autoExit: true })
  async runAllSeeders() {
    console.log('Starting Seeder..');

    // create balances
    await this.balanceSeeder.createBalances();
    // create transactions
    await this.transactionSeeder.createTransactions();

    console.log('Seeders Completed!');
  }
}
