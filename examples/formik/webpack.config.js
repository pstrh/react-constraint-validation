module.exports = {
  entry: "./src/index.tsx",
  mode: "development",
  output: {
    path: __dirname + "/public/dist/",
    filename: "app.js",
    publicPath: "dist/"
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"]
  },
  module: {
    rules: [
      {
        test: /\.(t|j)sx?$/,
        use: "awesome-typescript-loader",
        exclude: /node_modules/
      },
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
    ]
  },
  devtool: "inline-source-map"
};
