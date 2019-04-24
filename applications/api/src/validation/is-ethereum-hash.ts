import {registerDecorator, ValidationOptions} from 'class-validator';

export function IsEthereumHash(validationOptions?: ValidationOptions) {
    return (object: Object, propertyName: string) => {
        registerDecorator({
            name: 'isEthereumHash',
            target: object.constructor,
            propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value: string) {
                    return Boolean(value && value.search(/^0x[a-fA-F0-9]{64}$/) === 0);
                },
                defaultMessage() {
                    return '$property is not a valid ethereum hash';
                }
            }
        });
    };
}
