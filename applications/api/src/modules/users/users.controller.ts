import {GetUserByEmailDto} from './dto/get-user-by-email.dto';
import {Controller, Post, Body, Get, Delete, Param, Query, ParseIntPipe} from '@nestjs/common';
import {UsersService} from './users.service';
import {CreateUserDto} from './dto/create-user.dto';
import {IUserResponse} from './types/user-response.interface';

@Controller('Users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    async create(@Body() createUserDto: CreateUserDto): Promise<IUserResponse> {
        return (await this.usersService.create(createUserDto)).getResponse();
    }

    @Get()
    async findAll(): Promise<IUserResponse[]> {
        return (await this.usersService.findAll()).map((user) => user.getResponse());
    }

    @Get(':id')
    async findOne(@Param('id', new ParseIntPipe()) id): Promise<IUserResponse> {
        return (await this.usersService.findById(id)).getResponse();
    }

    @Get('by-email')
    async getByEmail(@Query() query: GetUserByEmailDto): Promise<IUserResponse> {
        const user = await this.usersService.findByEmailAddress(query.email);

        if (!user) {
            return null;
        }

        return user.getResponse();
    }

    @Delete(':id')
    async delete(@Param('id', new ParseIntPipe()) id) {
        return this.usersService.delete(id);
    }

    @Get(':userId/roles')
    async findAllRoles(@Param('userId', new ParseIntPipe()) userId): Promise<IUserResponse> {
        return (await this.usersService.findById(userId)).getResponse();
    }

    @Get(':userId/roles/:userRoleId')
    async findOneRole(@Param('userId', new ParseIntPipe()) userId): Promise<IUserResponse> {
        return (await this.usersService.findById(userId)).getResponse();
    }
}
