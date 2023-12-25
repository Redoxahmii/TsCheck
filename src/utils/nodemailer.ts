import nodemailer from "nodemailer";
import "dotenv/config.js";
// INFO: aslways use secure true to make it work
export async function Mailer(Report: string, titles: string[]) {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.USER_NODEMAILER,
        pass: process.env.PASS_NODEMAILER,
      },
    });
    const mailOptions = {
      from: "Node Mailer server",
      to: "fullmetal2334@gmail.com", // list of receivers
      subject: "Report for automation", // Subject line
      text: `${Report}\n\nTitles:\n${titles.join("\n")}`, // separate titles with new lines
    };
    await transporter.sendMail(mailOptions);
    console.log("mail has been sent");
  } catch (error) {
    console.log(error);
  }
}
