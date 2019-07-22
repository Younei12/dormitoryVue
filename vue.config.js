module.exports = {
    css: {
      loaderOptions: {
        // 给 sass-loader 传递选项
        sass: {
          // @/ 是 src/ 的别名
          data: `
          @import "~@/assets/mixin.scss";
          @import "~@/assets/base.scss";
          `
        }
      }
    }
  }