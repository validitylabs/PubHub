import {registerDecorator, ValidationOptions} from 'class-validator';

export function ContainsNumericCharacter(validationOptions?: ValidationOptions) {
    return (object: Object, propertyName: string) => {
        registerDecorator({
            name: 'containsNumericCharacter',
            target: object.constructor,
            propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value: string) {
                    return Boolean(value && value.match(/[0-9]/));
                },
                defaultMessage() {
                    return '$property must contain at least one numeric character (such as 0-9)';
                }
            }
        });
    };
}
