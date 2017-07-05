var path = require('path');
var webpack = require('webpack');
var HtmlwebpackPlugin = require('html-webpack-plugin');
var cleanWebpackPlugin = require("clean-webpack-plugin");// 清除文件
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {

    entry: {
        index: path.join(__dirname, '/src/index.jsx'),
        vendor: ['react', 'react-dom']
    },

    output: {
        'path': path.join(__dirname, 'dest'),
        'filename': '[name].[hash].js',
        'publicPath': './'
    },

    resolve: {
        extensions: ['', '.js', '.jsx','.css','.less','.scss']
    },

    module: {

        loaders: [

            {test:/\.css$/, loader: "style!css"},

            {test: /\.scss$/, loader: ExtractTextPlugin.extract("style","css!sass")},

            {test: /\.(png|gif|jpe?g)$/, loader: "url-loader?limit=8192&name=/imgs/[hash].[ext]"},

            {test: /\.(woff|eot|ttf)$/i, loader: 'url?limit=10000&name=fonts/[hash:8].[name].[ext]'},

            {
                test: /\.jsx?$/,
                loader: 'babel',
                include: path.join(__dirname, 'src'),
                query: {
                    presets: ['react', 'es2015'],

                    plugins: [
                        'transform-decorators-legacy',
                        'transform-class-properties'
                    ],
                },
            }
        ]
    },

    plugins: [

        //清除热更新产生的垃圾文件 .js .json 以及过期的.css
        new cleanWebpackPlugin("./dest/*.js"),
        new cleanWebpackPlugin("./dest/*.css"),
        new cleanWebpackPlugin("./dest/*.json"),

        //html编译处理
        new HtmlwebpackPlugin({
            title: 'BBD',
            template: path.join(__dirname, 'src/index.html'),
            filename: 'index.html',
            inject: true,
            hash: false,
            //删除注释 压缩html
            minify: {
                removeComments: true,
                collapseWhitespace: true
            }
        }),

        // 提取css
        new ExtractTextPlugin("style.[hash].css"),

        //生产环境
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("production")
            }
        })
    ]
};
