import { Column, ForeignKey, HasMany, Table } from 'sequelize-typescript';
import { BaseModel } from 'src/common/database/models/base.model';
import { TransactionModel } from '../transaction/transaction.model';

@Table({
  tableName: 'balances',
  timestamps: true,
  paranoid: true
})

export class BalanceModel extends BaseModel {

  @Column({
    allowNull: false
  })
  balance: number

  @ForeignKey(() => TransactionModel)
  @Column({
    allowNull: false,
    unique: true
  })
  account_nr: string

  // associations
  // @HasMany(() => TransactionModel, 'account_nr')
  transactions: TransactionModel;
}
