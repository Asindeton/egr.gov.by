require("dotenv").config();
const nodemailer = require("nodemailer");

module.exports = {
  sendEmail: (path) => {
    console.log(path);
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
      to: "legankov95@gmail.com",
      subject: `Данные за ${new Date().toLocaleDateString()}`,
      attachments: [
        {
          path: path,
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
