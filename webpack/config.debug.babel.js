const fs = require('fs');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// const CleanWebpackPlugin = require('clean-webpack-plugin');
const htmlFileNamesComponents = fs.readdirSync('./src/components/');

const getEntries = () => {
    const entries = [
        './src/js/app.js',
        './src/scss/app.scss'
    ];

    return entries;
};

const getPlugins = () => {
    const plugins = [
        // new CleanWebpackPlugin('public/frontend', {
        //     root: __dirname + '/../'
        // }),
        new CopyWebpackPlugin([
            {
                from: __dirname + '/../src/assets/',
                to: __dirname + '/../public/frontend/'
            }
        ]),
        new ExtractTextPlugin({
            filename: `./css/styles.css?v=${(new Date()).getTime()}`,
            allChunks: true
        })
    ];

    return plugins;
};

module.exports = {
    entry: getEntries(),
    output: {
        filename: './js/bundle.js',
        path: path.resolve(__dirname, '../public/frontend/')
    },

    plugins: getPlugins(),
    module: {
        rules: [
            {
                test: /\.(html)$/,
                loader: path.resolve(__dirname, 'loader/html-loader.js'),
                options: {
                    html: htmlFileNamesComponents
                }
            },
            {
                test: /\.(js)$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
            {
                test: /\.(css|scss)$/,
                exclude: /node_modules/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: "css-loader",
                            options: {

                                url: false
                            }
                        }, {
                            loader: "postcss-loader",
                            options: {
                                ident: 'postcss',
                                plugins: () => [
                                    require('autoprefixer')({
                                        browsers: ['ie >= 8', 'last 4 version']
                                    }),
                                    require('cssnano')()
                                ]
                            }
                        },
                        'sass-loader'
                    ]
                })
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.jpg', '.html', '.scss'],
    }
};
