// backend/src/templates/emailverification.js

const nodemailer = require("nodemailer");

// Setup transporter using .env
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

transporter.verify((err, success) => {
  if (err) console.log("SMTP Error: ", err);
  else console.log("SMTP Ready to send emails");
});

// Template function
exports.passwordVerificationTemplate = ({
  title = 'Reset your Password',
  name = '',
  link = '',
  time = new Date(),
}) => {
  return `
    <div>
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
            <title>${title}</title>
        </head>
        <body>
            <h2>${title}</h2>
            <p>Hello ${name},</p>
            <p>We have received a request to reset the password for your account on IDURAR. To proceed, click the link below:</p>
            <p><a href="${link}">${link}</a></p>
        </body>
    </div>
  `;
};

// Function to send password reset email
exports.sendPasswordResetEmail = async (toEmail, name, link) => {
  try {
    await transporter.sendMail({
      from: `"IDURAR" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: "Reset Your Password",
      html: exports.passwordVerificationTemplate({ name, link }),
    });
    console.log("Password reset email sent to:", toEmail);
  } catch (err) {
    console.error("Error sending password reset email:", err);
  }
};
