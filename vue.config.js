const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  publicPath: '/home-finance/',
  transpileDependencies: true,
  pages: {
    index: {
      entry: "src/main.js",
      title: "Home Finance",
    },
  },
});
