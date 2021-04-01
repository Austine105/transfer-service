import { Controller, Get, Param, Post, Query, ValidationPipe } from '@nestjs/common';
import { ApiHideProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { parseQueryObj } from 'src/common/utils/query-parser';
import { BalanceService } from './balance.service';
import { BalanceModel as Balance } from './balance.model';
import { BalanceQueryFiltersDto } from './dto/balance-query-filters.dto';
import { NewBalanceDto } from './dto/new-balance.dto';


@ApiTags('Balances')
@Controller('balance')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) { }

  // @ApiHideProperty()
  // @Post()
  // // @ApiResponse({ type: Balance })
  // async create(@Query(new ValidationPipe({ transform: true })) newBal: NewBalanceDto) {
  //   return this.balanceService.create(newBal);
  // }


  @Get()
  @ApiResponse({ type: Balance })
  async findAll(@Query(new ValidationPipe({ transform: true })) query: BalanceQueryFiltersDto) {

    query = parseQueryObj(query);
    return this.balanceService.findAll(query);
  }

  @ApiResponse({ type: Balance })
  @Get(':account_nr')
  async findOne(
    @Param('account_nr') account_nr: string,
  ) {
    return this.balanceService.findOne(account_nr);
  }
}
