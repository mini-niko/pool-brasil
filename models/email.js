import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import EmailComponent from "infra/component/email/ConfirmAccount";

const mailCredentials = {
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASSWORD,
};

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SMTP_SERVER,
  port: process.env.EMAIL_SMTP_PORT,
  auth: mailCredentials,
  secure: isSecure(),
});

async function sendMail(toEmail, subject, component = <EmailComponent />) {
  const html = await render(component);

  const mail = await transporter.sendMail({
    from: mailCredentials.user,
    to: toEmail,
    replyTo: mailCredentials.user,
    subject,
    html,
  });

  return mail;
}

function isSecure() {
  return process.env.NODE_ENV === "production";
}

const email = {
  sendMail,
};

export default email;
