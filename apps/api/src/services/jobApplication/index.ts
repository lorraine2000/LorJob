import { JobApplicationSchema } from "@jobi/schemas/job-application.schema";
import { Hono } from "hono";
import { zodBadRequestValidator } from "../../lib/validators";
import { auth } from "@jobi/utils/auth";
import { APIContentfulStatusCode } from "packages/enums/api";
import { APIAuthError } from "packages/enums/errors/api-errors";
import { getPlatformUser } from "../user/get-user";
import { prisma } from "packages/api-utils/prisma";
import { addDays } from "date-fns";
import { authMiddleware } from "../../middlewares/authorization";

export const jobApplicationService = new Hono()
  .get("/all", authMiddleware, async (ctx) => {
    let jobApplication;
    try {
      jobApplication = await prisma.jobApplication.findMany();
    } catch (error) {
      console.error(
        "Error when we are trying to get all job application: ",
        error
      );
      return ctx.json(
        { message: "Error when we are trying to get all job application" },
        APIContentfulStatusCode.INTERNAL_SERVER_ERROR
      );
    }

    return ctx.json(jobApplication, APIContentfulStatusCode.OK);
  })
  .post(
    "/add",
    authMiddleware,
    zodBadRequestValidator("json", JobApplicationSchema),
    async (ctx) => {
      const data = ctx.req.valid("json");
    const userId = ctx.get("result");
      let response;
      try {
        response = await prisma.jobApplication.create({
          data: {
            entreprise: data.entreprise,
            poste: data.poste,
            lieu: data.lieu,
            salaire_min: data.salaire_min,
            salaire_max: data.salaire_max,
            description: data.description,
            statut: data.statut,
            date_candidature: new Date(data.date_candidature),
            prochaine_relance: addDays(new Date(), 7),
            contact_email: data.contact_email,
            contact_nom: data.contact_nom,
            url_offre: data.url_offre,
            notes: data.notes,
            userId: userId,
            priorite: data.priorite,
          },
        });

        await prisma.relance.create({
          data: {
            jobApplicationId: response.id,
            dateRelance: response.prochaine_relance,
            note: "1ère relance en cas de non réponse",
          },
        });

      } catch (error) {
        console.error(
          "Error when we are trying to save your job application: ",
          error
        );
        return ctx.json(
          { message: "Error when we are trying to save your job application" },
          APIContentfulStatusCode.INTERNAL_SERVER_ERROR
        );
      }

      return ctx.json(response, APIContentfulStatusCode.CREATED);
    }
  );
