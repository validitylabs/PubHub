import {Logger, Injectable} from '@nestjs/common';
import {WriteFileDto} from './dto/write-file.dto';
// TODO: Add search service to ipfs service?
import {SearchService} from '../elastic/elastic.service';
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
    // e.g. private readonly node = IpfsClient({host: '172.20.0.1', port: '5001', protocol: 'http'});
    private readonly node = IpfsClient({host: '172.18.0.1', port: '5001', protocol: 'http'});

    //TODO: passing searchService as param?
    constructor(private readonly searchService: SearchService) {
        // constructor() {
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

    // tslint:disable-next-line: jsdoc-format
    // TODO:
    /**
     * @dev Called by an HTTP request, which should fetch the content from backend node
     * (or directly passing through the dto) and dump it to elastic search.
     */
    // async writeToIpfs(writeFileDto: WriteFileDto): Promise<IAddResult> {
    async saveToElastic(writeFileDto: WriteFileDto) {
        // the line below should not be executed as it creates a duplicate of the same file craeted by the js-ipfs on the client side
        // const flattenMsg = `We are adding this title ${writeFileDto.title} and ${
        //     writeFileDto.content
        // } as content to the IPFS, which is running insider a container.`;
        const newObj = {title: writeFileDto.title, content: writeFileDto.content, user: String(`0xETH${Math.random()}`)};
        console.log('Adding a new object ', newObj);
        // instead, we need to create file in elastic search
        return this.searchService.insertWork(newObj);
    }

    /**
     * @dev Called by an HTTP request and write message to the backend ipfs node
     * @notice Not a function used in production (out of scope) because this function
     * creates a duplicate of the same file craeted by the js-ipfs on the client side.
     * Instead, we need to create file in elastic search
     */
    async writeToIpfs(writeFileDto: WriteFileDto) {
        const flattenMsg = `We are adding this title ${writeFileDto.title} and ${
            writeFileDto.content
        } as content to the IPFS, which is running insider a container.`;
        return this.node.add(Buffer.from(flattenMsg));
    }

    async catAndPinFromIpfs(id: string): Promise<string> {
        const original = await this.node.cat(id);
        // need to add pin
        await this.node.pin.add(id);
        return original.toString('utf8');
        // if (Buffer.isBuffer(original)) {
        //     // Registered as buffer type
        //     // tslint:disable-next-line: no-unnecessary-else
        // } else {
        //     return original;
        // }
    }

    async getFromIpfs(id: string): Promise<string> {
        const original = await this.node.get(id);
        return Buffer.from(original[0].content).toString('utf8');
    }

    async lsPinsIpfs(): Promise<string> {
        const results = await this.node.pin.ls();
        // tslint:disable-next-line: no-var-before-return
        return results;
    }
}
