import {Injectable, Inject} from '@nestjs/common';
import * as AWS from 'aws-sdk';
import {IMailModuleOptions} from './interfaces';

const API_VERSION = '2010-12-01';

@Injectable()
export class MailProvider {
    private readonly sesInstance: AWS.SES;

    constructor(
        @Inject('MAIL_MODULE_OPTIONS')
        private readonly options: IMailModuleOptions
    ) {
        if (!options.region || !options.credentials || !options.credentials.accessKeyId || !options.credentials.secretAccessKey) {
            throw new Error('Make sure to set all required options.');
        }
        this.sesInstance = new AWS.SES({
            region: options.region,
            apiVersion: API_VERSION,
            credentials: {
                accessKeyId: options.credentials.accessKeyId,
                secretAccessKey: options.credentials.secretAccessKey
            }
        });
    }

    public async sendMail(params: AWS.SES.Types.SendEmailRequest): Promise<AWS.SES.Types.SendEmailResponse> {
        return new Promise((resolve, reject) => {
            this.sesInstance.sendEmail(params, (error, data) => {
                if (error) {
                    return reject(error);
                }
                return resolve(data);
            });
        });
    }
}
