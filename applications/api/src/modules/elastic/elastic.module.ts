import {Module} from '@nestjs/common';
import {ElasticsearchModule} from '@nestjs/elasticsearch';
import {SearchService} from './elastic.service';
// import {IpfsController} from './ipfs.controller';

@Module({
    imports: [
        ElasticsearchModule.register({
            host: 'localhost:9200',
            log: 'trace'
        })
    ],
    providers: [SearchService],
    exports: [SearchService]
})
export class SearchModule {}
