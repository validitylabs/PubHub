export interface IUserResponse {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    username: string;
    passwordUpdatedAt: Date;
    active: boolean;
    email: string;
    emailVerified: boolean;
    verifyEmail: boolean;
    givenName: string;
    familyName: string;
}
