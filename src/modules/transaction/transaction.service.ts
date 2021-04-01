import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { FindOptions, Op, literal } from 'sequelize';
import { NewTransactionDto } from './dto/new-transaction.dto';
import { TransactionModel as Transaction } from './transaction.model';
import { FindAllQueryInterface } from 'src/common/interface/find-query.interface';
import { pagingParser } from 'src/common/utils/paging-parser';
import { TRANSACTION_REPOSITORY, ERROR_MESSAGES } from './constants';
import { BalanceService } from '../balance/balance.service';
import { BalanceModel } from '../balance/balance.model';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { genRandom } from 'src/common/utils/util';


@Injectable()
export class TransactionService {
  constructor(
    @Inject(TRANSACTION_REPOSITORY) private readonly transactionRepo: typeof Transaction,
    @InjectQueue('transactions') private readonly transactionQueue: Queue,
    private readonly balanceService: BalanceService,
  ) { }


  async create(newTxtn: NewTransactionDto): Promise<Boolean> {

    // confirm if both account numbers are valid, the functions will throw the relavant error..
    await this.balanceService.findOne(newTxtn.from);
    await this.balanceService.findOne(newTxtn.to);

    // check if last transaction in db is same amount and acount and sent 1 mins ago
    const existingTxtn = await this.transactionRepo.findOne({
      where: {
        amount: newTxtn.amount,
        account_nr: newTxtn.from,
        created_at: {
          [Op.gte]: literal("NOW() - (INTERVAL '1 MINUTE')"),
        }
       },
    });

    if (existingTxtn)
      throw new BadRequestException(ERROR_MESSAGES.DuplicateTransaction);

    // send transaction to job queue;
    this.transactionQueue.add('transfer', newTxtn);

    return true;
  }

  async findAll(params): Promise<FindAllQueryInterface<Transaction>> {
    const query: FindOptions = {
      limit: params.limit,
      offset: params.skip,
      order: params.order,
      attributes: {
        exclude: ['deleted_at', 'updated_at']
      },
      // include: [BalanceModel],
      where: {
        ...params.where
      }
    };

    const transactions = await this.transactionRepo.findAndCountAll(query);
    const paging = pagingParser(query, transactions.count, transactions.rows.length);

    return {
      paging,
      data: transactions.rows
    };
  }

  async findOne(id: number): Promise<Transaction> {
    const transaction = await this.transactionRepo.findOne({
      where: {
        id
      },
      include: [{
        model: BalanceModel,
        attributes: {
          exclude: ['deleted_at', 'updated_at']
        },
      }],
      attributes: { exclude: ['deleted_at'] }
    });
    if (!transaction)
      throw new BadRequestException(ERROR_MESSAGES.TransactionNotFound);

    return transaction;
  }

  // !!!
  // this is used for JOB processing and shouldn't be called by controller
  async processTxtnJob(newTxtn: NewTransactionDto): Promise<Boolean> {

    // represents the debit transaction
    const debitTxtn: NewTransactionDto = {
      account_nr: newTxtn.from,
      reference: genRandom() + new Date().getTime().toString(),
      ...newTxtn
    };

    // represents the credit transaction
    const creditTxtn: NewTransactionDto = {
      account_nr: newTxtn.from,
      reference: genRandom() + new Date().getTime().toString(),
      ...newTxtn
    };

    await this.transactionRepo.sequelize.transaction(async t => {
      const transactionHost = { transaction: t };

      await this.balanceService.debit(newTxtn.from, newTxtn.amount, transactionHost);
      await this.balanceService.credit(newTxtn.to, newTxtn.amount, transactionHost);
      await this.transactionRepo.create(debitTxtn, transactionHost);
      await this.transactionRepo.create(creditTxtn, transactionHost);
    });
    return true;
  }
}
