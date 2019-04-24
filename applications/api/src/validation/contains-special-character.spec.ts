import {ContainsSpecialCharacter} from './contains-special-character';
import {validate} from 'class-validator';

class Test {
    @ContainsSpecialCharacter()
    value: string;
}

describe('ContainsSpecialCharacter', async () => {
    it('should return true if the string contains at least one special character', async () => {
        const obj = new Test();
        obj.value = 'test!';

        const errors = await validate(obj);

        expect(errors).toEqual([]);
    });

    it('should return true if the string contains at least one special character', async () => {
        const obj = new Test();
        obj.value = '$test#';

        const errors = await validate(obj);

        expect(errors).toEqual([]);
    });

    it('should return false if the string contains no special characters', async () => {
        const obj = new Test();
        obj.value = 'test';

        const errors = await validate(obj);

        expect(errors.length).toBe(1);
    });
});
