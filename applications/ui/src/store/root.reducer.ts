import {combineReducers} from 'redux';
import {connectRouter} from 'connected-react-router';
import {getHistory} from '../history';

import {authReducer} from './auth/auth.reducer';
import {notificationReducer} from './notification/notification.reducer';

export const rootReducer = combineReducers({
    router: connectRouter(getHistory()),
    auth: authReducer,
    notification: notificationReducer
});
