import {Logger, Injectable} from '@nestjs/common';
import {WriteFileDto} from './dto/write-file.dto';
// import {IAddResult} from './interfaces/file.interface';

// tslint:disable-next-line
let IpfsClient = require('ipfs-http-client');

@Injectable()
export class IpfsService {
    private readonly logger = new Logger('IPFS');
    // From docker containers' POV, the host machine's "localhost" is not the same as the "localhost" of the container.
    // Therefore, we need to get the ip address of the docker host machine at docker-compose's POV
    // The way is to do in the CLI: >> docker inspect <docker-container-id> | grep Gateway
    // And put the gateway's IP address inside the host info for the API...
    // This IP address (172.20.0.1) won't be changed untill the command >> docker-compose down runs and restarts the docker-compose again
    private readonly node = IpfsClient({host: '172.20.0.1', port: '5001', protocol: 'http'});

    constructor() {
        this.logger.log(` ipfs module is logging`);
        this.node
            .id()
            .catch((error: any) => this.logger.error(` [ipfs module] has an error ${error}`))
            .then((id: any) => {
                this.logger.log(` [ipfs module] the id is ${id.id}.`);
            })
            .catch(() => '[ipfs module] obligatory catch');
    }

    async getIpfsVersion(): Promise<string> {
        const version = await this.node.version();
        return `[ ipfs module ] version is ${version.version}`;
    }

    async getIpfsOnlineStatus(): Promise<string> {
        const id = await this.node.id();
        return `[ ipfs module ] id is ${id.id}`;
        // return ` [ initialize ipfs ] Online status:  ${this.node.isOnline() ? 'online' : 'offline'}`;
    }

    // async writeToIpfs(writeFileDto: WriteFileDto): Promise<IAddResult> {
    async writeToIpfs(writeFileDto: WriteFileDto) {
        const flattenMsg = `We are adding this title ${writeFileDto.title} and ${
            writeFileDto.content
        } as content to the IPFS, which is running insider a container.`;
        return this.node.add(Buffer.from(flattenMsg));
    }

    async getFromIpfs(id: string): Promise<string> {
        const original = await this.node.cat(id);
        // if (Buffer.isBuffer(original)) {
        //     // Registered as buffer type
        return original.toString('utf8');
        //     // tslint:disable-next-line: no-unnecessary-else
        // } else {
        //     return original;
        // }
    }
}
