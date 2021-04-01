import { Command } from 'nestjs-command';
import { Inject, Injectable } from '@nestjs/common';
import { balances as balancesData} from './balances.data.json';
import { BALANCE_REPOSITORY } from 'src/modules/balance/constants';
import { BalanceModel as Balance } from 'src/modules/balance/balance.model';

@Injectable()
export class BalanceSeeder {
  constructor(
    @Inject(BALANCE_REPOSITORY) private readonly balanceRepo: typeof Balance,
  ) { }

  @Command({ command: 'seeders:balances', describe: 'create balances', autoExit: false })
  async createBalances() {
    try {
      await this.balanceRepo.bulkCreate(balancesData);
      console.log('All balances seeded');
    }
    catch (error) {
      console.error('balances seeder error: ' + error)
    }
  }
}

// to run this seeder only, use: npx nestjs-command seeders:balances
