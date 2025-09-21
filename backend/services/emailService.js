// Email utility using nodemailer and Gmail
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export const sendOTP = async (to, otp) => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to,
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${otp}`,
  };
  await transporter.sendMail(mailOptions);
};

export default {
  sendOTP
};
