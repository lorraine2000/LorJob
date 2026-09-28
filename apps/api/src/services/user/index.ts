import { ProfilSchemaApi } from '@jobi/schemas/profil.schema';
import { Hono } from "hono";
import { APIContentfulStatusCode } from "@jobi/enums/api";
import { auth } from "@jobi/utils/auth";
import { APIAuthError, APIUserError } from "@jobi/enums/errors/api-errors";
import { getPlatformUser, getUser } from "./get-user";

import fs from "fs/promises";
import path from "path";
import { zodBadRequestValidator } from "../../lib/validators";
import { prisma } from "packages/api-utils/prisma";
import { authMiddleware } from '../../middlewares/authorization';


export const userService = new Hono()
    .get("/", authMiddleware, async (ctx) => {
    const userId = ctx.get("result");
		const { error, user } = await getUser(userId);
		if (error) return ctx.json({ message: error.message }, error.status);

		return ctx.json(user, APIContentfulStatusCode.OK);
	})
  .patch(
    "/",
    authMiddleware,
    zodBadRequestValidator("json", ProfilSchemaApi),
    async (ctx) => {
      const data = ctx.req.valid("json");
    const userId = ctx.get("result");

      const { error, user } = await getPlatformUser(userId);
      if (error) return ctx.json({ message: error.message }, error.status);

      try {
        const updatedUser = await prisma.user.update({
          where: { id: user.id },
          data
        });

        return ctx.json(updatedUser, APIContentfulStatusCode.OK);
      } catch (error) {
        console.error("Error updating user:", error);
        return ctx.json(
          { message: APIUserError.UPDATE_FAILED },
          APIContentfulStatusCode.INTERNAL_SERVER_ERROR
        );
      }
    })
	.get("/platform/session", authMiddleware, async (ctx) => {
    const userId = ctx.get("result");

		const { error, user } = await getPlatformUser(userId);
		if (error) return ctx.json({ message: error.message }, error.status);

		return ctx.json(user, APIContentfulStatusCode.OK);
	})
    .post("/upload-image", async (ctx) => {
      try {
        const formData = await ctx.req.formData();
        const file = formData.get("image");
    
        if (!(file instanceof File)) {
            console.error("Invalid file type:", file);
          return ctx.json({ message: "Fichier manquant ou invalide." }, APIContentfulStatusCode.BAD_REQUEST);
        }
    
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
    
        const uploadsDir = path.resolve(process.cwd(), "uploads");
        await fs.mkdir(uploadsDir, { recursive: true });
    
        const fileName = `${Date.now()}-${file.name}`;
        const filePath = path.join(uploadsDir, fileName);
    
        await fs.writeFile(filePath, buffer);
    
        return ctx.json({ message: "Fichier uploadé avec succès", path: `/uploads/${fileName}` }, APIContentfulStatusCode.OK);
      } catch (error) {
        console.error(error);
        return ctx.json({ message: "Erreur lors de l'upload" }, APIContentfulStatusCode.INTERNAL_SERVER_ERROR);
      }
    })
    .delete("/delete-account", authMiddleware, async (ctx) => {
      const userId = ctx.get("result");

      try {
        await prisma.user.delete({
          where: { id: userId },
        });

        return ctx.json({ message: "Compte supprimé avec succès" }, APIContentfulStatusCode.OK);
      } catch (error) {
        console.error("Error deleting account:", error);
        return ctx.json(
          { message: APIAuthError.DELETE_ACCOUNT_FAILED },
          APIContentfulStatusCode.INTERNAL_SERVER_ERROR
        );
      }
    })