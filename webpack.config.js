const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: './main.css',
  devtool: "source-map",
  mode: "production",
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              esModule: true,
            },
          },
          {
            loader: require.resolve("css-loader"),
            options: {
              sourceMap: true,
            }
          },
          {
            loader: require.resolve("postcss-loader"),
            options: {
              sourceMap: true,
              ident: "postcss",
              plugins: () => [
                require("postcss-preset-env")({}),
                require("cssnano")({preset: ["default"]}),
              ],
            }
          },
        ]
      }
    ]
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/output-wp.css"
    })
  ],
}
