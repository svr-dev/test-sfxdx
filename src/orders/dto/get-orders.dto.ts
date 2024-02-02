import { IsOptional, IsBooleanString, IsString } from "class-validator";

export class GetOrdersDto {
  @IsOptional()
  @IsString()
  tokenA?: string;

  @IsOptional()
  @IsString()
  tokenB?: string;

  @IsOptional()
  @IsString()
  user?: string;

  @IsOptional()
  @IsBooleanString()
  active?: string;
}
