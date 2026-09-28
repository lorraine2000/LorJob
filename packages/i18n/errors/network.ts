import type { Locales } from "@jobi/constants";

export const networkErrorMessages: Record<Locales, { networkError: string; serverDown: string }> = {
	fr: {
		networkError: "Impossible de se connecter au serveur. Vérifie ta connexion internet et réessaie.",
		serverDown: "Le serveur est actuellement indisponible. Veuillez réessayer plus tard.",
	},
	en: {
		networkError: "Unable to connect to the server. Check your internet connection and try again.",
		serverDown: "The server is currently unavailable. Please try again later.",
	},
};
