import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { TransactionModule } from 'src/modules/transaction/transaction.module';
import { Seeder } from './index.seeder';
import { BalanceSeeder } from './balance/balances.seeder';
import { TransactionSeeder } from './transactions/transactions.seeder';
import { BalanceModule } from 'src/modules/balance/balance.module';

@Module({
  imports: [CommandModule, BalanceModule, TransactionModule],
  providers: [Seeder, BalanceSeeder, TransactionSeeder],
  exports: [BalanceSeeder],
})
export class SeederModule { }
