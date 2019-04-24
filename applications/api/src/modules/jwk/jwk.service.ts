import {Injectable} from '@nestjs/common';
import * as jose from 'node-jose';
import * as fs from 'fs';
import * as path from 'path';
import {ConfigurationService} from '../configuration/configuration.service';

@Injectable()
export class JwkService {
    private _key: jose.JWK.Key;

    constructor(private readonly configuration: ConfigurationService) {}

    async createKeyPair(destinationPath: string): Promise<void> {
        const key = await jose.JWK.createKey('EC', 'P-256', {alg: 'ES256', use: 'sig'});

        fs.writeFileSync(path.join(destinationPath, 'jwk-private.json'), JSON.stringify(key.toJSON(true)));
        fs.writeFileSync(path.join(destinationPath, 'jwk-public.json'), JSON.stringify(key.toJSON(false)));
    }

    async toPEM(isPrivate?: boolean): Promise<string> {
        const key = await this.getKey();

        return key.toPEM(isPrivate);
    }

    async getKey(): Promise<jose.JWK.Key> {
        if (!this._key) {
            const result = await jose.JWK.asKey(fs.readFileSync(this.configuration.get('JWK_PRIVATE_FILE_PATH')), 'json');

            this._key = result;
        }

        return this._key;
    }
}
