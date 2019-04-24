import {IsNotEmpty, MinLength} from 'class-validator';
import {Password} from '../../../../validation';

export class SettingsUpdatePasswordDto {
    @IsNotEmpty()
    @MinLength(8)
    currentPassword: string;

    @Password()
    newPassword: string;
}
