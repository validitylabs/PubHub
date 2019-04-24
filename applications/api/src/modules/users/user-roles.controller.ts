import {Controller, Post, Body, Get, Delete, Param, ParseIntPipe} from '@nestjs/common';
import {IUserRolesService} from './user-roles.service';
import {CreateUserRoleDto} from './dto/create-user-role.dto';

@Controller('IUserRoles')
export class IUserRolesController {
    constructor(private readonly userRolesService: IUserRolesService) {}

    @Post()
    async create(@Body() createUserDto: CreateUserRoleDto) {
        return this.userRolesService.create(createUserDto);
    }

    @Get()
    async findAll() {
        return this.userRolesService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id', new ParseIntPipe()) id) {
        return this.userRolesService.findById(id);
    }

    @Delete(':id')
    async delete(@Param('id', new ParseIntPipe()) id) {
        return this.userRolesService.delete(id);
    }
}
