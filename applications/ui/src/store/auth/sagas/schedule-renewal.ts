import Raven from 'raven-js';
import {call, select, race, take, put} from 'redux-saga/effects';
import {delay} from 'redux-saga';
import {logout} from '../auth.actions';
import {AuthActionTypes} from '../auth.types';
import * as authService from '../../../libs/auth';
import {RootState} from '../../';

const getIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
const getExpiresAt = (state: RootState) => state.auth.expiresAt;

function* renewalBackgroundTask() {
    const isAuthenticated = yield select(getIsAuthenticated);

    if (!isAuthenticated) {
        throw new Error('Not authenticated.');
    }

    // tslint:disable-next-line:no-constant-condition
    while (true) {
        const expiresAt = yield select(getExpiresAt);
        const expiresIn = expiresAt - Date.now();

        if (expiresIn < 0) {
            return yield put(logout());
        }

        yield call(delay, expiresIn);

        try {
            const renewedTokenResult = yield authService.renewToken();

            if (!renewedTokenResult) {
                return yield put(logout());
            }

            const renewedTokenExpiresAt = authService.calculateExpiresAtDate(renewedTokenResult.expiresIn);

            authService.setSession(renewedTokenResult.token, renewedTokenExpiresAt);

            yield put({
                type: AuthActionTypes.AUTH_TOKEN_RENEWED,
                payload: {
                    token: renewedTokenResult.token,
                    expiresAt: renewedTokenExpiresAt
                }
            });
        } catch (error) {
            Raven.captureException(error);
            return yield put(logout());
        }
    }
}

export function* scheduleRenewal() {
    yield put({type: AuthActionTypes.AUTH_SCHEDULE_RENEWAL});
    yield race({
        logoutAction: take(AuthActionTypes.AUTH_LOGOUT_SUCCESS),
        renewalLoop: call(renewalBackgroundTask)
    });
}
