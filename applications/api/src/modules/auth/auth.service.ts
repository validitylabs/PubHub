import {JwtService} from '@nestjs/jwt';
import {Injectable} from '@nestjs/common';
import {UsersService} from '../users/users.service';
import {User} from '../users/user.entity';
import {IJwtPayload} from './interfaces/jwt-payload.interface';
import {IToken} from './interfaces/token.interface';

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) {}

    async createToken(id: string, username: string, email: string): Promise<IToken> {
        const user = {id, username, email};
        const token = this.jwtService.sign(user);
        return {
            expiresIn: 3600,
            token
        };
    }

    async validateUser(signedUser: IJwtPayload): Promise<User | null> {
        if (signedUser && signedUser.email) {
            return this.usersService.findByEmailAddress(signedUser.email);
        }

        return null;
    }
}
