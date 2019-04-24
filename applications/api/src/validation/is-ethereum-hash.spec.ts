import {IsEthereumHash} from './is-ethereum-hash';
import {validate} from 'class-validator';

class Hash {
    @IsEthereumHash()
    address: string;
}

describe('isEthereumHash', async () => {
    it('should return true if string is valid ethereum hash', async () => {
        const obj = new Hash();
        obj.address = '0x33719cd7b02b4695277915a1d645b9e95d26f45dec59f9be1d61f9cfe8c04d0d';

        const errors = await validate(obj);

        expect(errors).toEqual([]);
    });

    it('should return false if string is invalid ethereum hash', async () => {
        const obj = new Hash();
        obj.address = '0xnotahash';

        const errors = await validate(obj);

        expect(errors.length).toBe(1);
    });
});
