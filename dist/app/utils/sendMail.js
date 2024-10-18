"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../config"));
const sendEmail = (to, resetLink) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transporter = nodemailer_1.default.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: config_1.default.user_email,
                pass: config_1.default.user_pass,
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
        yield transporter.sendMail({
            from: config_1.default.user_email,
            to,
            subject: "Reset your Password Within 5 Minutes",
            text: `Please reset your password by clicking the following link: ${resetLink}`,
            html: htmlContent,
        });
        console.log("Email sent successfully");
    }
    catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Email could not be sent");
    }
});
exports.sendEmail = sendEmail;
