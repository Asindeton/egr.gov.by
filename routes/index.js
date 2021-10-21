const GovernmentApiCall = require("../public/javascripts/getApiInfo");
const creatXLSXFile = require("../public/javascripts/createXLSX");
const sendEmail = require("../public/javascripts/sendEmail");
const schedule = require("node-schedule");
var express = require("express");
require("dotenv").config();
var router = express.Router();
fs = require("fs");
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
// require("https").globalAgent.options.ca = require("ssl-root-cas").create();
// const asyncApiCall = async () => {

//   const response = await GovernmentApiCall.getAddressByPeriod(
//     yesterday2.toLocaleDateString(),
//     yesterday.toLocaleDateString(),
//   );
//   return response.data;
// };

const writeXML = async () => {
  const today = new Date();
  const yesterday = new Date(today);
  const yesterday2 = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday2.setDate(yesterday.getDate() - 1);

  const requestArr = await Promise.all([
    GovernmentApiCall.getAddressByPeriod(
      yesterday2.toLocaleDateString(),
      yesterday.toLocaleDateString(),
      "getIPFIOByPeriod",
    ),
    GovernmentApiCall.getAddressByPeriod(
      yesterday2.toLocaleDateString(),
      yesterday.toLocaleDateString(),
      "getAddressByPeriod",
    ),
    GovernmentApiCall.getAddressByPeriod(
      yesterday2.toLocaleDateString(),
      yesterday.toLocaleDateString(),
      "getJurNamesByPeriod",
    ),
    GovernmentApiCall.getIPinfo("291472935"),
  ]);
  // sendEmail.sendEmail(creatXLSXFile.createFile([iPFIOByPeriod, addressByPeriod]));
  creatXLSXFile.createFile(requestArr);
};

schedule.scheduleJob("0 0 * * *", async function () {
  console.log("Сработало планирование задачи");
  writeXML();
});

/* GET home page. */
router.get("/", function (req, res, next) {
  writeXML();
  res.render("index", { title: "Express" });
});

module.exports = router;
