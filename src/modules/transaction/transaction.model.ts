import { BelongsTo, Column, ForeignKey, HasOne, Index, Table } from 'sequelize-typescript';
import { BaseModel } from 'src/common/database/models/base.model';
import { BalanceModel } from '../balance/balance.model';

@Table({
  tableName: 'transactions',
  timestamps: true,
  paranoid: true
})

export class TransactionModel extends BaseModel {
  @Index
  @Column({
    allowNull: false,
    unique: true
  })
  reference: string

  @Column({
    allowNull: false
  })
  amount: number

  @Index
  @ForeignKey(() => BalanceModel)
  @Column({
    allowNull: false
  })
  account_nr: string

  // associations
  @BelongsTo(() => BalanceModel, 'account_nr')
  balance: BalanceModel
}
