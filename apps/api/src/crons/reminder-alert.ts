import { reminderEmailsMessages } from "@jobi/i18n/emails/reminder";
import { Cron } from "croner";
import { prisma } from "@jobi/api-utils/prisma";
import { sendEmail } from "packages/api-utils/email";
import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";

export const reminderAlertCron = new Cron("0 10 * * *", async () => {
  try {
    const reminders = await prisma.relance.findMany({
      where: {
        dateRelance: {
          lte: new Date(),
        },
        emailSent: false,
        statut: {
          in: ["en retard", "à faire"],
        },
      },
      include: {
        jobApplication: {
          include: {
            user: true,
          },
        },
      },
    });

    const remindersByUser: Record<
      string,
      {
        email: string;
        firstName: string;
        isFindingJob: boolean;
        preferredLocale: "fr" | "en";
        relances: {
          jobTitle: string;
          companyName: string;
          relanceDate: string;
          relanceId: string;
        }[];
      }
    > = {};

    reminders.forEach((reminder) => {
      const jobApp = reminder.jobApplication;
      const user = jobApp?.user;

      if (
        !user?.id ||
        !user.email ||
        !(user.firstName || user.name) ||
        !user.preferredLocale ||
        !user.isFindingJob
      ) {
        console.warn(
          `[CRON] Données utilisateur manquantes pour la relance ${reminder.id}.`
        );
        return;
      }

      const firstName = user.firstName || user.name;
      const preferredLocale = user.preferredLocale as "fr" | "en";

      if (!remindersByUser[user.id]) {
        remindersByUser[user.id] = {
          isFindingJob: user.isFindingJob,
          email: user.email,
          firstName,
          preferredLocale,
          relances: [],
        };
      }

      if (remindersByUser[user.id]) {
        (remindersByUser[user.id]?.relances ?? []).push({
          jobTitle: jobApp.poste,
          companyName: jobApp.entreprise,
          relanceDate: format(new Date(reminder.dateRelance!), "dd MMMM yyyy", {
            locale: preferredLocale === "fr" ? fr : enUS,
          }),
          relanceId: reminder.id,
        });
      }
    });

    if (Object.keys(remindersByUser).length === 0) {
      console.log("[CRON] Aucune relance à envoyer.");
      return;
    }

    for (const userId in remindersByUser) {
      const { email, firstName, relances, preferredLocale, isFindingJob } =
        remindersByUser[userId]!;

      const template =
        reminderEmailsMessages[preferredLocale]["reminder-email"];

      if (isFindingJob) {
        await sendEmail(
          email,
          template.subject(),
          template.htmlBody(relances, firstName)
        );

        // Marquer les relances comme envoyées
        await prisma.relance.updateMany({
          where: {
            id: {
              in: relances.map((r) => r.relanceId),
            },
          },
          data: {
            emailSent: true,
          },
        });
      } else {
        console.log(
          `[CRON] L'utilisateur ${firstName} (${email}) n'est pas en recherche active. Aucune relance envoyée.`
        );
      }
    }
  } catch (error) {
    console.error("Erreur lors de l'envoi des relances : ", error);
  }
});
