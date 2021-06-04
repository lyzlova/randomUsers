const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// let mode = "development";
// let target = "web";

// if(process.env.NODE_ENV === "production") {
//     mode = "production";
//     target = "browserslist";
// }

module.exports = {
    // mode: this.mode,
    // target: this.target,
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js'
    },
    plugins: [
        new HtmlWebpackPlugin({template: "src/index.html"}),
        new MiniCssExtractPlugin({filename: "styles.css"}),
        new CleanWebpackPlugin()
    ],
    module: {
        rules: [
             {
                test: /\.(s[ac]|c)ss$/i,
                use: [
                MiniCssExtractPlugin.loader,
                  "css-loader",
                  "postcss-loader",
                  "sass-loader",
                ],
              },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: ["babel-loader"],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
            },
        ],
    },
    devtool: 'source-map',
    devServer: {
        contentBase: "./build",
        compress: true,
        port: 8000, 
        stats: "errors-only",
        hot: true,
    },
}
