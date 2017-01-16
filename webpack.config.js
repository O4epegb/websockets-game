var path = require("path");
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var precss = require('precss');
var autoprefixer = require('autoprefixer');
const nodeExternals = require('webpack-node-externals');

var plugins = [];

if (process.env.NODE_ENV === 'production') {
    plugins = [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                warnings: false
            }
        })
    ]
}

var configs = [
    {
        entry: {
            "client": "./src/client/index.tsx"
        },
        output: {
            path: path.resolve(__dirname, "build"),
            filename: "[name].js"
        },
        resolve: {
            extensions: [
                "",
                ".ts",
                ".tsx",
                ".js",
                ".jsx",
                ".css",
                ".styl"
            ]
        },
        plugins: plugins.concat([/*new HtmlWebpackPlugin({title: 'Design By Numbers language compiler'})*/]),
        module: {
            loaders: [
                {
                    test: /\.tsx?$/,
                    loader: "ts-loader",
                    exclude: /node_modules/
                }, {
                    test: /\.css$/,
                    loader: 'style-loader!css-loader?minimize!postcss-loader'
                }, {
                    test: /\.styl$/,
                    loader: 'style-loader!css-loader?minimize!postcss-loader!stylus-loader'
                }
            ]
        },
        ts: {
            compilerOptions: {
                noEmit: false
            }
        },
        postcss: function() {
            return [precss, autoprefixer];
        }
    }, {
        entry: {
            "server": "./src/server/index.tsx"
        },
        output: {
            path: path.resolve(__dirname, "build"),
            filename: "[name].js",
            libraryTarget: 'commonjs2'
        },
        target: 'node',
        node: {
            __dirname: false
        },
        resolve: {
            extensions: [
                "",
                ".ts",
                ".tsx",
                ".js",
                ".jsx",
                ".css",
                ".styl"
            ]
        },
        plugins: plugins,
        externals: [nodeExternals()],
        module: {
            loaders: [
                {
                    test: /\.tsx?$/,
                    loader: "ts-loader",
                    exclude: /node_modules/
                },
                {
                    test: /\.css$/,
                    loader: 'isomorphic-style-loader!css-loader?minimize!postcss-loader'
                }, {
                    test: /\.styl$/,
                    loader: 'isomorphic-style-loader!css-loader?minimize!postcss-loader!stylus-loader'
                }
            ]
        },
        ts: {
            compilerOptions: {
                noEmit: false
            }
        },
        postcss: function() {
            return [precss, autoprefixer];
        }
    }
];

module.exports = configs;
