const axios = require('axios');
module.exports = (headers) =>
  axios.create({
    timeout: 15000,
    headers: {
      ...(headers || {}),
    },
  });
