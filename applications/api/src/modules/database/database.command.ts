import {Injectable} from '@nestjs/common';
import {InjectConnection} from '@nestjs/typeorm';
import {Command} from '../command';
import {Connection} from 'typeorm';

@Injectable()
export class DatabaseCommand {
    constructor(
        @InjectConnection('default')
        private readonly connection: Connection
    ) {}

    @Command({command: 'db:schema:drop', describe: 'drop database schema'})
    async dropSchema() {
        console.log('Drop database schema');
        await this.connection.dropDatabase();
    }

    @Command({command: 'db:schema:sync', describe: 'sync database schema'})
    async syncSchema() {
        console.log('Sync database schema');
        await this.connection.synchronize();
    }
}
