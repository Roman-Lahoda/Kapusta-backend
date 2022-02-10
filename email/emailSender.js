import nodemailer from 'nodemailer';

class SenderNodemailer {
  async send(message) {
    const config = {
      host: 'smtp.meta.ua',
      port: 465,
      secure: true,
      auth: {
        user: process.env.USER_NODEMAILER,
        pass: process.env.PASSWORD_NODEMAILER,
      },
    };
    const transporter = nodemailer.createTransport(config);
    return await transporter.sendMail(...message, process.env.USER_NODEMAILER);
  }
}
export default SenderNodemailer;
