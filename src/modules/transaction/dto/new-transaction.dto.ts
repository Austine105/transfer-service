import { ApiHideProperty, ApiTags } from '@nestjs/swagger';
import { IsOptional, IsPositive, MinLength } from 'class-validator';

@ApiTags('Transfer funds')
export class NewTransactionDto {

  @IsOptional()
  from: string

  @IsOptional()
  to: string

  @IsPositive()
  amount: number

  // hidden, for type-checking
  @ApiHideProperty()
  @IsOptional()
  account_nr: string

  @ApiHideProperty()
  @IsOptional()
  reference: string
}
