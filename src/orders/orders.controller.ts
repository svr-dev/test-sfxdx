import { Controller, Get, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { GetOrdersDto } from './dto/get-orders.dto';
import { GetMatchingOrdersDto } from './dto/get-matching-orders.dto';
import { GetOrdersResponseDto } from "./dto/get-orders-response.dto";

@Controller('/')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('/getOrders')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getOrders(@Query() params: GetOrdersDto): Promise<GetOrdersResponseDto> {
    const orders = await this.ordersService.getOrders(params);
    return new GetOrdersResponseDto(orders)
  }

  @Get('/getMatchingOrders')
  @UsePipes(new ValidationPipe({ transform: true }))
  getMatchingOrders(@Query() params: GetMatchingOrdersDto): any {
    return this.ordersService.fetchMatchingOrders(params);
  }
}