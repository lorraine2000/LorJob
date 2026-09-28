import { prisma } from "@jobi/api-utils/prisma";
import {
  AUTH_EMAIL_EXPIRATION_MINUTES,
  BASE_LOCAL_API_URL,
  BASE_LOCAL_FRONTEND_URL,
  DEFAULT_LOCALE,
  OTP_LENGTH,
  SESSION_EXPIRATION_DAYS,
} from "@jobi/constants";
import { authEmailsMessages } from "@jobi/i18n/emails/auth";
import { getLanguage } from "@jobi/utils/get-language";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailOTP } from "better-auth/plugins";
import { sendEmail } from "@jobi/api-utils/email";

const isProd = process.env.NODE_ENV === "production";

export default betterAuth({
  ...(isProd && {
    advanced: {
      useSecureCookies: true,
      crossSubDomainCookies: {
        enabled: true,
        domain: ".jobtrack.fr",
      },
      cookies: {
        session_token: {
          name: "custom_session_token",
          attributes: {
            secure: true,
            sameSite: "lax",
            httpOnly: true,
          },
        },
      },
    },
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [
    BASE_LOCAL_FRONTEND_URL,
    BASE_LOCAL_API_URL,
    process.env.NEXT_PUBLIC_API_URL ?? "",
    process.env.BASE_FRONTEND_URL ?? "",
    "https://www.jobtrack.fr",
  ],
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    autoSignIn: false,
  },
  emailVerification: { autoSignInAfterVerification: true },
  user: {
    additionalFields: {
      preferredLocale: {
        type: "string",
        default: DEFAULT_LOCALE,
        description: "Preferred locale of the user",
        fieldName: "preferredLocale",
      },
      firstName: {
        type: "string",
        default: DEFAULT_LOCALE,
        description: "First name of the user",
        fieldName: "firstName",
      },
      lastName: {
        type: "string",
        default: DEFAULT_LOCALE,
        description: "Last name of the user",
        fieldName: "lastName",
      },
    },
  },
  session: {
    expiresIn: SESSION_EXPIRATION_DAYS * 24 * 60 * 60, // 7 days in seconds
    updateAge: 24 * 60 * 60, // 1 day in seconds
  },
  plugins: [
    emailOTP({
      disableSignUp: false, // Does not automatically sign up users on OTP verification
      otpLength: OTP_LENGTH,
      expiresIn: 60 * AUTH_EMAIL_EXPIRATION_MINUTES,
      sendVerificationOnSignUp: true,
      sendVerificationOTP: async ({ email, otp, type }, request) => {
        const locale = request ? getLanguage() : DEFAULT_LOCALE;
        await sendEmail(
          email,
          authEmailsMessages[locale][type].subject(otp),
          authEmailsMessages[locale][type].htmlBody(otp)
        );
      },
    }),
  ],
});
