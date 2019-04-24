import {Module, NestModule, MiddlewareConsumer} from '@nestjs/common';
import {RequestLoggerMiddleware} from './middleware/request-logger.middleware';

// Modules
import {AuthModule} from './modules/auth';
import {CommandModule} from './modules/command';
import {DatabaseModule} from './modules/database/database.module';
import {JwkModule} from './modules/jwk';
import {StatusModule} from './modules/status/status.module';
import {MailModule} from './modules/mail/mail.module';
import {UserChangePasswordTicketsModule} from './modules/user-change-password-tickets';
import {UsersModule} from './modules/users';

// Applications
import {UIModule} from './applications/ui/ui.module';

@Module({
    imports: [
        AuthModule,
        CommandModule,
        DatabaseModule,
        JwkModule,
        MailModule.forRoot({
            region: 'eu-west-1',
            credentials: {accessKeyId: 'AKIAJ2WIC5NUHK6276BA', secretAccessKey: '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'}
        }),
        StatusModule,
        UserChangePasswordTicketsModule,
        UsersModule,
        UIModule
    ]
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(RequestLoggerMiddleware).forRoutes('/');
    }
}
