const CracoLessPlugin = require("craco-less");
const path = require("path");
const CracoAlias = require("craco-alias");

module.exports = {
  plugins: [
    {
      plugin: CracoAlias,
      options: {
        source: "options",
        baseUrl: "./",
        aliases: {
          "@": "./src",
        },
      },
    },
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              "primary-color": "#1B98F5",
              "link-color": "#1B98F5",
              "border-radius-base": "4px",
              "heading-color": "#10002b",
              "text-color": "#2D3142",
              "text-color-secondary": "#4F5D75",
              "disabled-color": "#BFC0C0",
              "background-color-light": "rgba(249, 250, 252,1)",
              "background-color-base": "rgba(249, 250, 252,0.7)",
              "btn-font-weight": "600",
            },
            javascriptEnabled: true,
            relativeUrls: false,
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
