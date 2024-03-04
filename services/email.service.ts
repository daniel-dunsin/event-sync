import nodemailer, { SendMailOptions } from "nodemailer";
import secrets from "../constants/secrets.const";
import ServiceException from "../schema/exceptions/service.exception";

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
    throw new ServiceException(400, "unable to send email");
  }
}
