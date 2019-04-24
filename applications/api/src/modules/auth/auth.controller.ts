import {Controller, Post, Body, ForbiddenException} from '@nestjs/common';
import {AuthService} from './auth.service';
import {UsersService} from '../users/users.service';
import {AuthUserDto} from './dto/auth-user.dto';
import {IToken} from './interfaces/token.interface';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService, private readonly usersService: UsersService) {}

    @Post('login')
    async loginUser(@Body() body: AuthUserDto): Promise<IToken> {
        const user = await this.usersService.findByUsername(body.username);

        if (user && (await this.usersService.compareHash(body.password, user.passwordHash))) {
            return this.authService.createToken(user.id, user.username, user.email);
        }

        throw new ForbiddenException('Incorrect username or password.');
    }
}
