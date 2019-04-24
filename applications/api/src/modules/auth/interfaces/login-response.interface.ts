import {IToken} from './token.interface';

export interface ILoginResponse extends IToken {
    profile: {
        givenName: string;
        familyName: string;
        email: string;
    };
}
