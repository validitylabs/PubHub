import * as fs from 'fs';
import * as https from 'https';
import axiosLib from 'axios';

const agentOptions: https.AgentOptions = {};

if (process.env.APP_SSL_CERT && process.env.APP_SSL_KEY) {
    agentOptions.cert = fs.readFileSync(process.env.APP_SSL_CERT);
    agentOptions.key = fs.readFileSync(process.env.APP_SSL_KEY);
}
agentOptions.rejectUnauthorized = false;

const httpsAgent = new https.Agent(agentOptions);

export const axios = axiosLib.create({httpsAgent});
