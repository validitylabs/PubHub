import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {UsersController} from './users.controller';
import {IUserRolesController} from './user-roles.controller';
import {UsersService} from './users.service';
import {IUserRolesService} from './user-roles.service';
import {User} from './user.entity';
import {UserRole} from './user-role.entity';
import {UserCommand} from './user.command';

const entities = [User, UserRole];

@Module({
    imports: [TypeOrmModule.forFeature(entities)],
    controllers: [UsersController, IUserRolesController],
    providers: [UsersService, IUserRolesService, UserCommand],
    exports: [UsersService, IUserRolesService]
})
class UsersModule {}

export {UsersModule, entities};
