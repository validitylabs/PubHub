import {DynamicModule, Module} from '@nestjs/common';
import {MailCoreModule} from './mail-core.module';
import {IMailModuleOptions, IMailModuleAsyncOptions} from './interfaces';

@Module({})
export class MailModule {
    static forRoot(options?: IMailModuleOptions): DynamicModule {
        return {
            module: MailModule,
            modules: [MailCoreModule.forRoot(options)]
        };
    }

    static forRootAsync(options: IMailModuleAsyncOptions): DynamicModule {
        return {
            module: MailModule,
            imports: [MailCoreModule.forRootAsync(options)]
        };
    }
}
