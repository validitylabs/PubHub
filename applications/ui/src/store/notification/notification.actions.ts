import {action} from 'typesafe-actions';
import {AuthActionTypes, NotificationType} from './notification.types';

export const setNotification = (message: string, notificationType: NotificationType) =>
    action(AuthActionTypes.SET_NOTIFICATION, {
        message,
        notificationType
    });

export const removeNotification = () => action(AuthActionTypes.REMOVE_NOTIFICATION);
