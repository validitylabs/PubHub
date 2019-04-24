import {ContainsLowerCaseLetter} from './contains-lower-case-letter';
import {validate} from 'class-validator';

class Test {
    @ContainsLowerCaseLetter()
    value: string;
}

describe('ContainsLowerCaseLetter', async () => {
    it('should return true if the string contains an lower case letter', async () => {
        const obj = new Test();
        obj.value = 'Test';

        const errors = await validate(obj);

        expect(errors).toEqual([]);
    });

    it('should return false if the string contains no lower case letter', async () => {
        const obj = new Test();
        obj.value = 'TEST';

        const errors = await validate(obj);

        expect(errors.length).toBe(1);
    });
});
