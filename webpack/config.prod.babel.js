const fs = require('fs');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const htmlFileNames = fs.readdirSync('./src/html/');
const htmlFileNamesComponents = fs.readdirSync('./src/components/');

const getEntries = () => {
    const entries = [
        './src/js/app.js',
        './src/scss/app.scss'
    ];

    // htmlFileNames.forEach(filename => {
    //     entries.push(`./src/html/${filename}`);
    // });

    return entries;
};

const getPlugins = () => {
    const plugins = [
        new CleanWebpackPlugin('page', {
            root: __dirname + '/../'
        }),
        new CopyWebpackPlugin([
            {
                from: __dirname + '/../src/assets/',
                to: __dirname + '/../page/'
            }
        ]),
        new ExtractTextPlugin({
            filename: `./css/styles.css?v=${(new Date()).getTime()}`,
            allChunks: true
        })
    ];
    htmlFileNames.forEach(filename => {
        // Clear index.html file after build
        if (filename.substr(0, 1) !== '_' && filename.indexOf("index.html") === -1) {
            const splitted = filename.split('.');
            if (splitted[1] === 'html' ) {
                plugins.push(
                    new HtmlWebpackPlugin({
                        template: `./src/html/${filename}`,
                        filename: `./${filename}`
                    }),
                );
            }
        }
    });

    return plugins;
};

module.exports = {
    entry: getEntries(),
    output: {
        filename: `./js/bundle.js?v=${(new Date()).getTime()}`,
        path: path.resolve(__dirname, '../page/')
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
