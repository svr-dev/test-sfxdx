import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from "@nestjs/config";
import { OrdersModule } from './orders/orders.module';
import { Web3Module } from './web3/web3.module';
import { ContractModule } from './contract/contract.module';
import { SequelizeModule } from "@nestjs/sequelize";
import { Order } from "./orders/orders.model";
import { SyncModule } from "./sync/sync.module";

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
