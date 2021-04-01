import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, ValidationPipe } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { parseQueryObj } from 'src/common/utils/query-parser';
import { TransactionService } from './transaction.service';
import { TransactionModel as Transaction } from './transaction.model';
import { TransactionQueryFiltersDto } from './dto/transaction-query-filters.dto';
import { NewTransactionDto } from './dto/new-transaction.dto';

@ApiTags('Transactions')
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) { }

  @Post()
  async createTransaction(
    @Body(new ValidationPipe({ transform: true })) newTxtn: NewTransactionDto) {
    return this.transactionService.create(newTxtn);
  }

  @Get()
  @ApiResponse({ type: Transaction })
  async findAll(@Query(new ValidationPipe({ transform: true })) query: TransactionQueryFiltersDto) {

    query = parseQueryObj(query, ['created_by']);
    return this.transactionService.findAll(query);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.transactionService.findOne(id);
  }
}
