import * as cluster from 'cluster';
import * as fs from 'fs';
import {NestFactory} from '@nestjs/core';
import {NestApplicationOptions} from '@nestjs/common/interfaces/nest-application-options.interface';
import {AppModule} from './app.module';
import {ValidationPipe} from './validation.pipe';

process.env.APP_MODE = 'server';

async function bootstrap(): Promise<void> {
    const options: NestApplicationOptions = {
        cors: true
    };

    if (process.env.SSL_CERT && process.env.SSL_KEY) {
        const certFile = fs.readFileSync(process.env.SSL_CERT);
        const keyFile = fs.readFileSync(process.env.SSL_KEY);

        options.httpsOptions = {
            cert: certFile,
            key: keyFile
        };
    }

    const app = await NestFactory.create(AppModule, options);

    app.useGlobalPipes(new ValidationPipe());

    await app.listen(3000);

    // tslint:disable-next-line early-exit
    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(async () => {
            await app.close();
        });
    }
}

if (cluster.isMaster) {
    cluster.fork();

    // Replace the line above with the following part below to enable multi threading support
    // and add the import statement "import * as os from 'os';" to the top of the document.
    //
    // if (process.env.NODE_ENV === 'development') {
    //     cluster.fork();
    // } else {
    //     const cpuCount = os.cpus().length;

    //     for (let i = 0; i < cpuCount; i += 1) {
    //         cluster.fork();
    //     }
    // }

    cluster.on('exit', (worker) => {
        console.log('Worker %d died.', worker.id);
        cluster.fork();
    });
} else {
    bootstrap().catch((error) => {
        console.log('Error:', error);
        process.exit();
    });
}
