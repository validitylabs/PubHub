import {Injectable, ForbiddenException} from '@nestjs/common';
import {UsersService} from '../../../modules/users/users.service';
import {User} from '../../../modules/users/user.entity';
import {UserChangePasswordTicketsService} from '../../../modules/user-change-password-tickets/user-change-password-tickets.service';
import {ChangePasswordRequestDto} from './dto/change-password-request.dto';
import {ChangePasswordDto} from './dto/change-password.dto';
import {ValidateChangePasswordTicketDto} from './dto/validate-change-password-ticket.dto';
import {IUiUserResponse} from './types/ui-user-response.interface';

@Injectable()
export class UiUserService {
    constructor(private readonly usersService: UsersService, private readonly userChangePasswordTicketsService: UserChangePasswordTicketsService) {}

    async getUser(user: User): Promise<IUiUserResponse> {
        return this.toResponse(user);
    }

    async changePasswordRequest(changePasswordRequestDto: ChangePasswordRequestDto) {
        try {
            await this.userChangePasswordTicketsService.create({email: changePasswordRequestDto.email});
        } catch (error) {
            console.log('ERROR /ui/user/change-password-request', error);
        }
    }

    async validateChangePasswordTicket(validateChangePasswordTicketDto: ValidateChangePasswordTicketDto) {
        const ticket = await this.userChangePasswordTicketsService.findById(validateChangePasswordTicketDto.id);

        if (!ticket || !ticket.isValid()) {
            throw new ForbiddenException('Change password ticket does not exist or is expired.');
        }
    }

    async changePassword(changePasswordDto: ChangePasswordDto) {
        const ticket = await this.userChangePasswordTicketsService.findById(changePasswordDto.ticketId);

        if (!ticket || !ticket.isValid()) {
            throw new ForbiddenException('Change password ticket does not exist or is expired.');
        }

        await this.usersService.setPassword(ticket.userId, changePasswordDto.password);

        await this.userChangePasswordTicketsService.delete(ticket.id);
    }

    public toResponse(user: User): IUiUserResponse {
        return {
            givenName: user.givenName,
            familyName: user.familyName,
            email: user.email
        };
    }
}
