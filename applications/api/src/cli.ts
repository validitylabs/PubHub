import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {CommandModule} from './modules/command/command.module';
import {CommandService} from './modules/command/command.service';

process.env.DB_SYNCHRONIZE = 'false';
process.env.DB_LOGGING = 'false';

async function bootstrap(): Promise<void> {
    const app = await NestFactory.createApplicationContext(AppModule, {
        logger: false
    });

    app.select(CommandModule)
        .get(CommandService)
        .exec();
}

bootstrap().catch((error) => console.log('Error:', error));
