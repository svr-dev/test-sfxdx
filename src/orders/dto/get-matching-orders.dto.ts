import { IsString, IsNumber } from 'class-validator';

export class GetMatchingOrdersDto {
  @IsString()
  tokenA: string;

  @IsString()
  tokenB: string;

  @IsNumber()
  amountA: number;

  @IsNumber()
  amountB: number;
}
