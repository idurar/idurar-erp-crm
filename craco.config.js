const CracoLessPlugin = require("craco-less");
const path = require("path");
const CracoAlias = require("craco-alias");

module.exports = {
  plugins: [],
};
module.exports = {
  plugins: [
    {
      plugin: CracoAlias,
      options: {
        source: "options",
        baseUrl: "./",
        aliases: {
          "@": "./src",
          // "@": "./",
        },
      },
    },
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { "@primary-color": "#1DA57A" },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
  // webpack: {
  //   alias: {
  //     "@": path.resolve(__dirname, "src/"),
  //   },
  //   output: {
  //     publicPath: "/",
  //     path: path.join(__dirname, "root"),
  //   },
  // },
  jest: {
    moduleNameMapper: {
      "^@/(.+)": "<rootDir>/src/$1",
    },
  },
};
