import {IsEmail, IsNotEmpty} from 'class-validator';

export class CreateUserChangePasswordTicketDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;
}
