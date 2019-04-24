import * as path from 'path';
import * as webpack from 'webpack';
import * as ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

const rootPath = __dirname;
const srcPath = path.join(__dirname, 'src/');
const distPath = path.join(__dirname, 'dist/');

export const getTSConfigFilePath = () => {
    if (process.env.NODE_ENV === 'production') {
        return path.resolve(rootPath, './tsconfig.build.json');
    }
    return path.resolve(rootPath, './tsconfig.json');
};

export const config: webpack.Configuration = {
    target: 'node',
    context: path.resolve(srcPath),
    entry: {
        server: './server.ts',
        cli: './cli.ts'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            configFile: getTSConfigFilePath(),
                            reportFiles: ['src/**/*.{ts,tsx}'],
                            transpileOnly: true,
                            onlyCompileBundledFiles: true
                        }
                    }
                ],
                exclude: /node_modules/
            },
            {
                test: /\.node$/,
                use: 'node-loader'
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({'global.GENTLY': false}),
        new webpack.IgnorePlugin(/vertx/),
        new ForkTsCheckerWebpackPlugin({
            tsconfig: getTSConfigFilePath(),
            tslint: path.resolve(rootPath, './tslint.json')
        })
    ],
    resolve: {
        extensions: ['.ts', '.js', '.json', '.wasm', '.mjs', '.node'],
        modules: ['node_modules', path.resolve(rootPath, './node_modules'), path.resolve(rootPath, '../../node_modules')]
    },
    resolveLoader: {
        modules: ['node_modules', path.resolve(rootPath, './node_modules')],
        moduleExtensions: ['-loader']
    },
    output: {
        filename: '[name].js',
        sourceMapFilename: '[name].map',
        publicPath: '/',
        path: path.resolve(distPath)
    }
};
