
export const LOCALES = [
  { value: "fr", label: "Français" },
  { value: "en", label: "English" }
] as const;
export const DEFAULT_LOCALE = "fr" as const;
export type Locales = (typeof LOCALES)[number]["value"];

export const COMPANY_NAME = "Jobi";

export const AUTH_EMAIL_EXPIRATION_MINUTES = 2;
export const BASE_LOCAL_API_URL = "http://localhost:1981";
export const BASE_LOCAL_FRONTEND_URL = "http://localhost:3000";

export const MINIMUM_PASSWORD_LENGTH = 8;
export const MAXIMUM_PASSWORD_LENGTH = 128;
export const OTP_LENGTH = 6;

export const SESSION_EXPIRATION_DAYS = 7;

export const AUTH_EMAIL_SENDER_NAME = "Jobi";
export const AUTH_EMAIL_SENDER_EMAIL = `jobi.noreply@gmail.com`;

export const COMPANY_DOMAIN = "jobi.io";

export const isDevelopment =
	process.env.NODE_ENV === "development" ||
	process.env.EXPO_PUBLIC_NODE_ENV === "development" ||
	process.env.NEXT_PUBLIC_NODE_ENV === "development";


export const STATUS = [
  { value: "tous", label: "Tous les statuts" },
  { value: "candidature_envoyee", label: "Candidature envoyée" },
  { value: "en_attente_reponse", label: "En attente de réponse" },
  { value: "entretien_programme", label: "Entretien programmé" },
  { value: "entretien_passe", label: "Entretien passé" },
  { value: "refus", label: "Refusé" },
  { value: "accepte", label: "Accepté" },
  { value: "relance_necessaire", label: "Relance nécessaire" },
] as const;

export const PRIORITES = [
  { value: "toutes", label: "Toutes les priorités" },
  { value: "faible", label: "Faible" },
  { value: "moyenne", label: "Moyenne" },
  { value: "haute", label: "Haute" },
] as const;
