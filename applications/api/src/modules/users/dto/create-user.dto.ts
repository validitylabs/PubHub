import {IsString, IsBoolean, IsEmail, IsNotEmpty, IsOptional} from 'class-validator';
import {Password} from '../../../validation';

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    username: string;

    @Password()
    password: string;

    @IsOptional()
    @IsBoolean()
    active?: boolean;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsBoolean()
    emailVerified?: boolean;

    @IsOptional()
    @IsBoolean()
    verifyEmail?: boolean;

    @IsOptional()
    @IsString()
    givenName?: string;

    @IsOptional()
    @IsString()
    familyName?: string;
}
