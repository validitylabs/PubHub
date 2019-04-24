import {IsEndpoint} from './is-endpoint';
import {validate} from 'class-validator';

class Endpoint {
    @IsEndpoint()
    endpoint: string;
}

describe('IsEndpoint', async () => {
    it('should return true if string is an valid endpoint', async () => {
        const obj = new Endpoint();
        obj.endpoint = 'https://example.com';

        const errors = await validate(obj);

        expect(errors).toEqual([]);
    });

    it('should return true if string is an valid endpoint', async () => {
        const obj = new Endpoint();
        obj.endpoint = 'https://example.com:3000';

        const errors = await validate(obj);

        expect(errors).toEqual([]);
    });

    it('should return false if string is an invalid endpoint', async () => {
        const obj = new Endpoint();
        obj.endpoint = 'https://example.com/';

        const errors = await validate(obj);

        expect(errors.length).toBe(1);
    });
});
