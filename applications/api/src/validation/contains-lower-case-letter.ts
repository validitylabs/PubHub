import {registerDecorator, ValidationOptions} from 'class-validator';

export function ContainsLowerCaseLetter(validationOptions?: ValidationOptions) {
    return (object: Object, propertyName: string) => {
        registerDecorator({
            name: 'containsLowerCaseLetter',
            target: object.constructor,
            propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value: string) {
                    return Boolean(value && value.match(/[a-z]/));
                },
                defaultMessage() {
                    return '$property must contain at least one lower case letter (a-z)';
                }
            }
        });
    };
}
