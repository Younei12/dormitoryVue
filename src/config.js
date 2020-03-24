const env = process.env.NODE_ENV;

const config = {
  baseUrl: env === "production" ? "http://dodopo.cn/dorm-after/" : "http://127.0.0.1:7416"
};
module.exports = config;
