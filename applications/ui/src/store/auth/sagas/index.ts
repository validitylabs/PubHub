import {all, fork} from 'redux-saga/effects';
import {watchAuthenticated} from './watch-authenticated';
import {watchInitializeApplication} from './watch-initialize-application';
import {watchLogout} from './watch-logout';

export function* authSaga() {
    yield all([fork(watchAuthenticated), fork(watchInitializeApplication), fork(watchLogout)]);
}
