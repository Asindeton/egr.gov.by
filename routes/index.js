const GovernmentApiCall = require("../public/javascripts/getApiInfo");
const creatXLSXFile = require("../public/javascripts/createXLSX");
const sendEmail = require("../public/javascripts/sendEmail");
const schedule = require("node-schedule");
var express = require("express");
require("dotenv").config();
var router = express.Router();
fs = require("fs");

const writeXML = async (email) => {
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
  ]);
  sendEmail.sendEmail(await creatXLSXFile.createFile(requestArr), email);
  // console.log('Жду path',creatXLSXFile.createFile(requestArr));
};

schedule.scheduleJob("0 0 * * *", async function () {
  console.log("Сработало планирование задачи");
  writeXML();
});

/* GET home page. */
router.get("/", function (req, res, next) {
  // writeXML();
  res.render("index", {
    title: "Webfocus egr.gov.by",
    h1: "Введите свою почту для получения информации",
  });
});

router.post("/send_email", function (req, res, next) {
  const email = req.body.title;
  writeXML(email);
  res.render("emailIsSended", {
    title: "Webfocus egr.gov.by",
    h1: `Информация отправлена на почту ${email}`,
  });
});
module.exports = router;
