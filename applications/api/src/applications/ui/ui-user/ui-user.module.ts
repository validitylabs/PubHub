import {Module} from '@nestjs/common';
import {UiUserController} from './ui-user.controller';
import {UiUserService} from './ui-user.service';
import {AuthModule} from '../../../modules/auth/auth.module';
import {UsersModule} from '../../../modules/users/users.module';
import {UserChangePasswordTicketsModule} from '../../../modules/user-change-password-tickets/user-change-password-tickets.module';

@Module({
    imports: [AuthModule, UsersModule, UserChangePasswordTicketsModule],
    controllers: [UiUserController],
    providers: [UiUserService],
    exports: [UiUserService]
})
export class UiUserModule {}
