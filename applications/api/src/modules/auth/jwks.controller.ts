import {Controller, Get} from '@nestjs/common';
import {JWKSService} from './jwks.service';

@Controller('.well-known/jwks.json')
export class JWKSController {
    constructor(private readonly jwksService: JWKSService) {}

    @Get()
    async getJWKS() {
        return this.jwksService.getJWKS();
    }
}
