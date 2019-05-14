import {Logger, Injectable} from '@nestjs/common';
// tslint:disable-next-line: no-require-imports
import Web3 = require('web3');

@Injectable()
export class Web3Service {
    private readonly logger = new Logger('WEB3');
    // @ts-ignore
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

    async getExistingEventLength(): Promise<string> {
        const events = await this.contract.getPastEvents('allEvents', {fromBlock: 0, toBlock: 'latest'});
        return `We have found ${events.length} related events from the smart contract.`;
    }

    async getLastestEventHash(): Promise<string> {
        const events = await this.contract.getPastEvents('allEvents', {fromBlock: 0, toBlock: 'latest'});
        const digestString = events[events.length - 1].returnValues.IpfsDigest.slice(1, -1);
        const digest = digestString.startsWith('Qm') ? digestString : 'Qm'.concat(digestString);
        // tslint:disable-next-line
        return digest;
    }
}
