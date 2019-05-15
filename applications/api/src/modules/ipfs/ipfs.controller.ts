import {Controller, Get, Post, Body, Param} from '@nestjs/common';
import {IpfsService} from './ipfs.service';
import {WriteFileDto} from './dto/write-file.dto';
// import {IFile} from './interfaces/file.interface';

@Controller('ipfs')
export class IpfsController {
    constructor(private readonly ipfsService: IpfsService) {}

    @Post()
    async create(@Body() writeFileDto: WriteFileDto) {
        console.log(writeFileDto);
        return this.ipfsService.writeToIpfs(writeFileDto);
    }

    @Get()
    async getIpfsOnlineStatus(): Promise<string> {
        return this.ipfsService.getIpfsOnlineStatus();
    }

    @Get('version')
    async getIpfsVersion(): Promise<string> {
        return this.ipfsService.getIpfsVersion();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<string> {
        return this.ipfsService.getFromIpfs(id);
    }
}