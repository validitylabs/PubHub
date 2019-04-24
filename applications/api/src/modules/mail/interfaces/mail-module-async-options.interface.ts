import {ModuleMetadata, Type} from '@nestjs/common/interfaces';
import {IMailOptionsFactory} from './mail-options-factory.interface';
import {IMailModuleOptions} from './mail-module-options.interface';

export interface IMailModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    useExisting?: Type<IMailOptionsFactory>;
    useClass?: Type<IMailOptionsFactory>;
    inject?: any[];
    useFactory?(...args: any[]): Promise<IMailModuleOptions> | IMailModuleOptions;
}
