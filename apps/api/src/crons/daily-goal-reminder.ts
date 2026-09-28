import { Cron } from "croner";
import { prisma } from "@jobi/api-utils/prisma";
import { sendEmail } from "packages/api-utils/email";
import { reminderEmailsMessages } from "@jobi/i18n/emails/reminder";

export const dailyGoalReminderCron = new Cron("0 23 * * *", async () => {
  console.log("[CRON] Daily goal reminder started");
  try {
    const users = await prisma.user.findMany({
      where: {
        isFindingJob: true,
        objectif_quotidien: {
          gt: 0,
        },
      },
    });

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    for (const user of users) {
      const nbCandidatures = await prisma.jobApplication.count({
        where: {
          userId: user.id,
          date_candidature: {
            gte: todayStart,
            lte: todayEnd,
          },
        },
      });

      const goal = user.objectif_quotidien ?? 0;

      if (nbCandidatures < goal) {
        const locale = (user.preferredLocale ?? "fr") as "fr" | "en";
        const template = reminderEmailsMessages[locale]["daily-goal-reminder"];

        await sendEmail(
          user.email,
          template.subject(),
          template.htmlBody(user.firstName || user.name, nbCandidatures, goal)
        );

        console.log(`[CRON] Mail de rappel envoyé à ${user.email} (${nbCandidatures}/${goal})`);
      }
    }
  } catch (err) {
    console.error("[CRON] Erreur lors de l'envoi du rappel quotidien :", err);
  }
});
