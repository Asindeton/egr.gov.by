const axios = require("axios");

const BASE_URL = `http://egr.gov.by/api/v2/egr`;

module.exports = {
  getAddressByPeriod: (startDate, endDate, request) =>
    axios({
      method: "GET",
      url: BASE_URL + `/${request}/${startDate}/${endDate}`,
    }),
};
//getIPFIOByPeriod
//getAddressByPeriod
//getJurNamesByPeriod
