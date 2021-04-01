import { ApiHideProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { BaseQueryFiltersDto } from 'src/common/dto/base-query-filters.dto';

export class BalanceQueryFiltersDto extends BaseQueryFiltersDto {
  @IsOptional()
  account_nr?: number;
}
