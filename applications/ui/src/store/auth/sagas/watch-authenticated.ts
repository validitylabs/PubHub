import {takeEvery} from 'redux-saga/effects';
import {authenticated} from '../auth.actions';
import {AuthActionTypes} from '../auth.types';
import {setSession} from '../../../libs/auth';

export function* watchAuthenticated() {
    yield takeEvery(AuthActionTypes.AUTH_AUTHENTICATED, (action: ReturnType<typeof authenticated>) => {
        const {token, expiresAt} = action.payload;

        setSession(token, expiresAt);
    });
}
