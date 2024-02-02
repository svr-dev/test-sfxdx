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

      await this.processCreatedEvents(deploymentBlock, transaction);
      console.log('----')
      await this.processCancelledEvents(deploymentBlock, transaction);
      console.log('----')
      await this.processMatchedEvents(deploymentBlock, transaction);
      console.log('----')

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  private async processCreatedEvents(deploymentBlock: number, transaction: any) {
    const events = await this.contractService.fetchEventsSinceBlock('OrderCreated', deploymentBlock);
    console.log('event OrderCreated: ', events[0])

    for (const event of events) {
      await this.orderDAO.createOrUpdateOrder({
        orderId: event.returnValues.id.toString(),
        tokenA: event.returnValues.tokenA,
        tokenB: event.returnValues.tokenB,
        amountA: event.returnValues.amountA,
        amountB: event.returnValues.amountB,
        userAddress: event.returnValues.user,
        status: 'active',
        isMarket: event.returnValues.isMarket,
        blockNumber: event.blockNumber,
        transactionHash: event.transactionHash,
        cancellable: true,
      }, transaction);
    }
  }

  private async processCancelledEvents(deploymentBlock: number, transaction: any) {
    const events = await this.contractService.fetchEventsSinceBlock('OrderCancelled', deploymentBlock);
    console.log('event OrderCancelled: ', events[0])
    for (const event of events) {
      await this.orderDAO.createOrUpdateOrder({
        orderId: event.returnValues.id.toString(),
        status: 'cancelled',
        cancellable: false,
      }, transaction);
    }
  }

  private async processMatchedEvents(deploymentBlock: number, transaction: any) {
    const events = await this.contractService.fetchEventsSinceBlock('OrderMatched', deploymentBlock);
    console.log('event OrderMatched: ', events[0])

    for (const event of events) {
      if (event.returnValues['amountLeftToFill'] > 0 ) {
        await this.orderDAO.createOrUpdateOrder({
          orderId: event.returnValues.id.toString(),
          status: 'partially_filled',
          amountReceived: event.returnValues.amountReceived,
          amountPaid: event.returnValues.amountPaid,
          amountLeftToFill: event.returnValues.amountLeftToFill,
          fee: event.returnValues.fee,
          feeRate: event.returnValues.feeRate,
          cancellable: true,
        }, transaction);
      }
      else await this.orderDAO.createOrUpdateOrder({
        orderId: event.returnValues.id.toString(),
        status: 'filled',
        amountReceived: event.returnValues.amountReceived,
        amountPaid: event.returnValues.amountPaid,
        amountLeftToFill: event.returnValues.amountLeftToFill,
        fee: event.returnValues.fee,
        feeRate: event.returnValues.feeRate,
        cancellable: false,
      }, transaction);
    }
    
  }
}
