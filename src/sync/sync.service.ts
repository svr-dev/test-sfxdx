// sync.service.ts
import { Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { OrderDAO } from './dao/sync-order.dao';
import { ContractService } from "../contract/contract.service";

@Injectable()
export class SyncService {
  constructor(
    private sequelize: Sequelize,
    private readonly orderDAO: OrderDAO,
    private readonly contractService: ContractService,
  ) {}

  async syncBlockchainEvents() {
    const transaction = await this.sequelize.transaction();
    try {
      
      const deploymentBlock = await this.contractService.getContractDeploymentBlock();
      // Fetching 'OrderCreated' all events since contract deployment
      const orderCreatedEvents = await this.contractService.fetchEventsSinceBlock('OrderCreated', deploymentBlock);

      // Save orders to database
      for (const event of orderCreatedEvents) {
        await this.orderDAO.createOrUpdateOrder({
          orderId: event.returnValues.id.toString(),
          tokenA: event.returnValues.tokenA,
          tokenB: event.returnValues.tokenB,
          amountA: event.returnValues.amountA,
          amountB: event.returnValues.amountB,
          userAddress: event.returnValues.user,
          orderType: event.returnValues.isMarket ? 'market' : 'limit',
          cancellable: !event.returnValues.isMarket,
          blockNumber: event.blockNumber,
          transactionHash: event.transactionHash,
        }, transaction);
      }

      const orderCancelledEvents = await this.contractService.fetchEventsSinceBlock('OrderCancelled', deploymentBlock);
      for (const event of orderCancelledEvents) {
        await this.orderDAO.createOrUpdateOrder({
          orderId: event.returnValues.id.toString(),
          tokenA: event.returnValues.tokenA,
          tokenB: event.returnValues.tokenB,
          amountA: event.returnValues.amountA,
          amountB: event.returnValues.amountB,
          userAddress: event.returnValues.user,
          orderType: event.returnValues.isMarket ? 'market' : 'limit',
          cancellable: !event.returnValues.isMarket,
          blockNumber: event.blockNumber,
          transactionHash: event.transactionHash,
        }, transaction);
      }

      const orderMatchedEvents = await this.contractService.fetchEventsSinceBlock('OrderMatched', deploymentBlock);
      for (const event of orderMatchedEvents) {
        await this.orderDAO.createOrUpdateOrder({
          orderId: event.returnValues.id.toString(),
          tokenA: event.returnValues.tokenA,
          tokenB: event.returnValues.tokenB,
          amountA: event.returnValues.amountA,
          amountB: event.returnValues.amountB,
          userAddress: event.returnValues.user,
          orderType: event.returnValues.isMarket ? 'market' : 'limit',
          cancellable: !event.returnValues.isMarket,
          blockNumber: event.blockNumber,
          transactionHash: event.transactionHash,
        }, transaction);
      }

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error; // Rethrow the error or handle it as needed
    }
  }
}