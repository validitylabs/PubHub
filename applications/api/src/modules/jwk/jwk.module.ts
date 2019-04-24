import {Module} from '@nestjs/common';
import {JwkCommand} from './jwk.command';
import {JwkService} from './jwk.service';
import {ConfigurationModule} from '../configuration/configuration.module';

@Module({
    imports: [ConfigurationModule],
    providers: [JwkService, JwkCommand],
    exports: [JwkService]
})
export class JwkModule {}
