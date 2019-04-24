import {Controller, Post, Get, Delete, Body, Param, ParseIntPipe} from '@nestjs/common';
import {UserChangePasswordTicketsService} from './user-change-password-tickets.service';
import {CreateUserChangePasswordTicketDto} from './dto/create-user-change-password-ticket.dto';

@Controller('user-change-password')
export class UserChangePasswordController {
    constructor(private readonly userChangePasswordTicketsService: UserChangePasswordTicketsService) {}

    @Post()
    async create(@Body() createUserChangePasswordTicketDto: CreateUserChangePasswordTicketDto) {
        return this.userChangePasswordTicketsService.create(createUserChangePasswordTicketDto);
    }

    @Get()
    async findAll() {
        return this.userChangePasswordTicketsService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id', new ParseIntPipe()) id) {
        return this.userChangePasswordTicketsService.findById(id);
    }

    @Delete(':id')
    async delete(@Param('id', new ParseIntPipe()) id) {
        return this.userChangePasswordTicketsService.delete(id);
    }
}
