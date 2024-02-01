import { Injectable } from '@nestjs/common';
import { Web3Service } from '../web3/web3.service';

@Injectable()
export class ContractService {
  constructor(private readonly web3Service: Web3Service) {}
}