require("dotenv").config();
const nodemailer = require("nodemailer");
const { Buffer } = require("buffer");
var toCsv = require("to-csv");

module.exports = {
  sendEmail: (
    path,
    email = "info@webfocus.by, info@sovetnik.by, baza@jurisprudent.by",
  ) => {
    // console.table(path);
    console.log(email);
    let transporter = nodemailer.createTransport({
      service: "yandex",
      auth: {
        user: process.env.POST_EMAIL,
        pass: process.env.POST_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    let mailOptions = {
      from: process.env.POST_EMAIL,
      to: email,
      subject: `Данные за ${new Date().toLocaleDateString()}`,
      attachments: [
        {
          filename: `Данные за ${new Date().toLocaleDateString()}` + ".xlsx",
          // content: new Buffer(path),
          // path,
          content: path,
          contentType:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
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
  },
};
