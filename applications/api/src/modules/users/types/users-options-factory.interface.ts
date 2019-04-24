import {IUsersModuleOptions} from './users-module-options.interface';

export interface IUsersOptionsFactory {
    createUsersOptions<P>(): Promise<IUsersModuleOptions<P>> | IUsersModuleOptions<P>;
}
