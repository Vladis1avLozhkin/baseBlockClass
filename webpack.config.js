const webpack = require('webpack');
module.exports = {
    devtool: '#inline-source-map',
    entry: "./src/main.js",
    output: {
        path: __dirname + '/dist',
        filename: "bundle.js"
    },
    module: {
        loaders: [
            {test: /\.json$/, loader: "json"},
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel', // 'babel-loader' is also a valid name to reference
                query: {
                    presets: ['es2015']
                }
            },
        ]
    },
    resolve: {
      extensions: ['', '.js', '.json'],
    },
    plugins: [
        new webpack.ProvidePlugin({
            // $: "jquery",
            // jQuery: "jquery",
            // "window.jQuery": "jquery",
        })
    ]
};
