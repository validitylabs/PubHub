import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ConfigurationModule} from '../configuration/configuration.module';
import {UsersModule} from '../users/users.module';
import {UserChangePasswordController} from './user-change-password-tickets.controller';
import {UserChangePasswordTicketsService} from './user-change-password-tickets.service';
import {UserChangePasswordTicket} from './user-change-password-ticket.entity';

const entities = [UserChangePasswordTicket];

@Module({
    imports: [TypeOrmModule.forFeature(entities), ConfigurationModule, UsersModule],
    controllers: [UserChangePasswordController],
    providers: [UserChangePasswordTicketsService],
    exports: [UserChangePasswordTicketsService]
})
class UserChangePasswordTicketsModule {}

export {UserChangePasswordTicketsModule, entities};
