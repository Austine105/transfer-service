import { Sequelize } from 'sequelize-typescript';
import { BalanceModel } from 'src/modules/balance/balance.model';
import { TransactionModel } from 'src/modules/transaction/transaction.model';
import { configService } from '../config/config.service';
import { SEQUELIZE } from '../constants';


export const databaseProviders = [
    {
        provide: SEQUELIZE,
        useFactory: async () => {
          const sequelize = new Sequelize(configService.getDatabaseUrl(), { ssl: true });
            sequelize.addModels([BalanceModel, TransactionModel]);
            await sequelize.sync();
            return sequelize;
        },
    },
];
