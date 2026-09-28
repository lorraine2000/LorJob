import { COMPANY_NAME, type Locales } from "@jobi/constants";

const URL =
  process.env.NODE_ENV === "production"
    ? `${process.env.BASE_FRONTEND_URL}`
    : "http://localhost:3000";

export const reminderEmailsMessages: Record<
  Locales,
  {
    "reminder-email": {
      htmlBody: (
        relances: {
          jobTitle: string;
          companyName: string;
          relanceDate: string;
        }[],
        firstName: string
      ) => string;
      subject: () => string;
    };
    "delete-application": {
      htmlBody: (
        application: { jobTitle: string; companyName: string },
        firstName: string
      ) => string;
      subject: () => string;
    };
    "daily-goal-reminder": {
      subject: () => string;
      htmlBody: (firstName: string, current: number, goal: number) => string;
    };
  }
> = {
  fr: {
    "reminder-email": {
      htmlBody: (
        relances: {
          jobTitle: string;
          companyName: string;
          relanceDate: string;
        }[],
        firstName: string
      ) => `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9fafb; color: #111827;">
      <h2>Bonjour ${firstName},</h2>
      <p>Vous avez <strong>${
        relances.length
      }</strong> relance(s) à effectuer concernant vos candidatures :</p>
      <ul>
        ${relances
          .map(
            (r) => `
            <li style="margin-bottom: 12px;">
              <strong>${r.jobTitle}</strong> chez <strong>${r.companyName}</strong><br/>
              📅 Relance prévue le : <em>${r.relanceDate}</em>
            </li>
          `
          )
          .join("")}
      </ul>
      <p>Nous vous encourageons à faire un suivi rapidement pour maximiser vos chances.</p>
      <a href="${URL}/relances" style="display: inline-block; margin-top: 20px; background-color: #3b82f6; color: white; padding: 12px 20px; border-radius: 6px; text-decoration: none;">Accéder à mon tableau de bord</a>
      <p style="font-size: 12px; color: #6b7280; margin-top: 30px;">Cet e-mail a été envoyé automatiquement. Merci de ne pas y répondre.</p>
    </div>
  `,
      subject: () => `🔔 Vous avez des relances à effectuer - ${COMPANY_NAME}`,
    },
    "delete-application": {
      htmlBody: (
        application: { jobTitle: string; companyName: string },
        firstName: string
      ) => `
                <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9fafb; color: #111827;">
                    <h2>Bonjour ${firstName},</h2>
                    <p>Votre candidature pour le poste de <strong>${application.jobTitle}</strong> chez <strong>${application.companyName}</strong> a été supprimée.</p>
                    <p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>
                    <p style="font-size: 12px; color: #6b7280; margin-top: 30px;">Cet e-mail a été envoyé automatiquement. Merci de ne pas y répondre.</p>
                </div>
            `,
      subject: () => `Candidature supprimée - ${COMPANY_NAME}`,
    },
    "daily-goal-reminder": {
      subject: () => "⏰ Il vous reste des candidatures à envoyer aujourd'hui",
      htmlBody: (firstName: string, current: number, goal: number) => `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Bonsoir ${firstName},</h2>
          <p>Vous avez postulé à <strong>${current}</strong> offre(s) aujourd'hui sur un objectif de <strong>${goal}</strong>.</p>
          <p>Il est encore temps d'envoyer une ou deux candidatures pour atteindre votre objectif 💪</p>
          <a href="${URL}/job-application" style="display: inline-block; margin-top: 20px; background-color: #3b82f6; color: white; padding: 12px 20px; border-radius: 6px; text-decoration: none;">Accéder à mon tableau de bord</a>
          <p style="font-size: 12px; color: #6b7280; margin-top: 30px;">Cet e-mail a été envoyé automatiquement. Merci de ne pas y répondre.</p>
          <p>L'équipe ${COMPANY_NAME} 🚀</p>
        </div>
      `,
    },
  },
  en: {
    "reminder-email": {
      htmlBody: (
        reminders: {
          jobTitle: string;
          companyName: string;
          relanceDate: string;
        }[],
        firstName: string
      ) => `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9fafb; color: #111827;">
      <h2>Hello ${firstName},</h2>
      <p>You have <strong>${
        reminders.length
      }</strong> pending follow-up(s) for your job applications:</p>
      <ul>
        ${reminders
          .map(
            (r) => `
            <li style="margin-bottom: 12px;">
              <strong>${r.jobTitle}</strong> at <strong>${r.companyName}</strong><br/>
              📅 Follow-up scheduled on: <em>${r.relanceDate}</em>
            </li>
          `
          )
          .join("")}
      </ul>
      <p>We recommend reaching out as soon as possible to increase your chances of success.</p>
      <a href="${URL}/relances" style="display: inline-block; margin-top: 20px; background-color: #3b82f6; color: white; padding: 12px 20px; border-radius: 6px; text-decoration: none;">Go to my dashboard</a>
      <p style="font-size: 12px; color: #6b7280; margin-top: 30px;">This email was sent automatically. Please do not reply.</p>
    </div>
  `,
      subject: () => `🔔 You have pending follow-ups - ${COMPANY_NAME}`,
    },
    "delete-application": {
      htmlBody: (
        application: { jobTitle: string; companyName: string },
        firstName: string
      ) => `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9fafb; color: #111827;">   
            <h2>Hello ${firstName},</h2>
            <p>Your application for the position of <strong>${application.jobTitle}</strong> at <strong>${application.companyName}</strong> has been deleted.</p>
            <p>If you have any questions, feel free to contact us.</p>
            <p style="font-size: 12px; color: #6b7280; margin-top: 30px;">This email was sent automatically. Please do not reply.</p>
        </div>
            `,
      subject: () => `Application deleted - ${COMPANY_NAME}`,
    },
    "daily-goal-reminder": {
      subject: () => `🎯 Daily Goal: A few more applications to go!`,
      htmlBody: (firstName: string, current: number, goal: number) => `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <p>Good evening ${firstName},</p>
            <p>You’ve applied to <strong>${current}</strong> job(s) today, but your goal is <strong>${goal}</strong>.</p>
            <p>There’s still time to catch up 💪</p>
            <a href="${URL}/job-application" style="display: inline-block; margin-top: 20px; background-color: #3b82f6; color: white; padding: 12px 20px; border-radius: 6px; text-decoration: none;">Go to my dashboard</a>
            <p style="font-size: 12px; color: #6b7280; margin-top: 30px;">This email was sent automatically. Please do not reply.</p>
            <p>The ${COMPANY_NAME} Team 🚀</p>
        </div>
      `,
    },
  },
};
