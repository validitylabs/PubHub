import * as webpack from 'webpack';
import * as webpackMerge from 'webpack-merge';
import * as nodeExternals from 'webpack-node-externals';
import {config} from './webpack.common';

// tslint:disable:no-var-requires no-var-requires no-require-imports variable-name
const WebpackShellPlugin = require('webpack-shell-plugin');

export default webpackMerge(config, {
    mode: 'development',
    entry: {server: ['webpack/hot/poll?100', './server.ts']},
    externals: [
        nodeExternals({
            whitelist: ['webpack/hot/poll?100']
        })
    ],
    watch: true,
    watchOptions: {
        ignored: /node_modules/,
        aggregateTimeout: 300,
        poll: 500
    },
    plugins: [new webpack.HotModuleReplacementPlugin(), new WebpackShellPlugin({onBuildEnd: ['node dist/server.js']})],
    output: {
        devtoolModuleFilenameTemplate: '[absolute-resource-path]'
    }
});
