import {action} from 'typesafe-actions';
import {AccountActionTypes} from './ethereum.types';

export const updateAccount = (accAddress: string) =>
    action(AccountActionTypes.UPDATE_CURRENT_ACCOUNT, {
        accAddress
    });

export const updateIpfs = (ipfsDigest: string) =>
    action(AccountActionTypes.UPDATE_IPFS_HASH, {
        ipfsDigest
    });

export const logoutAccount = () => action(AccountActionTypes.LOGOUT_ACCOUNT);
