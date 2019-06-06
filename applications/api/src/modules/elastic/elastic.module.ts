import {Module} from '@nestjs/common';
import {ElasticsearchModule, ElasticsearchModuleOptions, ElasticsearchOptionsFactory} from '@nestjs/elasticsearch';
import {SearchService} from './elastic.service';
import {SearchController} from './elastic.controller';
// import {IpfsController} from './ipfs.controller';

export class ElasticsearchConfigService implements ElasticsearchOptionsFactory {
    createElasticsearchOptions(): ElasticsearchModuleOptions {
        return {
            host: '172.18.0.1:9200',
            log: 'trace'
        };
    }
}

@Module({
    imports: [
        ElasticsearchModule.registerAsync({
            useClass: ElasticsearchConfigService
        })
    ],
    controllers: [SearchController],
    providers: [SearchService],
    exports: [SearchService]
})
export class SearchModule {}
