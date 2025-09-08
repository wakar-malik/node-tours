const nodemailer = require("nodemailer");

const sendEmail = (options) => {
  // 1 create transporter
  const transporter = nodemailer.createTransport({
    // if we are using wel-known services like gmail/yahoo etc, we don't need to specify the host and port, just use service with name and nodemailer will automatically setup the host and port
    // with gmail we can only send 500 mails per day
    // service: "Gmail",

    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 2 define options
  const emailOptions = {
    from: "Wakar Malik <wakarmalik9@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3 send email
  return transporter.sendMail(emailOptions);
};

module.exports = sendEmail;
