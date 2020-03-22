const config = require('@/config');

// 转换静态资源路径
export const convertUrl = (url) => {
  const baseUrl = config.baseUrl;
  const path = url.replace(/\\/g, '/');
  return baseUrl + '/' + path;
};

