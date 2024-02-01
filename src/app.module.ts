import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from "@nestjs/config";
import { Web3Module } from './web3/web3.module';
import { ContractModule } from './contract/contract.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env`
    }),
    Web3Module,
    ContractModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
