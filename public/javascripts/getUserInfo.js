const axios = require("axios");

const BASE_URL = `http://egr.gov.by/api/v2/egr`;

module.exports = {
  getIPinfo: (request, ngrn) =>
    axios({
      method: "GET",
      url: `http://egr.gov.by/api/v2/egr/${request}/${ngrn}`,
    }),
};
// getIPFIOByRegNum
// getJurNamesByRegNum
