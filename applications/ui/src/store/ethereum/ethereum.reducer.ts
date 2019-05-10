import {Reducer} from 'redux';
import {AccountActionTypes, AccountState} from './ethereum.types';

export const ethereumAccountReducer: Reducer<AccountState> = (state = null, action) => {
    switch (action.type) {
        case AccountActionTypes.LOGOUT_ACCOUNT:
            return null;
        case AccountActionTypes.UPDATE_CURRENT_ACCOUNT:
            return {
                address: action.payload.accAddress,
                latestIpfsHash: 'Qm'
            };
        case AccountActionTypes.UPDATE_IPFS_HASH:
            switch (state) {
                case null:
                    return state;
                default:
                    return {
                        ...state,
                        latestIpfsHash: action.payload.ipfsDigest
                    };
            }
        default:
            return state;
    }
};
