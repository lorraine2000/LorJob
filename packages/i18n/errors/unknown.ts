import type { Locales } from "@jobi/constants";

export const unknownErrorMessages: Record<
	Locales,
	{ unknownError: string; unknownAuthError: string; unexpectedError: (message: string) => string }
> = {
	fr: {
		unknownError: "Erreur inconnue. Contacte le support si l'erreur persiste.",
		unknownAuthError: "Erreur inattendue. Vérifie que tu es bien connecté à internet.",
		unexpectedError: (message) => `Erreur inattendue: ${message}. Contacte le support en précisant ce code d'erreur si le problème persiste.`,
	},
	en: {
		unknownError: "Unknown error. Please contact support if the issue persists.",
		unknownAuthError: "Unexpected error. Please check your internet connection.",
		unexpectedError: (message) => `Unexpected error: ${message}. Please contact support and include this error code if the issue continues.`,
	},
};
