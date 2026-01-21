const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendLoginAlert = async (email, name) => {
  await transporter.sendMail({
    from: `"Security Alert" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "New Login Detected",
    html: `
      <h3>Hello ${name}</h3>
      <p>A new login to your account was detected.</p>
      <p>If this was not you, reset your password immediately.</p>
    `
  });
};

module.exports = { sendLoginAlert };

