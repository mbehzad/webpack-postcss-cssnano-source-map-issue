# source-map with non existing column number

When using cssnano as part of a webpack build, the generated source-map has an additional segment at the end referencing a column not existing in the generated file with no mapping to the source file:

See the output source-map: [output.css.map](./dist/css/output-wp-css.map).

Run npm-scripts to (re-)build css, see the source-map-explorer error, or the decoded source-map mappings.

## configuration

webpack.config.js

```javascript
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
```

source file ( and output which looks the same):

```css
body{margin:0}
```

output source-map:

```json
{
  "version": 3,
  "sources": [
    "webpack:///main.css"
  ],
  "names": [],
  "mappings": "AAAA,KAAK,QAAQ,C",
  "file": "css/output-wp.css",
  "sourcesContent": [
    "body{margin:0}"
  ],
  "sourceRoot": ""
}
```

the `mappings` value will be decoded to `[ [ [ 0, 0, 0, 0 ], [ 5, 0, 0, 5 ], [ 13, 0, 0, 13 ], [ 14 ] ] ]`. Although the [source-map spec](https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit?hl=en_US&pli=1&pli=1#heading=h.qz3o9nc69um5) allows segments with only one variable, the issue is the column value `14` when the output has only a length of `13`.
This will cause for example the [source-map-explorer](https://github.com/danvk/source-map-explorer) to throw an exception:

> Your source map refers to generated column 15 on line 1, but the source only contains 14 column(s) on that line.
  Check that you are using the correct source map.

Removing the `cssnano` from the posctcss-loader's plugins will produce a source-map without the "corrupt" segment.

When running the postcss (+cssnano) on the cli, the source-map also looks fine!

Although there are many tools involved in generating this source map (lib-sass, node-sass, sass-loader, postcss-loader, postcss, cssnano, webpack,...) and the issue occurring only in the webpack build, I decided to fill the bug in this repo because of the said correlation.
