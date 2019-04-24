import {HttpStatus, HttpException} from '@nestjs/common';
import {createHttpExceptionBody} from '@nestjs/common/utils/http-exception-body.util';
import {ValidationError} from 'class-validator';

export class ValidationErrorException extends HttpException {
    constructor(errors: ValidationError[], error = 'Validation error') {
        super(createHttpExceptionBody({message: errors, error, statusCode: HttpStatus.BAD_REQUEST}, error, HttpStatus.BAD_REQUEST), HttpStatus.BAD_REQUEST);
    }
}
