import { Order } from "../orders.model";

interface OrderObject {
  tokenA: string;
  tokenB: string;
  amountA: string;
  amountB: string;
  orderType: 'market' | 'limit';
  status: string;
  cancellable: boolean;
  feeRate?: string;
  amountPaid?: string;
  amountReceived?: string;
}

export class GetOrdersResponseDto {
  orders: OrderObject[];
  
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
