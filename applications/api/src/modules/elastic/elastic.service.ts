import {Logger, Injectable, HttpException} from '@nestjs/common';
import {ElasticsearchService} from '@nestjs/elasticsearch';
import {SaveWorkDto} from './dto/save-work.dto';
import {IpfsService} from '../ipfs/ipfs.service';
import {Web3Service} from '../web3/web3.service';

@Injectable()
export class SearchService {
    private readonly logger = new Logger('ElasticSearch');
    // private readonly esService: ElasticsearchService;

    constructor(
        private readonly elasticsearchService: ElasticsearchService,
        private readonly ipfsService: IpfsService,
        private readonly web3Service: Web3Service
    ) {
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
                console.log('All good');
            }
        }
    }

    async getContentFromIpfs(work: SaveWorkDto) {
        this.logger.log(` Step 3: IPFS`);
        const result = await this.ipfsService.getAndPinFromIpfs(work.digest);
        console.log('Result got from ipfs is', result);
        // check if user account and ipfs digest matches
        this.logger.log(` Step 4: Verify data with web3`);
        const checkAccountDigest = await this.web3Service.verifyAccountAndHash(work.user, work.digest);
        if (checkAccountDigest) {
            console.log(' [elastic.service.ts] account verified');
        } else {
            return;
        }
        this.logger.log(` Step 5: Return the data`);
        // check if the content matches
        if (work.title === JSON.parse(result).title) {
            console.log(' [elastic.service.ts] inputs verified');
        } else {
            console.log(' [elastic.service.ts] dto', work.title);
            console.log(' [elastic.service.ts] dto', JSON.parse(result).title);
            return;
        }
        return this.insertWork(work);
    }

    /**
     * @dev bulk insert title and content
     * @notice inserting multiple fields at the same time. Needs to be careful on the indice creation.
     */
    async insertWork(work: SaveWorkDto) {
        // async dumpToSearch(writeFileDto: SaveWorkDto) {
        //     return this.elasticsearchService.create({
        //         index: 'work',
        //         type: 'metadata',
        //         body: {
        //             authorAccount: String(`0xETH${Math.random()}`),
        //             title: writeFileDto.title,
        //             content: writeFileDto.content
        //         }
        //     });
        // }
        try {
            return this.elasticsearchService.index({
                index: 'pubhub',
                type: 'works',
                body: {
                    title: work.title,
                    content: work.content,
                    user: work.user,
                    digest: work.digest
                }
            });
        } catch (error) {
            this.logger.error('Failed to index document', error);
            throw new HttpException('Failed to index document.', 500);
        }
    }

    /**
     * @dev testing service: insert
     */
    async bulkInsertWorks(works: SaveWorkDto[]) {
        const bulk = [];
        works.forEach((work) => {
            bulk.push({
                index: {_index: 'pubhub', _type: 'works'}
            });
            bulk.push({
                title: work.title,
                content: work.content,
                user: work.user,
                digest: work.digest
            });
        });
        try {
            return this.elasticsearchService.bulk({body: bulk, index: 'pubhub', type: 'works'});
        } catch (error) {
            this.logger.error('Failed to index document');
            throw new HttpException(error, 500);
        }
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
                multi_match: {
                    query: q,
                    fields: ['title', 'content']
                }
            }
        };
        try {
            // return this.elasticsearchService.search({index: 'pubhub', body, q}).subscribe((value) => {
            //     console.log(value);
            // });
            return this.elasticsearchService.search({index: 'pubhub', body, q});
        } catch (error) {
            this.logger.error('Failed to find document', error);
            throw new HttpException('Failed to find document.', 500);
        }
    }
}
