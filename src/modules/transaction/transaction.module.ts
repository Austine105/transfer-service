import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { TransactionProvider } from './transaction.provider';
import { BullModule } from '@nestjs/bull';
import { BalanceModule } from '../balance/balance.module';
import { TransactionProcessor } from './queue/transaction.processor';

@Module({
  imports: [
    BalanceModule,
    BullModule.registerQueue({
      name: 'transactions',
    }),
  ],
  providers: [TransactionService, ...TransactionProvider, TransactionProcessor],
  controllers: [TransactionController],
  exports: [...TransactionProvider]
})
export class TransactionModule {}
