import {CustomValue} from '@nestjs/core/injector/module';
import {DynamicModule, Module, Global, Provider} from '@nestjs/common';
import {IMailModuleOptions, IMailModuleAsyncOptions, IMailOptionsFactory} from './interfaces';
import {MailProvider} from './mail.provider';

@Global()
@Module({})
export class MailCoreModule {
    static forRoot(options: IMailModuleOptions): DynamicModule {
        // tslint:disable-next-line variable-name
        const MailOptions: CustomValue = {
            name: 'MAIL_MODULE_OPTIONS',
            provide: 'MAIL_MODULE_OPTIONS',
            useValue: {
                region: options.region,
                credentials: options.credentials
            } as IMailModuleOptions
        };

        return {
            module: MailCoreModule,
            components: [MailProvider, MailOptions],
            exports: [MailProvider]
        };
    }

    static forRootAsync(options: IMailModuleAsyncOptions): DynamicModule {
        const asyncProviders = MailCoreModule.createAsyncProviders(options);

        return {
            module: MailCoreModule,
            imports: options.imports,
            providers: [...asyncProviders, MailProvider],
            exports: [MailProvider]
        };
    }

    private static createAsyncProviders(options: IMailModuleAsyncOptions): Provider[] {
        if (options.useExisting || options.useFactory) {
            return [MailCoreModule.createAsyncOptionsProvider(options)];
        }
        return [
            MailCoreModule.createAsyncOptionsProvider(options),
            {
                provide: options.useClass,
                useClass: options.useClass
            }
        ];
    }

    private static createAsyncOptionsProvider(options: IMailModuleAsyncOptions): Provider {
        if (options.useFactory) {
            return {
                provide: 'MAIL_MODULE_OPTIONS',
                useFactory: options.useFactory,
                inject: options.inject || []
            };
        }
        return {
            provide: 'MAIL_MODULE_OPTIONS',
            useFactory: async (optionsFactory: IMailOptionsFactory) => optionsFactory.createMailOptions(),
            inject: [options.useExisting || options.useClass]
        };
    }
}
