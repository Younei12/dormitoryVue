const env = process.env.NODE_ENV;

// 设置根 运行Url
const config = {
  // baseUrl: env === "production" ? "http://dodopo.cn/dorm-after/" : "http://127.0.0.1:7416"
  baseUrl: "http://127.0.0.1:7416"
};
module.exports = config;
