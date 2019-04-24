import {IsEthereumAddress} from './is-ethereum-address';
import {validate} from 'class-validator';

class Address {
    @IsEthereumAddress()
    address: string;
}

describe('isEthereumAddress', async () => {
    it('should return true if string is valid ethereum address', async () => {
        const obj = new Address();
        obj.address = '0xd0D3c4cCd967b142283F9FE8ad6B991571f7C2b2';

        const errors = await validate(obj);

        expect(errors).toEqual([]);
    });

    it('should return false if string is invalid ethereum address', async () => {
        const obj = new Address();
        obj.address = '0xnotanaddress';

        const errors = await validate(obj);

        expect(errors.length).toBe(1);
    });
});
