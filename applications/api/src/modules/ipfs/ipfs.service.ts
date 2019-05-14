import {Logger, Injectable} from '@nestjs/common';
// tslint:disable-next-line
let IpfsClient = require('ipfs-http-client');

@Injectable()
export class IpfsService {
    private readonly logger = new Logger('IPFS');
    private readonly node = IpfsClient('/ip4/127.0.0.1/tcp/5001');
    // private readonly node = IpfsClient({host: '127.0.0.1', port: '5001', protocol: 'http'});
    // private readonly node = new Ipfs({
    //     repo: 'ipfs-' + String(Math.random() + Date.now()),
    //     config: {
    //         Addresses: {
    //             API: '/ip4/127.0.0.1/tcp/5002',
    //             Gateway: '/ip4/127.0.0.1/tcp/9090'
    //         },
    //         API: {
    //             HTTPHeaders: {
    //                 'Access-Control-Allow-Methods': ['PUT', 'GET', 'POST'],
    //                 'Access-Control-Allow-Origin': [
    //                     'http://localhost:5002', // tslint:disable-line: no-http-string
    //                     'http://127.0.0.1:5002', // tslint:disable-line: no-http-string
    //                     'http://localhost:3001', // tslint:disable-line: no-http-string
    //                     'http://127.0.0.1:3001', // tslint:disable-line: no-http-string
    //                     'https://webui.ipfs.io'
    //                 ]
    //             }
    //         }
    //     }
    // });

    constructor() {
        this.logger.log(` ipfs module is logging`);
        // this.node.on('ready', () => {
        this.node
            .id()
            .catch((error: any) => this.logger.log(` [ipfs module] has an error ${error}`))
            .then((id: any) => {
                this.logger.log(` [ipfs module] the id is ${id}.`);
            })
            .catch(() => '[ipfs module] obligatory catch');
        // });
        // this.node.on('error', (error: any) => {
        //     this.logger.error('Something went terribly wrong!', error);
        // });
        // this.node.on('start', () => this.logger.log('Node started!'));
    }

    async getIpfsVersion(): Promise<string> {
        const version = await this.node.version();
        return `[ ipfs module ] version is ${version.Version}`;
    }

    async getIpfsOnlineStatus(): Promise<string> {
        const id = await this.node.id();
        return `[ ipfs module ] id is ${id}`;
        // return ` [ initialize ipfs ] Online status:  ${this.node.isOnline() ? 'online' : 'offline'}`;
    }
}
