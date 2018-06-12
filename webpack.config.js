const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

const frontend = {
    mode: isProduction ? 'production' : 'development',
    entry: {
        client: './src/client/index.tsx'
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].js'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.css']
    },
    plugins: [new ForkTsCheckerWebpackPlugin()],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            minimize: true
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        ident: 'postcss',
                        options: {
                            plugins: loader => [
                                require('precss'),
                                require('postcss-hexrgba')
                            ],
                            sourceMap: true
                        }
                    }
                ]
            }
        ]
    }
};

const backend = {
    mode: isProduction ? 'production' : 'development',
    entry: {
        server: './src/server/index.ts'
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].js'
    },
    devtool: false,
    target: 'node',
    node: {
        __dirname: false
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.css']
    },
    plugins: [new ForkTsCheckerWebpackPlugin()],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true
                        }
                    }
                ]
            },
            {
                test: /\.node$/,
                use: [{ loader: 'node-loader' }]
            }
        ]
    }
};

module.exports = [frontend, backend];
