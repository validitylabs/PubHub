import * as webpackMerge from 'webpack-merge';
import * as nodeExternals from 'webpack-node-externals';
import {config} from './webpack.common';

export default webpackMerge(config, {
    mode: 'production',
    externals: [nodeExternals({whitelist: [/^@vl\//]})],
    optimization: {
        minimize: false,
        occurrenceOrder: false,
        usedExports: false,
        concatenateModules: false
    }
});
