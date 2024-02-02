import { IsString, IsNumber } from 'class-validator';
import { Type } from "class-transformer";
import { ApiProperty } from '@nestjs/swagger';

export class GetMatchingOrdersDto {
  @ApiProperty({ example: '0xTokenAAddress', description: 'Адрес токена покупки' })
  @IsString()
  tokenA: string;

  @ApiProperty({ example: '0xTokenBAddress', description: 'Адрес токена продажи' })
  @IsString()
  tokenB: string;

  @ApiProperty({ example: 100, description: 'Сумма покупки, если 0 заявка исполнится по рынку', type: Number })
  @Type(() => Number)
  @IsNumber()
  amountA: number;

  @ApiProperty({ example: 50, description: 'Сумма продажи', type: Number })
  @Type(() => Number)
  @IsNumber()
  amountB: number;
}
