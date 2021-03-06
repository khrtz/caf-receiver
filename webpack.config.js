const webpack = require("webpack")
const path = require("path")
const CopyPlugin = require("copy-webpack-plugin")

const MODE = process.env.NODE_ENV || "development"
const DEV = MODE == "development"

module.exports = {
  mode: MODE,
  devtool: DEV ? "inline-source-map" : "source-map",
  entry: {
    main: [__dirname + "/src/receiver/index.mjs"]
  },
  output: {
    path: __dirname + "/static",
    filename: "player.js"
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  devServer: {
    contentBase: 'static/',
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true
            }
          }
        ]
      },
    ]
  },
  plugins: [
    new CopyPlugin([
      {
        from: __dirname + "/src/player.html",
        to: __dirname + "/static/player.html"
      },
      {
        from: __dirname + "/assets/**",
        to: __dirname + "/static"
      }
    ]),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(MODE),
      "process.env.DEBUG": JSON.stringify(process.env.DEBUG || DEV)
    }),
  ]
}