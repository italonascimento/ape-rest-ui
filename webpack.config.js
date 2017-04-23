const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: "./src/index.ts",

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        include: [
          path.resolve(__dirname, "src")
        ],
        loader: "awesome-typescript-loader",
      }
    ]
  },

  resolve: {
    modules: [
      "node_modules",
      path.resolve(__dirname, "src")
    ],

    extensions: [".js", ".json", ".ts"],
  },

  devtool: "source-map",

  context: __dirname,

  target: "web",

  devServer: {
    proxy: { // proxy URLs to backend development server
      '/api': 'http://localhost:3000'
    },
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    historyApiFallback: true,
    port: 3000
  },

  plugins: [new HtmlWebpackPlugin({
    title: 'Ape REST',
    hash: true,
    template: './src/index.ejs'
  })]
}
