export enum AuthActionTypes {
    SET_NOTIFICATION = 'SET_NOTIFICATION',
    REMOVE_NOTIFICATION = 'REMOVE_NOTIFICATION'
}

export enum NotificationType {
    SUCCESS = 'SUCCESS',
    INFO = 'INFO',
    WARNING = 'WARNING',
    ERROR = 'ERROR'
}

export interface INotification {
    message: string;
    type: NotificationType;
}

export type NotificationState = INotification | null;
