import {Controller, Get, Post, Body, Query} from '@nestjs/common';
import {SearchService} from './elastic.service';

@Controller('search')
export class SearchController {
    constructor(private readonly searchService: SearchService) {}

    @Post('create')
    async createIndexAndInsert(@Body() documents: any[]) {
        return this.searchService.bulkInsert(documents);
    }

    @Get('search')
    async searchPokemonAbilities(@Query('q') q: string) {
        return this.searchService.searchIndex(q);
    }
}
