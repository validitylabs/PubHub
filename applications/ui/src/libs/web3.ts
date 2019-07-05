import Web3 from 'web3';
import config from '../config';

declare let window: any;

// export const web3: any = new Web3(Web3.givenProvider || new Web3.providers.WebsocketProvider('ws://localhost:8546'));
export let web3: any = null;
export let theContract: any = null;

export let currentAccount: String = '';

const theContractAbi = [
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
];

const initializeContract = () => {
    theContract = new web3.eth.Contract(theContractAbi, '0x3db7f3ce55f73ba200e2ad9e96c81627448255c2', {
        defaultGasPrice: '11000000000'
    });
    console.log(' [ contract initialized ] At ', theContract.address);
};

export const getCurrentAddress = async (): Promise<string> => {
    let accountAddress: string;
    if (web3 === null) {
        accountAddress = '';
    } else {
        const checkingAddress = await web3.eth.getAccounts();
        accountAddress = checkingAddress[0];
        console.log(' [ web3 make uppercase ] ', currentAccount.toUpperCase());
    }
    currentAccount = accountAddress;
    return accountAddress;
};

export const isInstalled = async () => {
    // tslint:disable-next-line: no-typeof-undefined
    if (typeof window.ethereum !== 'undefined') {
        const options = {transactionConfirmationBlocks: 1};
        web3 = new Web3(window.ethereum, undefined, options);
        try {
            // Request account access if needed
            await window.ethereum.enable();
            await getCurrentAddress();
            initializeContract();
            console.log(` [ web3 ethereum injected ] On ${String(await web3.eth.net.getNetworkType())} network with ${String(await web3.eth.getAccounts())}`);
        } catch (error) {
            // User denied account access...
            console.log(` [ web3.ethereum failed ] Error ${error.code}: ${error.message}`);
        }
    }
    // Legacy dapp browsers...
    // tslint:disable-next-line: no-typeof-undefined
    else if (typeof window.web3 !== 'undefined') {
        web3 = new Web3(window.web3.currentProvider);
        await getCurrentAddress();
        initializeContract();
        console.log(` [ web3 web3 injected ] On ${String(await web3.eth.net.getNetworkType())} network with ${String(await web3.eth.getAccounts())}`);
    }
    // Non-dapp browsers...
    else {
        // maybe no window object is exposed??
        try {
            // Request account access if needed
            web3 = new Web3(Web3.givenProvider || new Web3.providers.WebsocketProvider(config.APP_WEB3_PROVIDER_ENDPOINT));
            await getCurrentAddress();
            initializeContract();
            console.log(` [ web3 other injected ] On ${String(await web3.eth.net.getNetworkType())} network with ${String(await web3.eth.getAccounts())}`);
        } catch (error) {
            // User denied account access...
            console.log(` [ web3.other failed ] Error ${error.code}: ${error.message}`);
            console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
        }
    }
};

export const writeToSmartContract = async (ipfsDigest: string): Promise<string> => {
    console.log(` [ web3 writeToSmartContract ] ${currentAccount} tries to write ${ipfsDigest} on chain. Of length ${ipfsDigest.length}`);
    // optimize the data stroage by checking the length and slicing the first two bytes
    const digest = ipfsDigest.length === 46 && ipfsDigest.startsWith('Qm') ? ipfsDigest.slice(2) : ipfsDigest;
    // 112
    try {
        const receipt = await theContract.methods.writeToIpfs(`"${digest}"`).send({from: web3.utils.toChecksumAddress(currentAccount)});
        console.log(` [ web3 writeToSmartContract ] received receipt`);
        return receipt.from;
    } catch (error) {
        console.error(`not this one ${error}`);
        return '';
    }
    // // 113
    // const account = web3.utils.toChecksumAddress(currentAccount);
    // return theContract.methods.writeToIpfs(`"${digest}"`).send({from: account}, (error: any, transactionHash: any) => {
    //     if (error) {
    //         console.error('[ web3 writeToSmartContract ]');
    //         return '';
    //     }
    //     console.log(` [ web3 writeToSmartContract ] received txHash ${transactionHash} and now returning ${account}`);
    //     return account;
    // });
};
