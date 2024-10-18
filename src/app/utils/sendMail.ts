import nodemailer from "nodemailer";
import config from "../config";

export const sendEmail = async (to: string, resetLink: string) => {
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

    const htmlContent = `
      <h2>Reset Your Password</h2>
      <p>Hello,</p>
      <p>We received a request to reset the password for your account. You can reset your password by clicking the link below:</p>
      <a href="${resetLink}">Reset Password</a>
      <p>Please note that this link will expire in 5 minutes.</p>
      <p>If you did not request a password reset, you can ignore this email and your password will remain unchanged.</p>
      <p>Best regards,</p>
      <p>The Team</p>
    `;

    await transporter.sendMail({
      from: config.user_email,
      to,
      subject: "Reset your Password Within 5 Minutes",
      text: `Please reset your password by clicking the following link: ${resetLink}`,
      html: htmlContent,
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Email could not be sent");
  }
};
