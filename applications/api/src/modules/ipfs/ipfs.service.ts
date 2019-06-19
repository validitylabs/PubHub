import {Logger, Injectable} from '@nestjs/common';
import {WriteFileDto} from './dto/write-file.dto';
// import {SearchService} from '../elastic/elastic.service';
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
    private readonly node = IpfsClient({host: 'ipfs', port: '5001', protocol: 'http'});
    // constructor(private readonly searchService: SearchService) {
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

    async getIpfsId(): Promise<string> {
        const id = await this.node.id();
        return id.id;
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

    /**
     * @dev Called by an HTTP request and write message to the backend ipfs node
     * @notice Not a function used in production (out of scope) because this function
     * creates a duplicate of the same file craeted by the js-ipfs on the client side.
     * Instead, we need to create file in elastic search
     */
    async writeToIpfs(writeFileDto: WriteFileDto) {
        const flattenMsg = JSON.stringify(writeFileDto);
        console.log('the flatted msg is, ', flattenMsg);
        // const flattenMsg = `We are adding this title ${writeFileDto.title} and ${
        //     writeFileDto.content
        // } as content to the IPFS, which is running insider a container.`;
        return this.node.add(Buffer.from(flattenMsg));
    }

    /**
     * @dev display and pin content from IPFS
     */
    async catAndPinFromIpfs(id: string): Promise<string> {
        this.logger.log(` catting the file`);
        const original = await this.node.get(id);
        // need to add pin
        this.logger.log(` pinning the file to current server`);
        await this.node.pin.add(id);
        // An additional step here is the check if the returned value is Buffer or not.
        // For the current PoC, we don't need to do this step.
        // if (Buffer.isBuffer(original))
        // // the returned value of `get` command is an array
        return original[0].content.toString('utf8');
        // We used to use the following ??
        // return original.toString('utf8');
    }

    /**
     * @dev get and pin content from IPFS
     */
    async getAndPinFromIpfs(id: string): Promise<string> {
        this.logger.log(` getting the file`);
        const original = await this.node.get(id);
        // need to add pin
        this.logger.log(` pinning the file to current server`);
        await this.node.pin.add(id);
        // return Buffer.from(original[0].content).toString('utf8');
        return original[0].content.toString('utf8');
    }

    async lsPinsIpfs(): Promise<string> {
        const results = await this.node.pin.ls();
        // tslint:disable-next-line: no-var-before-return
        return results;
    }
}
