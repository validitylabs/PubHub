import {Injectable, UnauthorizedException} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {ExtractJwt, Strategy} from 'passport-jwt';
import {JwkService} from '../../jwk/jwk.service';
import {AuthService} from '../auth.service';
import {IJwtPayload} from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(jwkService: JwkService, private readonly authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKeyProvider: async (_request: any, _rawJwtToken: any, done: (err: any, secret: string) => void) => {
                const publicKey = await jwkService.toPEM(false);

                done(null, publicKey);
            }
        });
    }

    async validate(payload: IJwtPayload) {
        const user = await this.authService.validateUser(payload);

        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}
