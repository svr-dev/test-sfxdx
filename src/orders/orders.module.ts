import { forwardRef, Module } from "@nestjs/common";
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { ContractModule } from "../contract/contract.module";
import { Order } from "./orders.model";
import { SequelizeModule } from "@nestjs/sequelize";
import { SyncModule } from "../sync/sync.module";

@Module({
  providers: [OrdersService],
  imports: [
    SequelizeModule.forFeature([Order]),
    ContractModule,
    forwardRef(() => SyncModule)
  ],
  controllers: [OrdersController],
  exports: [OrdersService]
})
export class OrdersModule {}
