import {registerDecorator, ValidationOptions} from 'class-validator';

export function IsEthereumAddress(validationOptions?: ValidationOptions) {
    return (object: Object, propertyName: string) => {
        registerDecorator({
            name: 'isEthereumAddress',
            target: object.constructor,
            propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value: string) {
                    return Boolean(value && value.search(/^0x[a-fA-F0-9]{40}$/) === 0);
                },
                defaultMessage() {
                    return '$property is not a valid ethereum address';
                }
            }
        });
    };
}
