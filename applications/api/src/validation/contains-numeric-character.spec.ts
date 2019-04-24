import {ContainsNumericCharacter} from './contains-numeric-character';
import {validate} from 'class-validator';

class Test {
    @ContainsNumericCharacter()
    value: string;
}

describe('ContainsNumericCharacter', async () => {
    it('should return true if the string contains at least one numeric character', async () => {
        const obj = new Test();
        obj.value = 'test2';

        const errors = await validate(obj);

        expect(errors).toEqual([]);
    });

    it('should return true if the string contains at least one numeric character', async () => {
        const obj = new Test();
        obj.value = '1test10';

        const errors = await validate(obj);

        expect(errors).toEqual([]);
    });

    it('should return false if the string contains no numeric characters', async () => {
        const obj = new Test();
        obj.value = 'test';

        const errors = await validate(obj);

        expect(errors.length).toBe(1);
    });
});
