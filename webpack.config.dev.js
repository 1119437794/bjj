var path = require('path');
var webpack = require('webpack');
var HtmlwebpackPlugin = require('html-webpack-plugin');

module.exports = {

    //页面入口文件配置
    entry: [
        'webpack-dev-server/client?http://127.0.0.1:80',
        'webpack/hot/only-dev-server',
        './src/index.jsx'
    ],

    //入口文件输出配置
    output: {
        'path': path.join(__dirname, 'dest'),
        'filename': 'index.js',
        'publicPath': './' // 网站运行时的访问路径
    },

    resolve: {
        extensions: ['', '.js', '.jsx','.css','.less','.scss'] //require 的时候，可以不用写文件类型
    },

    module: {
        //加载器配置
        //凡是.js结尾的文件都是用babel-loader做处理，而.jsx结尾的文件会先经过jsx-loader处理，然后经过babel-loader处理
        // 在这里添加 react-hot，注意这里使用的是loaders，所以不能用 query，应该把presets参数写在 babel 的后面
        loaders: [

            {test:/\.css$/, loader: "style!css"},

            //{test: /\.less$/, loader: "style!css!less"},

            {test: /\.scss$/, loader: "style!css!sass"},

            {test: /\.(png|jpe?g|gif)$/, loader: "url-loader?limit=8192&name=/imgs/[hash].[ext]"},

            {test: /\.(woff|eot|ttf)$/i, loader: 'url?limit=10000&name=fonts/[hash:8].[name].[ext]'},

            {test: /\.jsx?$/, include: path.join(__dirname, 'src'), loaders:
                [
                    'react-hot',
                    'babel?' +
                    'presets[]=react,' +
                    'presets[]=es2015,' +
                    // 针对 ES6类语法以及ES7装饰器语法
                    'plugins[]=transform-decorators-legacy,' +
                    'plugins[]=transform-class-properties'
                ]
            },
        ]
    },

    //插件项
    plugins: [

        //添加我们的插件 会自动生成一个html文件
        new HtmlwebpackPlugin({
            title: 'BBD-REACT',
            template:'./src/index.html', //html模板路径
            filename: 'index.html',
            inject:true,  //允许插件修改哪些内容，包括head与body
            hash:false //为静态资源生成hash值
        }),

        //开发模式
        new webpack.DefinePlugin({
          "process.env": {
            NODE_ENV: JSON.stringify("development") //development,production
          }
        }),

        //启用报错不打断模式
        new webpack.NoErrorsPlugin(),

        //热替换插件
        new webpack.HotModuleReplacementPlugin()
    ]
};
