const merge = require("webpack-merge");

module.exports = storybookBaseConfig =>
  merge(storybookBaseConfig, {
    module: {
      rules: [
        {
          test: /\.(png|jpe?g|gif|woff2?|ttf|eot)$/,
          loader: "url-loader?limit=8000",
        },
        {
          test: /\.(svg)$/,
          use: "svg-inline-loader",
        },
        {
          test: /\.(ttf|otf|eot|woff(2)?)(\?[a-z0-9]+)?$/,
          loader: "file-loader?name=fonts/[name].[ext]",
        },
        { use: ["style-loader", "css-loader"], test: /\.(css|scss)$/ },
      ],
    },
  });
