import {Controller, Get, Post, UseGuards, Request, Body, HttpCode, HttpStatus} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {ChangePasswordRequestDto} from './dto/change-password-request.dto';
import {ChangePasswordDto} from './dto/change-password.dto';
import {ValidateChangePasswordTicketDto} from './dto/validate-change-password-ticket.dto';
import {IUiUserResponse} from './types/ui-user-response.interface';
import {UiUserService} from './ui-user.service';

@Controller('ui/user')
export class UiUserController {
    constructor(private readonly uiUserService: UiUserService) {}

    @Get()
    @UseGuards(AuthGuard())
    async getUser(@Request() req): Promise<IUiUserResponse> {
        return this.uiUserService.getUser(req.user);
    }

    @Post('change-password-request')
    @HttpCode(HttpStatus.CREATED)
    async changePasswordRequest(@Body() changePasswordRequestDto: ChangePasswordRequestDto) {
        return this.uiUserService.changePasswordRequest(changePasswordRequestDto);
    }

    @Post('validate-change-password-ticket')
    @HttpCode(HttpStatus.NO_CONTENT)
    async validateChangePasswordTicket(@Body() validateChangePasswordTicketDto: ValidateChangePasswordTicketDto) {
        return this.uiUserService.validateChangePasswordTicket(validateChangePasswordTicketDto);
    }

    @Post('change-password')
    @HttpCode(HttpStatus.NO_CONTENT)
    async changePassword(@Body() changePasswordDto: ChangePasswordDto) {
        return this.uiUserService.changePassword(changePasswordDto);
    }
}
