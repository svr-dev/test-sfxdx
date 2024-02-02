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
    const latestOrder = await this.orderDAO.findLatestOrder();
    const latestDBBlock: bigint | null = latestOrder ? BigInt(latestOrder.blockNumber) : null;
    const startBlock: bigint = latestDBBlock !== null ? latestDBBlock + 1n : await this.contractService.getContractDeploymentBlock();

    if (latestDBBlock === null || await this.contractService.isNewBlockAvailable()) {
      const transaction = await this.sequelize.transaction();
      try {
        await this.processCreatedEvents(startBlock, transaction);
        await this.processCancelledEvents(startBlock, transaction);
        await this.processMatchedEvents(startBlock, transaction);
        await transaction.commit();
      } catch (error) {
        await transaction.rollback();
        console.error("Failed to sync blockchain events:", error);
      }
    } else {
      console.log("No new blocks to sync or database is already up to date. Skipping synchronization process.");
    }
  }
  
  private async processCreatedEvents(deploymentBlock: bigint, transaction: any) {
    const events = await this.contractService.fetchEventsSinceBlock('OrderCreated', deploymentBlock);
    
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

  private async processCancelledEvents(deploymentBlock: bigint, transaction: any) {
    const events = await this.contractService.fetchEventsSinceBlock('OrderCancelled', deploymentBlock);
    for (const event of events) {
      await this.orderDAO.createOrUpdateOrder({
        orderId: event.returnValues.id.toString(),
        status: 'cancelled',
        cancellable: false,
      }, transaction);
    }
  }

  private async processMatchedEvents(deploymentBlock: bigint, transaction: any) {
    const events = await this.contractService.fetchEventsSinceBlock('OrderMatched', deploymentBlock);

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
          matchedId: event.returnValues.matchedId,
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
        matchedId: event.returnValues.matchedId,
        cancellable: false,
      }, transaction);
    }
    
  }
}
