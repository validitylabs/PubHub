import {Injectable, Inject, NotFoundException, BadRequestException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {ConfigurationService} from '../configuration/configuration.service';
import {UsersService} from '../users/users.service';
import {MailProvider} from '../mail/mail.provider';
import {UserChangePasswordTicket} from './user-change-password-ticket.entity';
import {CreateUserChangePasswordTicketDto} from './dto/create-user-change-password-ticket.dto';

@Injectable()
export class UserChangePasswordTicketsService {
    constructor(
        private readonly configuration: ConfigurationService,
        private readonly usersService: UsersService,
        @InjectRepository(UserChangePasswordTicket)
        private readonly userChangePasswordTicketRepository: Repository<UserChangePasswordTicket>,
        @Inject('MailProvider')
        private readonly mailProvider: MailProvider
    ) {}

    async create(createUserChangePasswordTicketDto: CreateUserChangePasswordTicketDto): Promise<UserChangePasswordTicket> {
        const user = await this.usersService.findByEmailAddress(createUserChangePasswordTicketDto.email);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (!user.emailVerified) {
            throw new BadRequestException('Email address of the user is not verified');
        }

        const ticket = new UserChangePasswordTicket();

        ticket.userId = user.id;

        const persistedTicket = await this.userChangePasswordTicketRepository.save(ticket);

        const changePasswordLink = `${this.configuration.get('UI_BASE_URL')}/change-password?id=${persistedTicket.id}`;

        await this.mailProvider.sendMail({
            Destination: {ToAddresses: [user.email]},
            Message: {
                Body: {
                    Html: {
                        Charset: 'UTF-8',
                        Data: `Hello ${
                            user.givenName
                        }!<br /><br />You have submitted a password change request.<br /><br />If it wasn't you please disregard this email and make sure you can still login to your account.<br />If it was you, then confirm the password change <a href="${changePasswordLink}" target="_blank">click here</a>.<br /><br />Best wishes,<br />Validity Labs Team<br /><br />If you did not make this request, please contact us by replying to this mail.`
                    },
                    Text: {
                        Charset: 'UTF-8',
                        Data: `Hello ${
                            user.givenName
                        }!\nYou are invited to join Validity Labs.\nPlease click on the following link to create an account: ${changePasswordLink}.\n\nBest wishes,\nValidity Labs Team`
                    }
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: 'Change password request'
                }
            },
            Source: 'Validity Labs <noreply@token.haus>',
            ReplyToAddresses: ['Validity Labs Support <support@token.haus>']
        });

        return ticket;
    }

    async findAll(): Promise<UserChangePasswordTicket[]> {
        return this.userChangePasswordTicketRepository.find();
    }

    async findById(id: string): Promise<UserChangePasswordTicket> {
        return this.userChangePasswordTicketRepository.findOne(id);
    }

    async delete(id: string) {
        await this.userChangePasswordTicketRepository.delete(id);
    }
}
