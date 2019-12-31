module.exports = {
    css: {
      loaderOptions: {
        // 给 sass-loader 传递选项
        sass: {
          // @/ 是 src/ 的别名
          prependData: `
          @import "~@/assets/styles/mixin.scss";
          @import "~@/assets/styles/base.scss";
          `
        }
      }
    }
  }
