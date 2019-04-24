import {Injectable} from '@nestjs/common';
import * as readlineSync from 'readline-sync';
import {Command, Positional, Option} from '../command';
import {UsersService} from './users.service';
import {CreateUserDto} from './dto/create-user.dto';

@Injectable()
export class UserCommand {
    constructor(private readonly usersService: UsersService) {}

    @Command({command: 'user:create [options] <username>', describe: 'create a new user'})
    async create(
        @Positional({
            name: 'username',
            describe: 'The username of the user. (Could be also an email address.)',
            type: 'string'
        })
        username: string,
        @Option({
            name: 'password',
            alias: 'p',
            describe: 'The password of the user',
            demandOption: false,
            type: 'string'
        })
        passwordFromOptions: string,
        @Option({
            name: 'email',
            alias: 'e',
            describe: "The email address of the user. (It's used for sending emails. A user which isn't used by a real person may not need this.)",
            demandOption: false,
            default: null,
            type: 'string'
        })
        email: string,
        @Option({
            name: 'givenName',
            describe: 'The given name of the user.',
            demandOption: false,
            default: null,
            type: 'string'
        })
        givenName: string,
        @Option({
            name: 'familyName',
            describe: 'The family name of the user.',
            demandOption: false,
            default: null,
            type: 'string'
        })
        familyName: string,
        @Option({
            name: 'active',
            describe: 'Specifies if the user is active or not.',
            demandOption: false,
            default: true,
            type: 'boolean'
        })
        active: boolean,
        @Option({
            name: 'verifyEmail',
            describe:
                'If `true`, the user will receive a verification email after creation, even if created with `email_verified` set to true. If false, the user will not receive a verification email, even if created with `email_verified` set to `false`. If unspecified, defaults to the behavior determined by the value of `email_verified`.',
            demandOption: false,
            default: false,
            type: 'boolean'
        })
        verifyEmail: boolean,
        @Option({
            name: 'emailVerified',
            describe:
                "`true` if the user's email is verified, false otherwise. If it is true then the user will not receive a verification email, unless `verify_email` is set to `true`.",
            demandOption: false,
            default: false,
            type: 'boolean'
        })
        emailVerified: boolean
    ) {
        const password = passwordFromOptions || this.promptPassword();

        console.log('Create user');
        const user: CreateUserDto = {username, password, email, givenName, familyName, active, verifyEmail, emailVerified};
        await this.usersService.create(user);
    }

    @Command({command: 'user:set-password [options] <username>', describe: 'set password of user'})
    async setPassword(
        @Positional({
            name: 'username',
            describe: 'The username of the user',
            type: 'string'
        })
        username: string,
        @Option({
            name: 'password',
            alias: 'p',
            describe: 'The password of the user',
            demandOption: false,
            type: 'string'
        })
        passwordFromOptions: string
    ) {
        const user = await this.usersService.findByUsername(username);

        if (!user) {
            console.log('User does not exist.');
            process.exit();
        }

        const password = passwordFromOptions || this.promptPassword();

        user.passwordHash = await this.usersService.getHash(password);

        console.log('Set password');
        await this.usersService.update(user);
    }

    @Command({command: 'user:delete <username>', describe: 'delete user'})
    async delete(
        @Positional({
            name: 'username',
            describe: 'The username of the user',
            type: 'string'
        })
        username: string
    ) {
        const user = await this.usersService.findByUsername(username);

        if (!user) {
            console.log('User does not exist.');
            process.exit();
        }

        if (!readlineSync.keyInYN(`Do you really want to delete user "${user.username}"?`)) {
            process.exit();
        }

        console.log('Delete user');
        await this.usersService.delete(user.id);
    }

    promptPassword() {
        const password = readlineSync.question('Enter your password: ');

        if (!password || password.length === 0) {
            console.log('The password should not be empty.');
            return this.promptPassword();
        }

        return password;
    }
}
