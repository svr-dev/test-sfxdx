import { Injectable, Inject } from '@nestjs/common';
import Web3 from 'web3';

@Injectable()
export class Web3Service {
  constructor(
    @Inject('Web3') private readonly web3: Web3,
    @Inject('ContractInfo') private readonly contractInfo: { abi: any; address: string },
  ) {}

  getContract() {
    return new this.web3.eth.Contract(
      this.contractInfo.abi,
      this.contractInfo.address,
    );
  }

  getWeb3() {
    return this.web3;
  }
}