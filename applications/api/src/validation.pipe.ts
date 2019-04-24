import {Optional} from '@nestjs/common/decorators';
import {Injectable} from '@nestjs/common/decorators/core/component.decorator';
import {ArgumentMetadata} from '@nestjs/common';
import {ValidatorOptions} from '@nestjs/common/interfaces/external/validator-options.interface';
import {PipeTransform} from '@nestjs/common/interfaces/features/pipe-transform.interface';
import {isNil} from '@nestjs/common/utils/shared.utils';
import * as classValidator from 'class-validator';
import * as classTransformer from 'class-transformer';
import {ValidationErrorException} from './exceptions/validation-error.exception';

export interface IValidationPipeOptions extends ValidatorOptions {
    transform?: boolean;
    disableErrorMessages?: boolean;
    exceptionFactory?(errors: classValidator.ValidationError[]): any;
}

@Injectable()
export class ValidationPipe implements PipeTransform {
    protected isTransformEnabled: boolean;
    protected isDetailedOutputDisabled?: boolean;
    protected validatorOptions: ValidatorOptions;
    protected exceptionFactory: (errors: classValidator.ValidationError[]) => any;

    constructor(@Optional() options?: IValidationPipeOptions) {
        const internalOptions = options || {};
        const {transform, disableErrorMessages, ...validatorOptions} = internalOptions;
        this.isTransformEnabled = !!transform;
        this.validatorOptions = validatorOptions;
        this.isDetailedOutputDisabled = disableErrorMessages;
        this.exceptionFactory =
            internalOptions.exceptionFactory || ((errors) => new ValidationErrorException(this.isDetailedOutputDisabled ? undefined : errors));
    }

    public async transform(value, metadata: ArgumentMetadata) {
        const {metatype} = metadata;
        if (!metatype || !this.toValidate(metadata)) {
            return value;
        }
        const entity = classTransformer.plainToClass(metatype, this.toEmptyIfNil(value));
        const errors = await classValidator.validate(entity, this.validatorOptions);
        if (errors.length > 0) {
            throw this.exceptionFactory(errors);
        }
        if (this.isTransformEnabled) {
            return entity;
        }
        if (Object.keys(this.validatorOptions).length > 0) {
            return classTransformer.classToPlain(entity);
        }
        return value;
    }

    toEmptyIfNil<T = any, R = any>(value: T): R | {} {
        return isNil(value) ? {} : value;
    }

    private toValidate(metadata: ArgumentMetadata): boolean {
        const {metatype, type} = metadata;
        if (type === 'custom') {
            return false;
        }
        const types = [String, Boolean, Number, Array, Object];
        return !types.some((t) => metatype === t) && !isNil(metatype);
    }
}
