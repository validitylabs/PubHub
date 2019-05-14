import {Controller, Get} from '@nestjs/common';
import {IpfsService} from './ipfs.service';

@Controller('ipfs')
export class IpfsController {
    constructor(private readonly ipfsService: IpfsService) {}

    @Get()
    async getIpfsOnlineStatus(): Promise<string> {
        return this.ipfsService.getIpfsOnlineStatus();
    }

    @Get('version')
    async getIpfsVersion(): Promise<string> {
        return this.ipfsService.getIpfsVersion();
    }
}
