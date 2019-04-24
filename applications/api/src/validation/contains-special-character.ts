import {registerDecorator, ValidationOptions} from 'class-validator';

export function ContainsSpecialCharacter(validationOptions?: ValidationOptions) {
    return (object: Object, propertyName: string) => {
        registerDecorator({
            name: 'containsSpecialCharacter',
            target: object.constructor,
            propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value: string) {
                    return Boolean(value && value.match(/\W/));
                },
                defaultMessage() {
                    return '$property must contain at least one special character (such as !@#$%^&*)';
                }
            }
        });
    };
}
