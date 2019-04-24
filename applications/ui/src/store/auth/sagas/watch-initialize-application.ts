import {takeEvery, call, put, fork, select, take, cancelled} from 'redux-saga/effects';
import {eventChannel} from 'redux-saga';
import {scheduleRenewal} from './schedule-renewal';
import {logout, sessionExpired} from '../auth.actions';
import {ApplicationActionTypes} from '../../application/application.types';
import {RootState} from '../../';

const getIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
const getExpiresAt = (state: RootState) => state.auth.expiresAt;

const windowFocusChangeEvent = () => {
    return eventChannel((emitter) => {
        const callback = (evt: WindowEventMap['focus']) => {
            emitter(evt);
        };
        window.addEventListener('focus', callback);
        return () => {
            window.removeEventListener('focus', callback);
        };
    });
};

function* bindSessionExpirationObserver() {
    const channel = yield call(windowFocusChangeEvent);

    try {
        // tslint:disable-next-line:no-constant-condition
        while (true) {
            yield take(channel);
            const isAuthenticated = yield select(getIsAuthenticated);
            const expiresAt = yield select(getExpiresAt);

            if (isAuthenticated && expiresAt < Date.now()) {
                yield put(sessionExpired());
                yield put(logout());
            }
        }
    } finally {
        if (yield cancelled()) {
            channel.close();
        }
    }
}

export function* watchInitializeApplication() {
    yield takeEvery(ApplicationActionTypes.INITIALIZE, function*() {
        const isAuthenticated = yield select(getIsAuthenticated);

        if (isAuthenticated) {
            yield fork(scheduleRenewal);
        }

        yield fork(bindSessionExpirationObserver);
    });
}
