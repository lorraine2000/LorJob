import * as brevo from "@getbrevo/brevo";
import {
  AUTH_EMAIL_SENDER_EMAIL,
  AUTH_EMAIL_SENDER_NAME,
} from "@jobi/constants";
import { createTransport } from "nodemailer";

const mailHogTranport = createTransport({
  host: "localhost",
  port: 1026,
  secure: false,
});
if (process.env.NODE_ENV === "production" && !process.env.BREVO_API_KEY)
  throw new Error(
    "BREVO_API_KEY environment variable is required in production"
  );

const brevoApi = new brevo.TransactionalEmailsApi();
brevoApi.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY ?? ""
);

export async function sendEmail(to: string, subject: string, html: string) {
  const isProd =
    process.env.NODE_ENV === "production" && !!process.env.BREVO_API_KEY;

  console.log("Env NODE_ENV:", process.env.NODE_ENV);
  console.log("Using Brevo:", isProd);
  console.log("BREVO_API_KEY: ",process.env.BREVO_API_KEY);

  if (isProd) {
    console.log("prod: EMAIL ENVOYÉ >>>", { to, subject, html });
    const brevoEmail = new brevo.SendSmtpEmail();
    brevoEmail.to = [{ email: to }];
    brevoEmail.subject = subject;
    brevoEmail.htmlContent = html;
    brevoEmail.sender = {
      email: AUTH_EMAIL_SENDER_EMAIL,
      name: AUTH_EMAIL_SENDER_NAME,
    };

    await brevoApi.sendTransacEmail(brevoEmail);
  } else {
    console.log("Dev mode: EMAIL ENVOYÉ >>>", { to, subject, html });
    try {
      await mailHogTranport.sendMail({
        from: `${AUTH_EMAIL_SENDER_NAME} <${AUTH_EMAIL_SENDER_EMAIL}>`,
        html,
        subject,
        to,
      });
    } catch {
      console.warn(
        `⚠️ [DEV] MailHog (port 1026) n'est pas actif. Consultez le code de vérification ci-dessus dans la console.`
      );
    }
  }
}
