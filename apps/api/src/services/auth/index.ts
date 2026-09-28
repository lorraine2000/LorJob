import { signUpFormSchemaServer } from "@jobi/schemas/signForm.schema";
import { Hono } from "hono";
import { z } from "zod";

import { prisma } from "@jobi/api-utils/prisma";
import { APICheckEmailResult, APIContentfulStatusCode } from "@jobi/enums/api";
import { auth } from "@jobi/utils/auth";
import { APIUserError } from "@jobi/enums/errors/api-errors";
import { emailSchema } from "@jobi/schemas/email.schema";
import { formatFirstname, formatLastname } from "@jobi/utils/string";
import { zodBadRequestValidator } from "../../lib/validators";

export const authService = new Hono()
  .post(
    "/check-email",
    zodBadRequestValidator("json", z.object({ email: emailSchema })),
    async (ctx) => {
      const { email } = ctx.req.valid("json");
      const user = await prisma.user.findUnique({
        where: { email },
        select: { emailVerified: true },
      });
      console.log("Check email user:", user);
      console.log("Check email email:", email);
      if (!user)
        return ctx.text(
          APICheckEmailResult.EMAIL_AVAILABLE,
          APIContentfulStatusCode.OK
        );
      if (!user.emailVerified) {
        await auth.api.sendVerificationOTP({
          body: { email, type: "email-verification" },
        });
        return ctx.text(
          APICheckEmailResult.EMAIL_UNVERIFIED,
          APIContentfulStatusCode.OK
        );
      }
      return ctx.json(
        { message: APIUserError.USER_WITH_EMAIL_ALREADY_EXISTS },
        APIContentfulStatusCode.CONFLICT
      );
    }
  )
  .post(
    "/sign-up",
    zodBadRequestValidator("json", signUpFormSchemaServer),
    async (ctx) => {
      const userData = ctx.req.valid("json");

      const firstName = formatFirstname(userData.firstName);
      const lastName = formatLastname(userData.lastName);

      let token;

      try {
        const response = await auth.api.signUpEmail({
          body: {
            name: `${firstName} ${lastName}`,
            email: userData.email,
            password: userData.password,
            preferredLocale: "fr",
            firstName,
            lastName,
          },
          headers: ctx.req.raw.headers,
          returnHeaders: true,
        });
        token = response.response.token;
        console.log("Sign up headers:", response.headers);
      } catch (error) {
        console.error("Error during sign up:", error);
        return ctx.json(
          { message: `Error during sign up: ${error}` },
          APIContentfulStatusCode.INTERNAL_SERVER_ERROR
        );
      }
      let user;
      try {
        user = await prisma.user.update({
          where: { email: userData.email },
          data: {
            firstName,
            lastName,
            image: userData.image,
            objectif_quotidien: userData.objectif_quotidien,
          },
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
            emailVerified: true,
            firstName: true,
            lastName: true,
            objectif_quotidien: true,
          },
        });
      } catch (error) {
        console.error("Error updating user:", error);
        return ctx.json(
          { message: "Erreur lors de la mise à jour de l'utilisateur" },
          APIContentfulStatusCode.INTERNAL_SERVER_ERROR
        );
      }
      ctx.header(
        "Set-Cookie",
        `token=${token}; Path=/; HttpOnly; Secure; SameSite=None`
      );
      return ctx.json(user, APIContentfulStatusCode.CREATED);
    }
  );
