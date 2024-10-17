import nodemailer from "nodemailer";
import config from "../config";

export const sendEmail = async (to: string, html: string) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: config.user_email,
        pass: config.user_pass,
      },
    });

    await transporter.sendMail({
      from: config.user_email,
      to,
      subject: "Reset your Password Within 5 Minutes",
      text: "Hello!",
      html,
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Email could not be sent");
  }
};
