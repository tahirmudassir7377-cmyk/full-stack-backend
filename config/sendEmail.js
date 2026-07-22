const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = async (toEmail, token) => {
  const verifyLink = `https://fullstackbackend-project.bonto.run/api/auth/verify-email/${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: "Verify Your Email",
    html: `
      <h2>Welcome to ShopHub!</h2>
      <p>Please click the link below to verify your email:</p>
      <a href="${verifyLink}">${verifyLink}</a>
    `,
  });
};

module.exports = sendVerificationEmail;