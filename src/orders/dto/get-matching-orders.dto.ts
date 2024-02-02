import { IsString, IsNumber } from 'class-validator';
import { Type } from "class-transformer";

export class GetMatchingOrdersDto {
  @IsString()
  tokenA: string;

  @IsString()
  tokenB: string;

  @Type(() => Number)
  @IsNumber()
  amountA: number;

  @Type(() => Number)
  @IsNumber()
  amountB: number;
}
