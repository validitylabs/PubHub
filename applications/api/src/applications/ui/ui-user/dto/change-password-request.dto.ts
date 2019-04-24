import {IsNotEmpty, IsEmail} from 'class-validator';

export class ChangePasswordRequestDto {
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;
}
