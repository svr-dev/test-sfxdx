import { Module } from '@nestjs/common';
import { ContractService } from './contract.service';
import { Web3Module } from '../web3/web3.module';

@Module({
  imports: [Web3Module],
  providers: [ContractService],
  exports: [ContractService],
})
export class ContractModule {}