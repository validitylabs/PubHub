import {action} from 'typesafe-actions';
import {AuthActionTypes} from './auth.types';

export const authenticated = (token: string, expiresAt: number, loadUserProperties = false) =>
    action(AuthActionTypes.AUTH_AUTHENTICATED, {token, expiresAt, loadUserProperties});

export const sessionExpired = () => action(AuthActionTypes.AUTH_SESSION_EXPIRED);

export const logout = () => action(AuthActionTypes.AUTH_LOGOUT);
