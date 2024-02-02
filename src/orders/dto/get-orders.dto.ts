import { IsOptional, IsBooleanString, IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class GetOrdersDto {
  @ApiProperty({ example: '0xTokenAAddress', description: 'Адрес токена покупки', required: false })
  @IsOptional()
  @IsString()
  tokenA?: string;

  @ApiProperty({ example: '0xTokenBAddress', description: 'Адрес токена продажи', required: false })
  @IsOptional()
  @IsString()
  tokenB?: string;

  @ApiProperty({ example: '0xUserAddress', description: 'Адрес пользователя', required: false })
  @IsOptional()
  @IsString()
  user?: string;

  @ApiProperty({ example: 'true', description: 'Только активные заявки', required: false })
  @IsOptional()
  @IsBooleanString()
  active?: string;
}
