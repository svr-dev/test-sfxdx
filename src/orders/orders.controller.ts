import { Controller, Get, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { GetOrdersDto } from './dto/get-orders.dto';
import { GetMatchingOrdersDto } from './dto/get-matching-orders.dto';
import { GetOrdersResponseDto } from "./dto/get-orders-response.dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags('Orders')
@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({ summary: 'Получение массива заявок' })
  @ApiResponse({ status: 200, description: 'Успешное получение заявок', type: GetOrdersResponseDto })
  @Get('/getOrders')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getOrders(@Query() params: GetOrdersDto): Promise<GetOrdersResponseDto> {
    const orders = await this.ordersService.getOrders(params);
    return new GetOrdersResponseDto(orders);
  }
  @ApiOperation({ summary: 'Получение массива идентификаторов заявок для вызова метода matchOrders в смарт-контракте' })
  @Get('/getMatchingOrders')
  @UsePipes(new ValidationPipe({ transform: true }))
  getMatchingOrders(@Query() params: GetMatchingOrdersDto): any {
    return this.ordersService.fetchMatchingOrders(params);
  }
}