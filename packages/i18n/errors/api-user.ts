import type { Locales } from "@jobi/constants";
import type { APIUserError } from "@jobi/enums/errors/api-errors";

export const apiUserErrorMessages: Record<Locales, Record<APIUserError, string>> = {
	fr: {
		INVALID_OTP: "Code de vérification invalide",
		USER_ALREADY_ONBOARDED: "Onboarding déjà effectué",
		USER_WITH_EMAIL_ALREADY_EXISTS: "Cette adresse email est déjà utilisée",
		USER_NOT_FOUND: "Utilisateur introuvable",
		MISSING_USER_DATA: "Données utilisateur manquantes",
		CAN_ONLY_DELETE_SELF: "Un utilisateur ne peut que supprimer son propre compte",
		CANNOT_DELETE_CURRENT_SESSION: "Impossible de supprimer la session actuelle",
		UPDATE_FAILED: "La mise à jour du profil a échoué",
		IMAGE_UPLOAD_FAILED: "Le téléchargement de l'image a échoué",
		IMAGE_TOO_LARGE: "L'image est trop volumineuse",
		IMAGE_FORMAT_NOT_SUPPORTED: "Format d'image non pris en charge",
	},
	en: {
		INVALID_OTP: "Invalid verification code",
		USER_ALREADY_ONBOARDED: "User has already completed onboarding",
		USER_WITH_EMAIL_ALREADY_EXISTS: "This email address is already in use",
		USER_NOT_FOUND: "User not found",
		MISSING_USER_DATA: "Missing user data",
		CAN_ONLY_DELETE_SELF: "A user can only delete their own account",
		CANNOT_DELETE_CURRENT_SESSION: "Cannot delete the current session",
		UPDATE_FAILED: "Failed to update the profile",
		IMAGE_UPLOAD_FAILED: "Image upload failed",
		IMAGE_TOO_LARGE: "The image is too large",
		IMAGE_FORMAT_NOT_SUPPORTED: "Image format not supported",
	},
};
