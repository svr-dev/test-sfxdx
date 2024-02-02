import { Injectable } from '@nestjs/common';
import { GetOrdersDto } from './dto/get-orders.dto';
import { GetMatchingOrdersDto } from './dto/get-matching-orders.dto';
import { InjectModel } from "@nestjs/sequelize";
import { Order } from "./orders.model";
import { SyncService } from "../sync/sync.service";
import { Op } from 'sequelize';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order) private ordersRepository: typeof Order,
    private readonly syncService: SyncService,
  ) {}
  
  async getOrders(params: GetOrdersDto) {
    const ordersCount = await this.checkOrdersCount();
    console.log('[OrdersService] getOrders -> orders: ', ordersCount);
    return await this.fetchOrdersFromDB(params);
  }

  private async checkOrdersCount() {
    const ordersCount = await this.ordersRepository.count();
    if (ordersCount === 0) {
      console.log('[OrdersService] database empty, performing sync...');
      await this.syncService.syncBlockchainEvents();
    }
    return ordersCount;
  }

  private async fetchOrdersFromDB(params: GetOrdersDto) {
    const { tokenA, tokenB, user, active } = params;

    let whereCondition = {};

    // Filtering by tokens and user
    if (tokenA) {
      whereCondition['tokenA'] = tokenA;
    }
    if (tokenB) {
      // If both tokenA and tokenB are provided, find orders matching either
      if (tokenA) {
        whereCondition = {
          ...whereCondition,
          [Op.or]: [{ tokenA: tokenA }, { tokenB: tokenB }],
        };
      } else {
        whereCondition['tokenB'] = tokenB;
      }
    }
    if (user) {
      whereCondition['userAddress'] = user;
    }

    // Filtering by active status, false if not provided
    if (active === 'true') {
      whereCondition['status'] = {
        [Op.in]: ['active', 'partially_filled'],
      };
    } else { 
      whereCondition['status'] = {
        [Op.in]: ['cancelled', 'filled'],
      };
    }

    const orders = await this.ordersRepository.findAll({
      where: whereCondition,
    });
    console.log('[OrdersService] fetched orders count: ', orders.length)
    return orders;
  }

  getMatchingOrders(params: GetMatchingOrdersDto): any {
    // mock response
    return [{ orderId: 1, tokenA: params.tokenA, tokenB: params.tokenB, amountA: params.amountA, amountB: params.amountB }];
  }
}
