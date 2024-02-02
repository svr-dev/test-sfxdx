import { Order } from "../orders.model";
import { ApiProperty } from '@nestjs/swagger';

class OrderResponseObject {
  @ApiProperty({ example: '0xTokenAAddress', description: 'Адрес токена покупки' })
  tokenA: string;

  @ApiProperty({ example: '0xTokenBAddress', description: 'Адрес токена продажи' })
  tokenB: string;

  @ApiProperty({ example: '100', description: 'Сумма покупки' })
  amountA: string;

  @ApiProperty({ example: '50', description: 'Сумма продажи' })
  amountB: string;

  @ApiProperty({ example: 'market', description: 'Тип заявки: market или limit' })
  orderType: 'market' | 'limit';

  @ApiProperty({ example: 'active', description: 'Статус заявки' })
  status: string;

  @ApiProperty({ example: true, description: 'Возможность отмены заявки' })
  cancellable: boolean;

  @ApiProperty({ example: '0.01', description: 'Ставка комиссии', required: false })
  feeRate?: string;

  @ApiProperty({ example: '99', description: 'Сумма, уплаченная покупателем', required: false })
  amountPaid?: string;

  @ApiProperty({ example: '49', description: 'Сумма, полученная продавцом', required: false })
  amountReceived?: string;
}

export class GetOrdersResponseDto {
  @ApiProperty({ type: [OrderResponseObject], description: 'Массив заявок' })
  orders: OrderResponseObject[];

  constructor(orders: Order[]) {
    this.orders = orders.map(order => ({
      tokenA: order.tokenA,
      tokenB: order.tokenB,
      amountA: String(order.amountA),
      amountB: String(order.amountB),
      orderType: order.isMarket ? 'market' : 'limit',
      status: order.status,
      cancellable: ['active', 'partially_filled'].includes(order.status) && order.isMarket === false,
      ...(order.status !== 'active' && order.status !== 'cancelled' && { feeRate: String(order.feeRate) }),
      ...(order.status !== 'active' && order.status !== 'cancelled' && order.isMarket === false && { amountPaid: String(order.amountPaid), amountReceived: String(order.amountReceived) }),
    }));
  }
}
