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

  let _y = `${yesterday.getDate()}.${
    yesterday.getMonth() + 1
  }.${yesterday.getFullYear()}`;

  let _y2 = `${yesterday2.getDate()}.${
    yesterday2.getMonth() + 1
  }.${yesterday2.getFullYear()}`;

  // let _y = "06.11.2021"; // Верхнее
  // let _y2 = "04.11.2021"; // Нижнее
  const requestArr = await Promise.all([
    GovernmentApiCall.getAddressByPeriod(_y2, _y, "getIPFIOByPeriod"),
    GovernmentApiCall.getAddressByPeriod(_y2, _y, "getAddressByPeriod"),
    GovernmentApiCall.getAddressByPeriod(_y2, _y, "getJurNamesByPeriod"),
  ]);
  // await creatXLSXFile.createFile(requestArr);
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
  let today = new Date();
  const fileName = `${`${today.getDate()}.${
    today.getMonth() + 1
  }.${today.getFullYear()}`}_${new Date().getHours()}.${new Date().getMinutes()}.${new Date().getSeconds()}`;

  console.log(fileName);

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
