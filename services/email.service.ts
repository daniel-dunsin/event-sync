import nodemailer, { SendMailOptions } from "nodemailer";
import secrets from "../constants/secrets.const";

const transporter = nodemailer.createTransport({
  service: "gmail",
  requireTLS: false,
  from: secrets.nodemailer.user,
  auth: {
    user: secrets.nodemailer.user,
    pass: secrets.nodemailer.pass,
  },
});

export async function sendMail(options: SendMailOptions) {
  try {
    await transporter.sendMail({ from: secrets.nodemailer.user, ...options });
  } catch (error) {
    // add exception
  }
}
