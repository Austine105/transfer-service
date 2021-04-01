import { ApiHideProperty } from '@nestjs/swagger';
import { IsPositive } from 'class-validator';

export class NewBalanceDto {
  @IsPositive()
  balance: number

  @ApiHideProperty()
  account_nr: string
}
