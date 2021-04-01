import { IsOptional } from 'class-validator';
import { BaseQueryFiltersDto } from 'src/common/dto/base-query-filters.dto';

export class TransactionQueryFiltersDto extends BaseQueryFiltersDto {
  @IsOptional()
  account_nr?: number;

  @IsOptional()
  reference?: number;

  // @ApiHideProperty()
  // @IsOptional()
  // created_by?: number;
}
