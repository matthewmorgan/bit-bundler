module.exports = {
  src: "src/main.js",
  dest: "dest/out.js",

  loader: [
    "bit-loader-js",
    "bit-loader-eslint"
  ]
};
