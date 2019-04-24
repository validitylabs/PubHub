import {Injectable} from '@nestjs/common';
import {Command, Positional} from '../command';
import {JwkService} from './jwk.service';

@Injectable()
export class JwkCommand {
    constructor(private readonly jwkService: JwkService) {}

    @Command({command: 'key:create <path>', describe: 'create a new jwk'})
    async dropSchema(
        @Positional({
            name: 'path',
            describe: 'the directory in which the file should be created',
            type: 'string'
        })
        path: string
    ) {
        console.log('Create key pair');
        await this.jwkService.createKeyPair(path);
    }
}
