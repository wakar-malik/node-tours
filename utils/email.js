const nodemailer = require("nodemailer");
const pug = require("pug");
const htmlToText = require("html-to-text");

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(" ")[0];
    this.url = url;
    this.from = `Wakar Malik <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === "production") {
      return nodemailer.createTransport({
        // if we are using wel-known services like gmail/yahoo etc, we don't need to specify the host and port, just use service with name and nodemailer will automatically setup the host and port
        // with gmail we can only send 500 mails per day
        // service: "Gmail",

        host: process.env.BRAVO_HOST,
        port: process.env.BRAVO_PORT,
        auth: {
          user: process.env.BRAVO_USERNAME,
          pass: process.env.BRAVO_PASSWORD,
        },
      });
    }

    return nodemailer.createTransport({
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
  }

  async send(template, subject) {
    // create html template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    //define email options
    const emailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.convert(html),
    };

    // create transporter and send email
    await this.newTransport().sendMail(emailOptions);
  }

  async sendWelcome() {
    await this.send("welcome", "Welcome to the node-tours");
  }

  async sendPasswordReset() {
    await this.send(
      "passwordReset",
      "Your password reset token (valid for only 10 minutes)"
    );
  }
};
