const nodemailer = require("nodemailer");
const Brevo = require("@getbrevo/brevo");

const isDev = process.env.NODE_ENV !== "production";

// Unified email sender
async function sendEmail({ to, subject, html }) {
  try {
    if (isDev) {
      // Local: Use Nodemailer + Brevo SMTP
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP || "smtp-relay.brevo.com",
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_KEY,
        },
        tls: {
          ciphers: "SSLv3",
        },
      });

      await transporter.sendMail({
        from: "jameslarbie30@gmail.com",
        to,
        subject,
        html,
      });

      console.log(`Email sent via SMTP to ${to}`);
    } else {
      // 🚀 Production: Use Brevo API (Render safe)
      const client = new Brevo.TransactionalEmailsApi();
      client.setApiKey(
        Brevo.TransactionalEmailsApiApiKeys.apiKey,
        process.env.BREVO_API_KEY
      );

      await client.sendTransacEmail({
        sender: {
          email: process.env.SENDER_EMAIL || "no-reply@laforgecomics.com",
          name: process.env.APP_NAME || "LaForge Comics",
        },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      });

      console.log(`Email sent via Brevo API to ${to}`);
    }

    return true;
  } catch (err) {
    console.error("Email send failed:", err.message);
    return false;
  }
}

module.exports = { sendEmail };
