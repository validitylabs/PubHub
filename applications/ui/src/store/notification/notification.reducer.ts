import {Reducer} from 'redux';
import {AuthActionTypes, NotificationState} from './notification.types';

export const notificationReducer: Reducer<NotificationState> = (state = null, action) => {
    switch (action.type) {
        case AuthActionTypes.SET_NOTIFICATION:
            return {
                message: action.message,
                type: action.notificationType
            };
        case AuthActionTypes.REMOVE_NOTIFICATION:
            return null;
        default:
            return state;
    }
};
