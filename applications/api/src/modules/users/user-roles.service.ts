import {Injectable, BadRequestException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {UserRole} from './user-role.entity';
import {User} from './user.entity';
import {CreateUserRoleDto} from './dto/create-user-role.dto';

@Injectable()
export class IUserRolesService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(UserRole)
        private readonly userRoleRepository: Repository<UserRole>
    ) {}

    async create(createUserRoleDto: CreateUserRoleDto): Promise<UserRole> {
        const user = await this.userRepository.findOne({id: createUserRoleDto.userId});

        if (!user) {
            throw new BadRequestException(`User with id ${createUserRoleDto.userId} does not exist`);
        }

        const existingUserRole = await this.userRoleRepository.findOne({user, role: createUserRoleDto.role});

        if (existingUserRole) {
            throw new BadRequestException(`Role ${createUserRoleDto.role} is already assigned to user ${createUserRoleDto.userId}`);
        }

        const userRole = new UserRole();

        userRole.user = user;
        userRole.role = createUserRoleDto.role;

        await this.userRoleRepository.save(userRole);

        return userRole;
    }

    async findAll(): Promise<UserRole[]> {
        return this.userRoleRepository.find();
    }

    async findById(id: string): Promise<UserRole> {
        return this.userRoleRepository.findOne(id);
    }

    async delete(id: string) {
        await this.userRoleRepository.delete(id);
    }

    async update(userRole: UserRole) {
        return this.userRoleRepository.save(userRole);
    }
}
