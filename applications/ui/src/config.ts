import * as yup from 'yup';
import {IConfigurations} from '../typings/configurations';

interface IWindow {
    ENV: IConfigurations;
}

const configSchema = yup.object().shape({
    APP_API_ENDPOINT: yup
        .string()
        // eslint-disable-next-line
        .matches(/^https:\/\/.*[^\/]$/, 'Must be a valid endpoint of the following schema without a trailing slash (https://www.company.com)')
        .required()
});

const getConfig = (): IConfigurations => {
    if (!window.config) {
        window.config = configSchema.validateSync(((window as any) as IWindow).ENV, {stripUnknown: true}) as IConfigurations;
    }
    return window.config;
};

export default getConfig();
