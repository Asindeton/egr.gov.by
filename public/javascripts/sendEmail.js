require("dotenv").config();
const nodemailer = require("nodemailer");

module.exports = {
  sendEmail: (
    path,
    email = "info@webfocus.by, info@sovetnik.by, baza@jurisprudent.by",
    from,
    to,
  ) => {
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
      subject: `Данные с ${from} по ${to}`,
      attachments: [
        {
          filename: `Данные_с_${from}_по_${to}` + ".xlsx",
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
