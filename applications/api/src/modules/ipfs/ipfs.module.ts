import {Module} from '@nestjs/common';
import {IpfsService} from './ipfs.service';
import {IpfsController} from './ipfs.controller';

@Module({
    controllers: [IpfsController],
    providers: [
        {
            provide: IpfsService,
            useValue: new IpfsService()
        }
    ],
    exports: [IpfsService]
})
export class IpfsModule {}
