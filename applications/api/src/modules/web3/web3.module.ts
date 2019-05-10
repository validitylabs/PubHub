import {Module} from '@nestjs/common';
import {Web3Service} from './web3.service';
import {Web3Controller} from './web3.controller';

@Module({
    controllers: [Web3Controller],
    providers: [
        {
            provide: Web3Service,
            useValue: new Web3Service()
        }
    ],
    exports: [Web3Service]
})
export class Web3Module {}
