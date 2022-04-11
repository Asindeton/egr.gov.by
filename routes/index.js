const GovernmentApiCall = require("../public/javascripts/getApiInfo");
const creatXLSXFile = require("../public/javascripts/createXLSX");
const sendEmail = require("../public/javascripts/sendEmail");
const schedule = require("node-schedule");
var express = require("express");
require("dotenv").config();
var router = express.Router();
fs = require("fs");

const writeXML = async (email, from, to, difficulty) => {
  const today = new Date();
  let yesterday = new Date(today);
  let yesterday2 = new Date(today);
  if (from !== "" && to !== "") {
    yesterday = new Date(to);
    yesterday2 = new Date(from);
  } else {
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday2.setDate(yesterday2.getDate() - 2);
  }

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
  // await creatXLSXFile.createFile(requestArr, difficulty);
  sendEmail.sendEmail(
    await creatXLSXFile.createFile(requestArr, difficulty),
    email,
    _y2,
    _y,
  );
  // console.log("Жду path", creatXLSXFile.createFile(requestArr));
};

schedule.scheduleJob("0 0 * * *", async function () {
  console.log("Сработало планирование задачи");
  writeXML();
});

/* GET home page. */
router.get("/", function (req, res, next) {
  const today = new Date();
  var yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  var dd = yesterday.getDate();
  var mm =
    yesterday.getMonth() + 1 < 10
      ? `0${yesterday.getMonth() + 1}`
      : yesterday.getMonth() + 1; //January is 0!
  var yyyy = yesterday.getFullYear();

  yesterday = yyyy + "-" + mm + "-" + dd;
  console.log(yesterday);
  res.render("index", {
    title: "Webfocus egr.gov.by",
    h1: "Введите свою почту для получения информации",
    yesterday: yesterday,
  });
});

router.post("/send_email", function (req, res, next) {
  const { email, from, to, difficulty } = req.body;
  console.log({ email, from, to, difficulty });
  // console.log(req);
  writeXML(email, from, to, difficulty);
  res.render("emailIsSended", {
    title: "Webfocus egr.gov.by",
    h1: email,
  });
});
module.exports = router;
