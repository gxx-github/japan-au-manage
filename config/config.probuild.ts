export default {
  define: {
    BASE_API_URL: "https://api.crypato.com/api",
    "process.env.SHOW_TEST_NETWORK": true,
  },
  // proxy: {
  //   "/auapi": {
  //     target: "https://api.crypato.com",
  //     pathRewrite: { "^/": "" },
  //     secure: false,
  //   },
  // },
};