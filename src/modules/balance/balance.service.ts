import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { FindOptions } from 'sequelize';
import { BalanceModel as Balance } from './balance.model';
import { FindAllQueryInterface } from 'src/common/interface/find-query.interface';
import { pagingParser } from 'src/common/utils/paging-parser';
import { BALANCE_REPOSITORY, ERROR_MESSAGES } from './constants';
import { NewBalanceDto } from './dto/new-balance.dto';

@Injectable()
export class BalanceService {
  constructor(
    @Inject(BALANCE_REPOSITORY) private readonly balanceRepo: typeof Balance,
  ) { }

  async create(newBalance: NewBalanceDto): Promise<Balance> {
    return this.balanceRepo.create(newBalance);
  }

  async findAll(params): Promise<FindAllQueryInterface<Balance>> {
    const query: FindOptions = {
      limit: params.limit,
      offset: params.skip,
      order: params.order,
      attributes: {
        exclude: ['deleted_at']
      },
      where: {
        ...params.where
      }
    };

    const balances = await this.balanceRepo.findAndCountAll(query);
    const paging = pagingParser(query, balances.count, balances.rows.length);

    return {
      paging,
      data: balances.rows
    };
  }

  async findOne(account_nr: string): Promise<Balance> {
    const balance = await this.balanceRepo.findOne({
      where: {
        account_nr: account_nr
      },
      attributes: {
        exclude: ['deleted_at']
      },
    });
    if (!balance)
      throw new BadRequestException(ERROR_MESSAGES.BalanceNotFound);

    return balance;
  }

  // !!!
  // The following methods should only be called from Job Queue Processors

  async credit(account_nr: string, amount: number, transactionHost: any): Promise<Balance> {
    const bal = await this.findOne(account_nr);
    bal.balance = bal.balance + amount;

    return bal.save(transactionHost);
  }

  async debit(account_nr: string, amount: number, transactionHost): Promise<Balance> {
    const bal = await this.findOne(account_nr);
    if (bal.balance < amount)
      throw new BadRequestException(ERROR_MESSAGES.InsufficientBalance);

    bal.balance = bal.balance - amount;
    return bal.save(transactionHost);
  }
}
