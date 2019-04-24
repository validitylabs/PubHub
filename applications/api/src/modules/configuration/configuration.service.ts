import {Logger} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import {validateSync, ValidationError} from 'class-validator';
import {ConfigurationDto} from './configuration.dto';

const LOCAL_ENV_FILE = path.resolve(process.cwd(), 'local.env');

export class ConfigurationService {
    private readonly logger = new Logger('CONFIGURATION');
    private readonly configuration: ConfigurationDto;

    constructor() {
        const configuration = new ConfigurationDto();

        Object.assign(configuration, {...this.getDotenvConfiguration(LOCAL_ENV_FILE), ...process.env});

        const validationResult = validateSync(configuration, {whitelist: true});

        if (validationResult && validationResult.length > 0) {
            this.logger.error('Configuration invalid', `Validation errors:\n${this.extractValidationErrorMessages(validationResult)}`);
            throw new Error('Configuration invalid');
        }

        this.configuration = configuration;
    }

    extractValidationErrorMessages(validationErrors: ValidationError[]) {
        return validationErrors
            .map(
                (validationError) =>
                    `${Object.values(validationError.constraints)
                        .map((constraint) => `  * ${constraint}.`)
                        .join('\n')}`
            )
            .join('.\n');
    }

    getDotenvConfiguration(filePath: string) {
        if (fs.existsSync(filePath)) {
            return dotenv.parse(fs.readFileSync(filePath));
        }
        return {};
    }

    get<K extends keyof ConfigurationDto>(key: K): ConfigurationDto[K] {
        return this.configuration[key];
    }
}
