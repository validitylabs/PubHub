import {IMailModuleOptions} from './mail-module-options.interface';

export interface IMailOptionsFactory {
    createMailOptions(): Promise<IMailModuleOptions> | IMailModuleOptions;
}
