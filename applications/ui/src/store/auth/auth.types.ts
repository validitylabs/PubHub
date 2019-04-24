export enum AuthActionTypes {
    AUTH_AUTHENTICATED = '@@auth/AUTHENTICATED',
    AUTH_SESSION_EXPIRED = '@@auth/SESSION_EXPIRED',
    AUTH_LOGOUT = '@@auth/LOGOUT',
    AUTH_LOGOUT_SUCCESS = '@@auth/LOGOUT_SUCCESS',
    AUTH_TOKEN_RENEWED = '@@auth/TOKEN_RENEWED',
    AUTH_SCHEDULE_RENEWAL = '@@auth/SCHEDULE_RENEWAL'
}

export interface IAuthState {
    isAuthenticated: boolean;
    token: string | null;
    expiresAt: number | null;
    isFetching: boolean;
}
