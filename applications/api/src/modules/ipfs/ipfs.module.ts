import {Module} from '@nestjs/common';
import {IpfsService} from './ipfs.service';
import {IpfsController} from './ipfs.controller';
import {SearchModule} from '../elastic/elastic.module';

@Module({
    imports: [SearchModule],
    controllers: [IpfsController],
    // providers: [
    //     {
    //         provide: IpfsService,
    //         //TODO: passing searchService as param?
    //         useValue: new IpfsService()
    //     }
    // ],
    providers: [IpfsService],
    exports: [IpfsService]
})
export class IpfsModule {}
