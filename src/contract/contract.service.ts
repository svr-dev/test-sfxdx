import { Injectable } from '@nestjs/common';
import { Web3Service } from '../web3/web3.service';

@Injectable()
export class ContractService {
  private lastCheckedBlockNumber: bigint | null = null;

  constructor(private readonly web3Service: Web3Service) {}

  async getContractDeploymentBlock() {
    const web3 = this.web3Service.getWeb3();
    const receipt = await web3.eth.getTransactionReceipt(
      process.env.DEPLOYMENT_TX_HASH,
    );
    return BigInt(receipt.blockNumber);
  }

  async fetchEventsSinceBlock(eventType: string, startBlock: bigint,): Promise<any[]> {
    const contract = this.web3Service.getContract();
    const latestBlockNumber = BigInt(
      await this.web3Service.getWeb3().eth.getBlockNumber(),
    );
    return await contract.getPastEvents(eventType, {
      fromBlock: startBlock.toString(),
      toBlock: latestBlockNumber.toString(),
    });
  }

  async getLatestBlockNumber(): Promise<bigint> {
    const latestBlockNumber = BigInt(
      await this.web3Service.getWeb3().eth.getBlockNumber(),
    );
    if (this.lastCheckedBlockNumber !== latestBlockNumber) {
      this.lastCheckedBlockNumber = latestBlockNumber;
    } else {
      console.log('Latest blockchain block number has not changed.');
    }

    return latestBlockNumber;
  }

  async isNewBlockAvailable(): Promise<boolean> {
    const latestBlockNumber = await this.getLatestBlockNumber();
    return (
      !this.lastCheckedBlockNumber ||
      this.lastCheckedBlockNumber < latestBlockNumber
    );
  }
}
