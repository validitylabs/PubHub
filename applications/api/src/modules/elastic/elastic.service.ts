import {Logger, Injectable, HttpException} from '@nestjs/common';
import {ElasticsearchService} from '@nestjs/elasticsearch';
import {WriteFileDto} from '../ipfs/dto/write-file.dto';

@Injectable()
export class SearchService {
    private readonly logger = new Logger('ElasticSearch');
    // private readonly esService: ElasticsearchService;

    constructor(private readonly elasticsearchService: ElasticsearchService) {
        this.logger.log(` [elastic module] starts`);
        try {
            elasticsearchService.ping({
                // ping usually has a 3000ms timeout
                requestTimeout: Infinity
            });
        } catch (error) {
            if (error) {
                console.trace('elasticsearch cluster is down!');
            } else {
                console.log('All is well');
            }
        }
    }

    /**
     * @dev testing service: insert
     */
    async bulkInsert(abilities: any[]) {
        const bulk = [];
        abilities.forEach((ability) => {
            bulk.push({
                index: {_index: 'pokemons', _type: 'abilities'}
            });
            bulk.push(ability);
        });
        this.elasticsearchService.bulk({body: bulk, index: 'pokemons', type: 'abilities'}).subscribe(
            (res) => {
                return {
                    status: 'success',
                    data: res
                };
            },
            (err) => {
                throw new HttpException(err, 500);
            }
        );
    }

    /**
     * @dev testing service: search
     * @notice: searches the 'pokemons' index for matching documents
     */
    async searchIndex(q: string) {
        const body = {
            size: 200,
            from: 0,
            query: {
                match: {
                    url: q
                }
            }
        };
        return this.elasticsearchService.search({index: 'pokemons', body, q}).subscribe(
            (res) => res.hits.hits,
            (err) => {
                throw new HttpException(err, 500);
            }
        );
    }

    // TODO: update the dto and complete the write and read methods
    async dumpToSearch(writeFileDto: WriteFileDto) {
        return this.elasticsearchService.create({
            index: 'work',
            type: 'metadata',
            body: {
                authorAccount: String(`0xETH${Math.random()}`),
                title: writeFileDto.title,
                content: writeFileDto.content
            }
        });
    }

    // async bulkInsert(abilities: any[]) {
    //     const bulk = [];
    //     abilities.forEach(ability => {
    //         bulk.push({
    //             index: {_index: 'pokemons', _type: 'abilities'}
    //         });
    //         bulk.push(ability);
    //     });
    //     return await this.esclient.bulk({
    //         body: bulk,
    //         index: 'pokemons',
    //         type: 'abilities'
    //     })
    //     .then(res => ({status: 'success', data: res}))
    //     .catch(err => { throw new HttpException(err, 500); });
    // }

    // // searches the 'pokemons' index for matching documents
    // async searchIndex(q: string) {
    //     const body = {
    //         size: 200,
    //         from: 0,
    //         query: {
    //             match: {
    //                 url: q,
    //             },
    //         },
    //     };
    //     return await this.esclient.search({index: 'pokemons', body, q})
    //         .then(res => res.hits.hits)
    //         .catch(err => { throw new HttpException(err, 500); });
    // }
}
