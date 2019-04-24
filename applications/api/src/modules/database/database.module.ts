import {Module} from '@nestjs/common';
import {DatabaseCommand} from './database.command';
import {TypeOrmModule, TypeOrmModuleOptions} from '@nestjs/typeorm';
import {ConfigurationModule} from '../configuration/configuration.module';
import {ConfigurationService} from '../configuration/configuration.service';

// Entities
import {entities as userChangePasswordTicketsModuleEntities} from '../user-change-password-tickets';
import {entities as usersModuleEntities} from '../users';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigurationModule],
            useFactory: async (configurationService: ConfigurationService): Promise<TypeOrmModuleOptions> => ({
                name: 'default',
                type: 'mariadb' as any,
                charset: 'utf8mb4',
                host: configurationService.get('DB_HOST'),
                port: configurationService.get('DB_PORT'),
                database: configurationService.get('DB_NAME'),
                username: configurationService.get('DB_USER'),
                password: configurationService.get('DB_PASSWORD'),
                synchronize: Boolean(configurationService.get('DB_SYNCHRONIZE') && configurationService.get('DB_SYNCHRONIZE').toUpperCase() === 'TRUE'),
                keepConnectionAlive: true,
                logging: Boolean(configurationService.get('DB_LOGGING') && configurationService.get('DB_LOGGING').toUpperCase() === 'TRUE'),
                entities: [...userChangePasswordTicketsModuleEntities, ...usersModuleEntities]
            }),
            inject: [ConfigurationService]
        })
    ],
    providers: [DatabaseCommand]
})
export class DatabaseModule {}
