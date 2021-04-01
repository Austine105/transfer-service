import { Module } from '@nestjs/common';
import { BalanceController } from './balance.controller';
import { BalanceService } from './balance.service';
import { BalanceProvider } from './balance.provider';

@Module({
  imports: [],
  providers: [BalanceService, ...BalanceProvider],
  controllers: [BalanceController],
  exports: [BalanceService, ...BalanceProvider]
})
export class BalanceModule {}
