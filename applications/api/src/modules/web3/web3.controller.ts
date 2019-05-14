import {Controller, Get} from '@nestjs/common';
import {Web3Service} from './web3.service';

@Controller('web3')
export class Web3Controller {
    constructor(private readonly web3Service: Web3Service) {}

    @Get()
    async getExistingEventLength(): Promise<string> {
        return this.web3Service.getExistingEventLength();
    }

    @Get('ipfs')
    async getLastestEventHash(): Promise<string> {
        return this.web3Service.getLastestEventHash();
    }
}
