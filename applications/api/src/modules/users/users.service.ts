import {Injectable, ForbiddenException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import * as bcrypt from 'bcrypt';
import {User} from './user.entity';
import {CreateUserDto} from './dto/create-user.dto';

@Injectable()
export class UsersService {
    private readonly saltRounds = 10;

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        const existingUser = await this.findByUsername(createUserDto.username);

        if (existingUser) {
            throw new ForbiddenException('Username exists');
        }

        const user = new User();

        user.username = createUserDto.username;
        user.passwordHash = await this.getHash(createUserDto.password);
        user.active = createUserDto.active;
        user.email = createUserDto.email;
        user.emailVerified = createUserDto.emailVerified;
        user.verifyEmail = createUserDto.verifyEmail;
        user.givenName = createUserDto.givenName;
        user.familyName = createUserDto.familyName;

        await this.userRepository.save(user);

        return user;
    }

    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    async findById(id: string): Promise<User> {
        return this.userRepository.findOne(id);
    }

    async findByUsername(username: string): Promise<User> {
        return (await this.userRepository.find({username})).shift();
    }

    async findByEmailAddress(email: string): Promise<User> {
        return (await this.userRepository.find({email})).shift();
    }

    async delete(id: string) {
        return this.userRepository.delete(id);
    }

    async setPassword(userId: string, password: string) {
        const user = await this.findById(userId);

        user.passwordHash = await this.getHash(password);

        return this.userRepository.save(user);
    }

    async update(user: User) {
        return this.userRepository.save(user);
    }

    async getHash(password: string | undefined): Promise<string> {
        return bcrypt.hash(password, this.saltRounds);
    }

    async compareHash(password: string | undefined, hash: string | undefined): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }
}
