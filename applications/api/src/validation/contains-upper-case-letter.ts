import {registerDecorator, ValidationOptions} from 'class-validator';

export function ContainsUpperCaseLetter(validationOptions?: ValidationOptions) {
    return (object: Object, propertyName: string) => {
        registerDecorator({
            name: 'containsUpperCaseLetter',
            target: object.constructor,
            propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value: string) {
                    return Boolean(value && value.match(/[A-Z]/));
                },
                defaultMessage() {
                    return '$property must contain at least one upper case letter (A-Z)';
                }
            }
        });
    };
}
