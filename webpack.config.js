const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: "./src/index.js",
    output: {
        path: path.join(__dirname, "/dist"),
        filename: "index-bundle.js"
    },
    module: {
        rules: [
            {test: /\.js$/, exclude: /node_modules/, use: ["babel-loader"]},
            {test: /\.ico$/, loaders: 'file-loader?name=[name].[ext]'},
            {test: /\.ttf$/, loaders: 'ttf-loader'},
            {test: /\.(jpe?g|png|gif|svg)$/i, loaders: ['file-loader']},
            {test: /(\.css|\.scss)$/, loaders: ["style-loader", "css-loader", "sass-loader", 'resolve-url-loader']}
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        })
    ]
};