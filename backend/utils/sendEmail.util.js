import fs from "fs/promises";
import path from "path";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SENDER.trim(),
    pass: process.env.PASS.trim(),
  },
});

const sendEmail = async (
  email,
  from,
  to,
  rate,
  condition = null,
  threshold = null
) => {
  try {
    let html;
    if (condition && threshold) {
      html = await fs.readFile(
        path.resolve("templates/triggeredThresold.html"),
        "utf-8"
      );
      html = html
        .replace(/{{from}}/g, from)
        .replace(/{{to}}/g, to)
        .replace(/{{rate}}/g, rate)
        .replace(/{{condition}}/g, condition)
        .replace(/{{threshold}}/g, threshold);
    } else {
      html = await fs.readFile(
        path.resolve("templates/dailyUpdates.html"),
        "utf-8"
      );
      html = html
        .replace(/{{from}}/g, from)
        .replace(/{{to}}/g, to)
        .replace(/{{rate}}/g, rate)
        .replace(/{{date}}/g, new Date().toLocaleDateString())
        .replace(/{{time}}/g, new Date().toLocaleTimeString());
    }

    const info = await transporter.sendMail({
      from: `"Nishant Shigwan" <${process.env.SENDER}>`,
      to: email,
      subject: "Currency updates",
      html,
    });
    console.log(`Email sent: ${info.messageId}`);
  } catch (error) {
    console.log(error);
  }
};

export default sendEmail;
