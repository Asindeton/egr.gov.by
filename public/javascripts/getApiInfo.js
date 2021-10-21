const axios = require("axios");

const BASE_URL = `https://egr.gov.by/api/v2/egr`;

module.exports = {
  getAddressByPeriod: (startDate, endDate, request) =>
    axios({
      method: "GET",
      url: BASE_URL + `/${request}/${startDate}/${endDate}`,
    }),
  getIPinfo: (ngrn) => {
    console.log("helloWorld");
    axios({
      method: "GET",
      url: "https://egr.gov.by/api/v2/egr/getIPFIOByRegNum/291472935",
    });
  },
};
//getIPFIOByPeriod
//getAddressByPeriod
//getJurNamesByPeriod
