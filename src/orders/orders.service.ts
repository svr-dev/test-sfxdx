import { Injectable } from '@nestjs/common';
import { GetOrdersDto } from './dto/get-orders.dto';
import { GetMatchingOrdersDto } from './dto/get-matching-orders.dto';
import { ContractService } from "../contract/contract.service";
import { InjectModel } from "@nestjs/sequelize";
import { Order } from "./orders.model";
import { SyncService } from "../sync/sync.service";

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order) private ordersRepository: typeof Order,
    private readonly contractService: ContractService,
    private readonly syncService: SyncService
  ) {}
  
  async getOrders(params: GetOrdersDto) {
    console.log('[OrdersService] getOrders -> params: ', params)
    //const orders = await this.contractService.getUserOrderIds();
    const orders = await this.checkOrdersCount();
    console.log('[OrdersService] getOrders -> orders: ', orders)
    return orders;
  }
  
  private async checkOrdersCount() {
    const ordersCount = await this.ordersRepository.count();
    if (ordersCount === 0) {
      console.log('[OrdersService] database empty, performing sync...')
      await this.syncService.syncBlockchainEvents();
    }
    return ordersCount
  }

  getMatchingOrders(params: GetMatchingOrdersDto): any {
    // mock response
    return [{ orderId: 1, tokenA: params.tokenA, tokenB: params.tokenB, amountA: params.amountA, amountB: params.amountB }];
  }
}
