export enum AccountActionTypes {
    LOGOUT_ACCOUNT = 'LOGOUT_ACCOUNT',
    UPDATE_CURRENT_ACCOUNT = 'UPDATE_CURRENT_ACCOUNT',
    UPDATE_IPFS_HASH = 'UPDATE_IPFS_HASH'
}

export interface IAccount {
    address: string;
    latestIpfsHash: string;
}

export type AccountState = IAccount | null;
