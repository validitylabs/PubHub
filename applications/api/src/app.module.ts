import {Module, NestModule, MiddlewareConsumer} from '@nestjs/common';
import {RequestLoggerMiddleware} from './middleware/request-logger.middleware';

// Modules
import {CommandModule} from './modules/command';
import {DatabaseModule} from './modules/database/database.module';
import {JwkModule} from './modules/jwk';
import {StatusModule} from './modules/status/status.module';

// Applications

@Module({
    imports: [
        // AuthModule,
        CommandModule,
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
