import {IsNotEmpty, IsString} from 'class-validator';

export class CreateUserRoleDto {
    @IsNotEmpty()
    @IsString()
    userId: string;

    @IsNotEmpty()
    @IsString()
    role: string;
}
