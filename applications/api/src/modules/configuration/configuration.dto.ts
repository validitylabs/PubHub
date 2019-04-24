import {IsNotEmpty, IsOptional, IsString, IsNumberString} from 'class-validator';
import {IsEndpoint} from '../../validation/is-endpoint';

export class ConfigurationDto {
    @IsOptional()
    @IsString()
    SSL_CERT: string;

    @IsOptional()
    @IsString()
    SSL_KEY: string;

    @IsNotEmpty()
    @IsEndpoint()
    UI_BASE_URL: string;

    @IsString()
    @IsNotEmpty()
    JWK_PRIVATE_FILE_PATH: string;

    @IsString()
    @IsNotEmpty()
    JWK_PUBLIC_FILE_PATH: string;

    @IsNotEmpty()
    DB_HOST: string;

    @IsNotEmpty()
    @IsNumberString()
    DB_PORT: string;

    @IsNotEmpty()
    DB_NAME: string;

    @IsNotEmpty()
    DB_USER: string;

    @IsNotEmpty()
    DB_PASSWORD: string;

    @IsNotEmpty()
    DB_SYNCHRONIZE: string;

    @IsNotEmpty()
    DB_LOGGING: string;
}
