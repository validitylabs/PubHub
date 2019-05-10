import {Logger, Injectable} from '@nestjs/common';
// import Web3 from 'web3';
// tslint:disable-next-line: no-require-imports
import Web3 = require('web3');

@Injectable()
export class Web3Service {
    private readonly logger = new Logger('WEB3');
    private readonly web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/b663cde1acc040abbbd59c5dbb7de904'));
    private readonly contract = new this.web3.eth.Contract(
        [
            {
                constant: false,
                inputs: [
                    {
                        name: 'digest',
                        type: 'string'
                    }
                ],
                name: 'writeToIpfs',
                outputs: [],
                payable: false,
                stateMutability: 'nonpayable',
                type: 'function'
            },
            {
                anonymous: false,
                inputs: [
                    {
                        indexed: true,
                        name: 'Account',
                        type: 'address'
                    },
                    {
                        indexed: false,
                        name: 'IpfsDigest',
                        type: 'string'
                    }
                ],
                name: 'AddedToIpfs',
                type: 'event'
            },
            {
                constant: true,
                inputs: [],
                name: 'counter',
                outputs: [
                    {
                        name: '',
                        type: 'uint256'
                    }
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function'
            }
        ],
        '0x3db7f3ce55f73ba200e2ad9e96c81627448255c2'
    );

    constructor() {
        this.logger.log(` web3 module is logging`);
        this.web3.eth.net
            .getNetworkType()
            .catch((error) => this.logger.log(` [web3 module] has an error ${error}`))
            .then((network) => {
                this.logger.log(` [web3 module] we are on ${network} network.`);
            })
            .catch(() => '[web3 module] obligatory catch');
        this.logger.log(` [web3 module] initializes contract at ${this.contract.address}`);
    }

    async getExistingEventLength(): Promise<number> {
        // this.contract
        //     .getPastEvents('allEvents', {fromBlock: 0, toBlock: 'latest'})
        //     .catch((error) => this.logger.log(` [web3 module pastEvents] has an error ${error}`))
        //     .then((events) => {
        //         this.logger.log(` [web3 module pastEvents] got events ${events}`);
        //     })
        //     .catch(() => '[web3 module] obligatory catch');
        const events = await this.contract.getPastEvents('allEvents', {fromBlock: 0, toBlock: 'latest'});
        return events.length;
    }

    async getLastestEventHash(): Promise<string> {
        const events = await this.contract.getPastEvents('allEvents', {fromBlock: 0, toBlock: 'latest'});
        const IpfsDigestString = events[events.length - 1].returnValues.IpfsDigest.slice(1, -1);
        if (IpfsDigestString.startsWith('Qm')) {
            return IpfsDigestString;
            // tslint:disable-next-line: no-unnecessary-else
            // tslint:disable-next-line: no-else-after-return
        } else {
            return 'Qm'.concat(IpfsDigestString);
        }
    }

    // extractValidationErrorMessages(validationErrors: ValidationError[]) {
    //     return validationErrors
    //         .map(
    //             (validationError) =>
    //                 `${Object.values(validationError.constraints)
    //                     .map((constraint) => `  * ${constraint}.`)
    //                     .join('\n')}`
    //         )
    //         .join('.\n');
    // }

    // getDotenvConfiguration(filePath: string) {
    //     if (fs.existsSync(filePath)) {
    //         return dotenv.parse(fs.readFileSync(filePath));
    //     }
    //     return {};
    // }

    // get<K extends keyof ConfigurationDto>(key: K): ConfigurationDto[K] {
    //     return this.configuration[key];
    // }
}
