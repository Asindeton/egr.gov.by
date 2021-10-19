const GovernmentApiCall = require("../public/javascripts/getApiInfo");
const creatXLSXFile = require("../public/javascripts/createXLSX");
const sendEmail = require("../public/javascripts/sendEmail");
const schedule = require("node-schedule");
var express = require("express");
require("dotenv").config();
var router = express.Router();
fs = require("fs");

const asyncApiCall = async () => {
  const today = new Date();
  const yesterday = new Date(today);
  const yesterday2 = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday2.setDate(yesterday.getDate() - 1);
  console.log(yesterday.toLocaleDateString());
  console.log(yesterday2.toLocaleDateString());
  const response = await GovernmentApiCall.getAddressByPeriod(
    yesterday2.toLocaleDateString(),
    yesterday.toLocaleDateString(),
  );
  return response.data;
};
schedule.scheduleJob("0 0 * * *", async function () {
  console.log("Сработало планирование задачи");
  sendEmail.sendEmail(creatXLSXFile.createFile(await asyncApiCall()));
});

const today = new Date();
const yesterday = new Date(today);
const yesterday2 = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
yesterday2.setDate(yesterday.getDate() - 1);
console.log(yesterday.toLocaleDateString());
console.log(yesterday2.toLocaleDateString());
// console.log(`${new Date().toLocaleDateString().split('.')}`);
/* GET home page. */
router.get("/", function (req, res, next) {
  console.log({
    user: process.env.POST_EMAIL,
    pass: process.env.POST_PASSWORD,
  });

  const writeXML = async () => {
    sendEmail.sendEmail(creatXLSXFile.createFile(await asyncApiCall()));
  };

  writeXML();
  res.render("index", { title: "Express" });
});

module.exports = router;
