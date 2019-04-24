import {takeEvery, put} from 'redux-saga/effects';
import {AuthActionTypes} from '../auth.types';
import {logout} from '../../../libs/auth';

export function* watchLogout() {
    yield takeEvery(AuthActionTypes.AUTH_LOGOUT, function*() {
        logout();

        yield put({
            type: AuthActionTypes.AUTH_LOGOUT_SUCCESS
        });
    });
}
