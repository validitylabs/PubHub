import {IsNotEmpty, IsString} from 'class-validator';
import {Password} from '../../../../validation';

export class ChangePasswordDto {
    @IsNotEmpty()
    @IsString()
    readonly ticketId: string;

    @Password()
    readonly password: string;
}
