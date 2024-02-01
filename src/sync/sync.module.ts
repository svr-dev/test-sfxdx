import { forwardRef, Module } from "@nestjs/common";
import { SyncService } from './sync.service';
import { Web3Service } from "../web3/web3.service";
import { OrdersService } from "../orders/orders.service";
import { Web3Module } from "../web3/web3.module";
import { ContractModule } from "../contract/contract.module";
import { OrdersModule } from "../orders/orders.module";
import { SequelizeModule } from "@nestjs/sequelize";
import { Order } from "../orders/orders.model";
import { OrderDAO } from "./dao/sync-order.dao";

@Module({
  providers: [SyncService, OrderDAO],
  imports: [
    forwardRef(() => OrdersModule),
    SequelizeModule.forFeature([Order]),
    ContractModule,
    Web3Module,
  ],
  exports: [SyncService]
})
export class SyncModule {}