import {registerDecorator, ValidationOptions} from 'class-validator';

export function IsEndpoint(validationOptions?: ValidationOptions) {
    return (object: Object, propertyName: string) => {
        registerDecorator({
            name: 'isEndpoint',
            target: object.constructor,
            propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value: string) {
                    return Boolean(value && value.search(/^https:\/\/.*[^\/]$/) === 0);
                },
                defaultMessage() {
                    return '$property is not a valid endpoint. The value have to match the following schema without a trailing slash (https://www.company.com)';
                }
            }
        });
    };
}
