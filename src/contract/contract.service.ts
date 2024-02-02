import { Injectable } from '@nestjs/common';
import { Web3Service } from '../web3/web3.service';

@Injectable()
export class ContractService {
  constructor(private readonly web3Service: Web3Service) {}

  async getContractDeploymentBlock() {
    const web3 = this.web3Service.getWeb3();
    const receipt = await web3.eth.getTransactionReceipt(process.env.DEPLOYMENT_TX_HASH);
    return Number(receipt.blockNumber);
  }
  
  async fetchEventsSinceBlock(eventType: string, startBlock: number | bigint | string): Promise<any[]> {
    const contract = this.web3Service.getContract();
    const latestBlockNumber = await this.web3Service.getWeb3().eth.getBlockNumber();
    const events = await contract.getPastEvents(eventType, {
      fromBlock: startBlock,
      toBlock: latestBlockNumber,
    });
    return events;
  }
}