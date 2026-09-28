import {
  MAXIMUM_PASSWORD_LENGTH,
  MINIMUM_PASSWORD_LENGTH,
  type Locales,
} from "@jobi/constants";
import type { APIAuthError } from "@jobi/enums/errors/api-errors";

export const apiAuthErrorMessages: Record<Locales, Record<APIAuthError, string>> = {
  fr: {
    UNAUTHORIZED: "Tu es déconnecté. Connecte-toi pour continuer",
    FORBIDDEN: "Tu n'as pas la permission d'accéder à cette ressource",
    EMAIL_FORMAT_INVALID: "L'email saisie est invalide",
    PASSWORD_TOO_SHORT: `Ton mot de passe doit contenir au moins ${MINIMUM_PASSWORD_LENGTH} caractères`,
    PASSWORD_TOO_LONG: `Ton mot de passe doit contenir moins de ${MAXIMUM_PASSWORD_LENGTH} caractères`,
    PASSWORD_SHOULD_CONTAIN_LOWERCASE: "Ton mot de passe doit contenir au moins une lettre minuscule",
    PASSWORD_SHOULD_CONTAIN_UPPERCASE: "Ton mot de passe doit contenir au moins une lettre majuscule",
    PASSWORD_SHOULD_CONTAIN_NUMBER: "Ton mot de passe doit contenir au moins un chiffre",
    PASSWORD_SHOULD_CONTAIN_SPECIAL_CHARACTER: "Ton mot de passe doit contenir au moins un caractère spécial",
    DELETE_ACCOUNT_FAILED: "La suppression de ton compte a échoué. Réessaie plus tard.",
  },
  en: {
    UNAUTHORIZED: "You are disconnected. Please log in to continue",
    FORBIDDEN: "You do not have permission to access this resource",
    EMAIL_FORMAT_INVALID: "The email entered is invalid",
    PASSWORD_TOO_SHORT: `Your password must be at least ${MINIMUM_PASSWORD_LENGTH} characters`,
    PASSWORD_TOO_LONG: `Your password must be fewer than ${MAXIMUM_PASSWORD_LENGTH} characters`,
    PASSWORD_SHOULD_CONTAIN_LOWERCASE: "Your password must contain at least one lowercase letter",
    PASSWORD_SHOULD_CONTAIN_UPPERCASE: "Your password must contain at least one uppercase letter",
    PASSWORD_SHOULD_CONTAIN_NUMBER: "Your password must contain at least one number",
    PASSWORD_SHOULD_CONTAIN_SPECIAL_CHARACTER: "Your password must contain at least one special character",
    DELETE_ACCOUNT_FAILED: "Account deletion failed. Please try again later.",
  },
};
