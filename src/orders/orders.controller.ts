import { Controller, Get, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { GetOrdersDto } from './dto/get-orders.dto';
import { GetMatchingOrdersDto } from './dto/get-matching-orders.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('/getOrders')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getOrders(@Query() params: GetOrdersDto) {
    return await this.ordersService.getOrders(params);
  }

  @Get('/getMatchingOrders')
  @UsePipes(new ValidationPipe({ transform: true }))
  getMatchingOrders(@Query() params: GetMatchingOrdersDto): any {
    return this.ordersService.getMatchingOrders(params);
  }
}