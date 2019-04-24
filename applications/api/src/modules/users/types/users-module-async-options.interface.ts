import {ModuleMetadata, Type} from '@nestjs/common/interfaces';
import {IUsersOptionsFactory} from './users-options-factory.interface';
import {IUsersModuleOptions} from './users-module-options.interface';

export interface IUsersModuleAsyncOptions<P> extends Pick<ModuleMetadata, 'imports'> {
    useExisting?: Type<IUsersOptionsFactory>;
    useClass?: Type<IUsersOptionsFactory>;
    inject?: any[];
    useFactory?(...args: any[]): Promise<IUsersModuleOptions<P>> | IUsersModuleOptions<P>;
}
