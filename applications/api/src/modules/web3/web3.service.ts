import {Logger} from '@nestjs/common';
import Web3 from 'web3';

export class Web3Service {
    private readonly logger = new Logger('WEB3');
    private readonly web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/b663cde1acc040abbbd59c5dbb7de904'));

    constructor() {
        this.logger.log(` web3 module is logging`);
        this.web3.eth.net.getNetworkType().then((network) => {
            this.logger.log(` web3 we are on ${network} network.`);
        });
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
