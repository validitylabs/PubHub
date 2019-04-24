import {Module} from '@nestjs/common';
import {JwtModule} from '@nestjs/jwt';
import {JwtStrategy} from './passport/jwt.strategy';
import {PassportModule} from '@nestjs/passport';
import {AuthService} from './auth.service';
import {AuthController} from './auth.controller';
import {JWKSController} from './jwks.controller';
import {JWKSService} from './jwks.service';
import {ConfigurationModule} from '../configuration/configuration.module';
import {JwkModule} from '../jwk/jwk.module';
import {JwkService} from '../jwk/jwk.service';
import {UsersModule} from '../users/users.module';

const passportModule = PassportModule.register({defaultStrategy: 'jwt'});

@Module({
    imports: [
        ConfigurationModule,
        JwkModule,
        passportModule,
        JwtModule.registerAsync({
            imports: [JwkModule],
            useFactory: async (jwkService: JwkService) => {
                const key = await jwkService.getKey();
                const privateKey = await jwkService.toPEM(true);

                return {
                    secretOrPrivateKey: privateKey,
                    signOptions: {
                        algorithm: key.alg,
                        expiresIn: 3600
                    }
                };
            },
            inject: [JwkService]
        }),
        UsersModule
    ],
    providers: [AuthService, JWKSService, JwtStrategy],
    controllers: [AuthController, JWKSController],
    exports: [AuthService, JWKSService, passportModule]
})
export class AuthModule {}
