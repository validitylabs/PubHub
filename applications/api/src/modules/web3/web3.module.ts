import {Module} from '@nestjs/common';
import {Web3Service} from './web3.service';

@Module({
    providers: [
        {
            provide: Web3Service,
            useValue: new Web3Service()
        }
    ],
    exports: [Web3Service]
})
export class Web3Module {}
