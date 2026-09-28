import { Hono } from "hono";
import { auth } from "@jobi/utils/auth";
import { APIContentfulStatusCode } from "packages/enums/api";
import { APIAuthError } from "packages/enums/errors/api-errors";
import { prisma } from "packages/api-utils/prisma";
import { addDays } from "date-fns";
import { authMiddleware } from "../../middlewares/authorization";

export const relanceService = new Hono()
.get("/all", authMiddleware, async (ctx) => {

  const relances = await prisma.relance.findMany({
    include: { jobApplication: true },
    orderBy: { dateRelance: "desc" },
  });

  return ctx.json(relances);
})
.patch("/:id", authMiddleware, async (ctx) => {
  const relanceId = ctx.req.param("id");
  const nextRelanceDate = addDays(new Date(), 7);

  try {
    const relance = await prisma.relance.findUnique({
      where: { id: relanceId },
      include: { jobApplication: true },
    });

    if (!relance) return ctx.json({ error: "Relance introuvable" }, APIContentfulStatusCode.NOT_FOUND);

    // 1. Marquer la relance comme faite
    await prisma.relance.update({
      where: { id: relanceId },
      data: {
        statut: "faite",
      },
    });

    const job = await prisma.jobApplication.update({
      where: { id: relance.jobApplicationId },
      data: {
        date_relance: new Date(),
        prochaine_relance: nextRelanceDate,
      },
      include: { relances: true}
    });

    await prisma.relance.create({
      data: {
        jobApplicationId: relance.jobApplicationId,
        dateRelance: nextRelanceDate,
        note: `${job.relances.length + 1}ème relance en cas de non réponse`,
      },
    });

    return ctx.json({ message: "Relance marquée comme faite et nouvelle relance créée" });
  } catch (error) {
    return ctx.json({ error: "Erreur serveur" }, APIContentfulStatusCode.INTERNAL_SERVER_ERROR);
  }
});

