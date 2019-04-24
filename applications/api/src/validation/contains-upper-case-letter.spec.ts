import {ContainsUpperCaseLetter} from './contains-upper-case-letter';
import {validate} from 'class-validator';

class Test {
    @ContainsUpperCaseLetter()
    value: string;
}

describe('ContainsUpperCaseLetter', async () => {
    it('should return true if the string contains an upper case letter', async () => {
        const obj = new Test();
        obj.value = 'Test';

        const errors = await validate(obj);

        expect(errors).toEqual([]);
    });

    it('should return false if the string contains no upper case letter', async () => {
        const obj = new Test();
        obj.value = 'test';

        const errors = await validate(obj);

        expect(errors.length).toBe(1);
    });
});
