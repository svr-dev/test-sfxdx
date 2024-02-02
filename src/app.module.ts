import { Module, OnModuleInit } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { OrdersModule } from './orders/orders.module';
import { Web3Module } from './web3/web3.module';
import { ContractModule } from './contract/contract.module';
import { SequelizeModule } from "@nestjs/sequelize";
import { Order } from "./orders/orders.model";
import { SyncModule } from "./sync/sync.module";
import { SyncService } from "./sync/sync.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env`
    }),
    SequelizeModule.forRootAsync({
      useFactory: () => ({
        dialect: 'postgres',
        host: process.env.POSTGRES_HOST,
        port: Number(process.env.POSTGRES_PORT),
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
        models: [Order],
        autoLoadModels: true
      })
    }),
    OrdersModule,
    Web3Module,
    ContractModule,
    SyncModule
  ]
})
export class AppModule implements OnModuleInit {
  constructor(private readonly syncService: SyncService) {}

  async onModuleInit() {
    await this.syncService.syncBlockchainEvents();
  }
}
