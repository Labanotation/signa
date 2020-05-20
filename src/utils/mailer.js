const nodemailer = require('nodemailer')

let _instance = undefined

class Mailer {
  constructor() {
    this._transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: (process.env.EMAIL_SECURE === 'true'),
      auth: {
        user: process.env.EMAIL_LOGIN,
        pass: process.env.EMAIL_PASS
      }
    })
  }

  static getInstance() {
    if (_instance === undefined) {
      _instance = new Mailer()
    }
    return _instance
  }

  async send(to, subject, text, html) {
    return await this._transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: to,
      subject: subject,
      text: text,
      html: html
    })
  }
}

module.exports = {
  Mailer: Mailer
}