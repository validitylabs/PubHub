import {Controller, Get, Post, Body, Query} from '@nestjs/common';
import {SearchService} from './elastic.service';
import {SaveWorkDto} from './dto/save-work.dto';

@Controller('elastic')
export class SearchController {
    constructor(private readonly searchService: SearchService) {}

    @Post('create')
    async insertWork(@Body() document: SaveWorkDto) {
        return this.searchService.insertWork(document);
    }

    @Post('createWorks')
    async bulkInsertWorks(@Body() documents: any[]) {
        return this.searchService.bulkInsertWorks(documents);
    }

    @Get()
    async getRandomStuff() {
        console.log('Testing the REST api');
    }

    @Get('search')
    async searchPokemonAbilities(@Query('q') q: string) {
        return this.searchService.searchIndex(q);
    }
}
