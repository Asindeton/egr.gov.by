const GovernmentApiCall = require("../public/javascripts/getApiInfo");
var express = require("express");
const nodemailer = require("nodemailer");
// const xl = require("excel4node");
var router = express.Router();
fs = require("fs");

let transporter = nodemailer.createTransport({
  service: "yandex",
  auth: {
    user: "dl@webfocus.by",
    pass: "XASwuV",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

let mailOptions = {
  from: "dl@webfocus.by",
  to: "legankov95@gmail.com",
  subject: "qwe",
  text: "asd",
  attachments: [
    {
      filename: "text4.txt",
      content: 'fs.createReadStream("file.txt")',
    },
  ],
};

transporter.sendMail(mailOptions, function (err, success) {
  if (err) {
    console.log(err);
  } else {
    console.log("Email is send");
  }
});

/* GET home page. */
router.get("/", function (req, res, next) {
  const asyncApiCall = async () => {
    const response = await GovernmentApiCall.getAddressByPeriod(
      "12.10.2021",
      "13.10.2021",
    );
    return response.data;
  };
  const xl = require("excel4node");
  const wb = new xl.Workbook();
  const ws = wb.addWorksheet("Worksheet Name");

  // const data = [
  //   {
  //     name: "Shadab Shaikh",
  //     email: "shadab@gmail.com",
  //     mobile: "1234567890",
  //   },
  // ];

  const writeXML = async () => {
    const data = await asyncApiCall();
    console.log(typeof data);

    const fileName = `${new Date().toLocaleDateString()}`;
    return JSON.stringify(data);
    // fs.writeFile(
    //   `./data/${fileName}.txt`,
    //   JSON.stringify(data),
    //   function (err) {
    //     if (err) return console.log(err);
    //     console.log("Hello World > helloworld.txt");
    //   },
    // );

    // const headingColumnNames = ["Name", "Email", "Mobile"];

    // //Write Column Title in Excel file
    // let headingColumnIndex = 1;
    // headingColumnNames.forEach((heading) => {
    //   ws.cell(1, headingColumnIndex++).string(heading);
    // });

    // //Write Data in Excel file
    // let rowIndex = 2;
    // console.log(data);
    // data.forEach((record) => {
    //   let columnIndex = 1;
    //   Object.keys(record).forEach((columnName) => {
    //     ws.cell(rowIndex, columnIndex++).string(record[columnName]);
    //   });
    //   rowIndex++;
    // });

    // const fileName = `${new Date().toLocaleDateString()}_${new Date()
    //   .toLocaleTimeString()
    //   .split(":")
    //   .join(".")}`;

    // wb.write(`./data/${fileName}.xlsx`, function (err, stats) {
    //   if (err) {
    //     console.error(err);
    //   } else {
    //     console.log(stats); // Prints out an instance of a node.js fs.Stats object
    //   }
    // });
  };

  // writeXML();
  res.render("index", { title: "Express" });
});

module.exports = router;
