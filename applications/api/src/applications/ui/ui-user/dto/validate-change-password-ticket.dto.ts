import {IsNotEmpty, IsString} from 'class-validator';

export class ValidateChangePasswordTicketDto {
    @IsNotEmpty()
    @IsString()
    readonly id: string;
}
