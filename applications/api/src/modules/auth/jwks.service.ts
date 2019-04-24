import {Injectable} from '@nestjs/common';
import {JwkService} from '../jwk/jwk.service';

@Injectable()
export class JWKSService {
    constructor(private readonly jwkService: JwkService) {}

    async getJWKS(): Promise<object> {
        const key = await this.jwkService.getKey();

        return key.keystore.toJSON(false);
    }
}
