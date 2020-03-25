# source-map with non existing column number

Sometimes during compilation of files, some plugins will add an eol to the end of the output. e.g. [mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin). During the source-map generation (e.g. by [mozilla/source-map](https://github.com/mozilla/source-map)) a new segment will be added for the line ending without a reference to the original source (probably because the eol didn't come from the source). Which according to the source-map [spec](https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit?hl=en_US&pli=1&pli=1#heading=h.qz3o9nc69um5), segments with only one variable are allowed.

[source-map-explorer](https://github.com/danvk/source-map-explorer) when reading such a source-map throws `InvalidMappingColumn` error with the message:
> Your source map refers to generated column 15 on line 1, but the source only contains 14 column(s) on that line.
  Check that you are using the correct source map.

See the output source-map: [output.css.map](./dist/css/output.css.map).

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
              sourceMap: true,
            },
          },
          {
            loader: require.resolve("css-loader"),
            options: {
              sourceMap: true,
            }
          },
        ]
      }
    ]
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/output.css"
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

the `mappings` value will be decoded to

```json
[ [ [ 0, 0, 0, 0 ], [ 5, 0, 1, 2 ], [ 13, 0, 2, 0 ], [ 14 ] ] ]
```

the issue is the column value `14` when the output has only a length of `13`.
This will cause for example the [source-map-explorer](https://github.com/danvk/source-map-explorer) to throw an exception.
