import {IsNotEmpty, IsString, MinLength} from 'class-validator';
import {ContainsLowerCaseLetter, ContainsNumericCharacter, ContainsSpecialCharacter, ContainsUpperCaseLetter} from './';

export function Password() {
    return (object: Object, propertyName: string) => {
        IsNotEmpty()(object, propertyName);
        IsString()(object, propertyName);
        MinLength(8)(object, propertyName);
        ContainsLowerCaseLetter()(object, propertyName);
        ContainsNumericCharacter()(object, propertyName);
        ContainsSpecialCharacter()(object, propertyName);
        ContainsUpperCaseLetter()(object, propertyName);
    };
}
