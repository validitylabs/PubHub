import {Module, NestModule, MiddlewareConsumer} from '@nestjs/common';
import {RequestLoggerMiddleware} from './middleware/request-logger.middleware';

// Modules
import {CommandModule} from './modules/command';
import {Web3Module} from './modules/web3/web3.module';
import {IpfsModule} from './modules/ipfs/ipfs.module';
import {DatabaseModule} from './modules/database/database.module';
import {JwkModule} from './modules/jwk';
import {StatusModule} from './modules/status/status.module';

// Applications

@Module({
    imports: [
        // AuthModule,
        CommandModule,
        Web3Module,
        IpfsModule,
        DatabaseModule,
        JwkModule,
        StatusModule
    ]
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(RequestLoggerMiddleware).forRoutes('/');
    }
}
