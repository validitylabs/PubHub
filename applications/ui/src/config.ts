// tslint:disable

import * as yup from 'yup';
import {IConfigurations} from '../typings/configurations';

interface IWindow {
    ENV: IConfigurations;
}

const configSchema = yup.object().shape({
    APP_API_ENDPOINT: yup
        .string()
        // eslint-disable-next-line
        .matches(/^https:\/\/.*[^/]$/, '${path} must be a valid endpoint of the following schema without a trailing slash (https://www.company.com)')
        .required(),
    APP_WEB3_PROVIDER_ENDPOINT: yup
        .string()
        // eslint-disable-next-line
        .matches(/^ws:\/\/.*[^/]$/, '${path} must be a valid endpoint of the following schema without a trailing slash (wss://www.company.com)')
        .required(),
    APP_IPFS_SWARM_ADDR: yup
        .string()
        // eslint-disable-next-line
        .matches(/^\/\w*\/[a-z0-9.-]*\/\w*\/\w*[^/]$/, '${path} must be a valid multiaddr (https://github.com/multiformats/js-multiaddr)')
        .required(),
    APP_IPFS_API_ADDR: yup
        .string()
        // eslint-disable-next-line
        .matches(/^\/\w*\/[a-z0-9.-]*\/\w*\/\w*[^/]$/, '${path} must be a valid multiaddr (https://github.com/multiformats/js-multiaddr)')
        .required(),
    APP_IPFS_GATEWAY_ADDR: yup
        .string()
        // eslint-disable-next-line
        .matches(/^\/\w*\/[a-z0-9.-]*\/\w*\/\w*[^/]$/, '${path} must be a valid multiaddr (https://github.com/multiformats/js-multiaddr)')
        .required()
});

const getConfig = (): IConfigurations => {
    try {
        if (!window.config) {
            window.config = configSchema.validateSync(((window as any) as IWindow).ENV, {stripUnknown: true, abortEarly: false}) as IConfigurations;
        }
        return window.config;
    } catch (error) {
        throw new Error(`Config Validation\n${error.errors.join('\n')}`);
    }
};

export default getConfig();
