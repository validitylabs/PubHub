import {axios} from '../axios';
import config from '../config';

export interface IUserProfile {
    givenName: string;
    familyName: string;
    email: string;
}

export const calculateExpiresAtDate = (expiresIn: number) => {
    return expiresIn * 1000 + new Date().getTime();
};

export const saveProfile = (profile: IUserProfile) => {
    localStorage.setItem('user_profile', JSON.stringify(profile));
};

export const getProfileFromLocalStorage = (): any | null => {
    const profile = localStorage.getItem('user_profile');
    if (!profile) {
        return null;
    }
    return JSON.parse(profile);
};

export const getToken = (): string | null => {
    return localStorage.getItem('token');
};

export const getExpiresAtDate = (): number | null => {
    const expiresAt = localStorage.getItem('expires_at');
    if (expiresAt) {
        return parseInt(expiresAt, 10);
    }
    return null;
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('user_profile');
};

export const isAuthenticated = () => {
    const expiresAt = getExpiresAtDate();

    if (expiresAt) {
        return new Date().getTime() < expiresAt;
    }

    return false;
};

export const setSession = (token: string, expiresAt: number) => {
    localStorage.setItem('token', token);
    localStorage.setItem('expires_at', expiresAt.toString());
};

export interface ILoginResponse {
    expiresIn: number;
    token: string;
    profile: IUserProfile;
}

export const login = async (username: string, password: string) => {
    const response = await axios.post<ILoginResponse>(`${config.APP_API_ENDPOINT}/auth/login`, {
        username,
        password
    });
    const expiresAt = calculateExpiresAtDate(response.data.expiresIn);

    return {
        token: response.data.token,
        expiresAt
    };
};

// @TODO: Needs to be implemented
export const changePassword = async (email: string, password: string | undefined = undefined): Promise<any> => {
    return new Promise(() => null);
};

// @TODO: Needs to be implemented
export const getProfile = async (accessToken: string): Promise<any> => {
    return new Promise(() => null);
};

// @TODO: Needs to be implemented
export const renewToken = async (): Promise<any> => {
    return new Promise(() => null);
};
