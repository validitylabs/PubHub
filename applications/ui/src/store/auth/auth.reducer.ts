import {Reducer} from 'redux';
import {AuthActionTypes, IAuthState} from './auth.types';
import * as authService from '../../libs/auth';

const getInitialState = (): IAuthState => {
    if (authService.isAuthenticated()) {
        const token = authService.getToken();
        const expiresAt = authService.getExpiresAtDate();

        if (token && expiresAt) {
            return {
                isAuthenticated: true,
                token,
                expiresAt,
                isFetching: false
            };
        }
    }

    return {
        isAuthenticated: false,
        token: null,
        expiresAt: null,
        isFetching: false
    };
};

export const authReducer: Reducer<IAuthState> = (state = getInitialState(), action) => {
    switch (action.type) {
        case AuthActionTypes.AUTH_AUTHENTICATED:
            return {
                ...state,
                ...{
                    isAuthenticated: true,
                    token: action.payload.token,
                    expiresAt: action.payload.expiresAt
                }
            };
        case AuthActionTypes.AUTH_TOKEN_RENEWED:
            return {
                ...state,
                ...{
                    token: action.payload.token,
                    expiresAt: action.payload.expiresAt
                }
            };
        case AuthActionTypes.AUTH_LOGOUT_SUCCESS:
            return {
                ...state,
                ...{
                    isAuthenticated: false,
                    token: null
                }
            };
        default:
            return state;
    }
};
