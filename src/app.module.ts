import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { DatabaseModule } from './common/database/database.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { AllExceptionsFilter } from './common/exception/http-exception.filter';
import { BalanceModule } from './modules/balance/balance.module';
import { SeederModule } from './common/database/seeders/seeder.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    BalanceModule,
    TransactionModule,
    SeederModule
  ],
  providers: [AllExceptionsFilter],
  controllers: [AppController]
})
export class AppModule {}
