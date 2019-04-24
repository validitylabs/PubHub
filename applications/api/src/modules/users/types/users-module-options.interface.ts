export interface IUserRoles<P> {
    [key: string]: P[];
}

export interface IUsersModuleOptions<P = string[]> {
    roles: IUserRoles<P>;
}
