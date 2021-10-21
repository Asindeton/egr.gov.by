require("dotenv").config();
const nodemailer = require("nodemailer");

module.exports = {
  sendEmail: (
    path,
    email = "info@webfocus.by, info@sovetnik.by, baza@jurisprudent.by",
  ) => {
    console.log(path);
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
