import { AUTH_EMAIL_EXPIRATION_MINUTES, COMPANY_NAME, type Locales } from "@jobi/constants";

export const authEmailsMessages: Record<
	Locales,
	{
		"email-verification": {
			htmlBody: (otp: string) => string;
			subject: (otp: string) => string;
		};
		"sign-in": {
			htmlBody: (otp: string) => string;
			subject: (otp: string) => string;
		};
		"forget-password": {
			htmlBody: (otp: string) => string;
			subject: (otp: string) => string;
		};
		"data-export": {
			htmlBody: (otp: string) => string;
			subject: (otp: string) => string;
		};
		"delete-account": {
			htmlBody: (otp: string) => string;
			subject: (otp: string) => string;
		};
	}
> = {
	fr: {
		"email-verification": {
			htmlBody: (otp) => `
			<p>Bienvenue sur ${COMPANY_NAME} !</p>
			<p>Code de vérification pour s'inscrire : <strong>${otp}</strong></p>
			<p>Ce code expirera dans ${AUTH_EMAIL_EXPIRATION_MINUTES} minutes. Ce mail peut être ignoré si vous n'en n'êtes pas à l'origine.</p>
			<p>À bientôt 👋</p>
			<p>L'équipe ${COMPANY_NAME}</p>
		`,
			subject: (otp) => `${otp} - Code de vérification d'email - ${COMPANY_NAME} 🩺`,
		},
		"sign-in": {
			htmlBody: (otp) => `
			<p>Code de vérification pour se connecter : <strong>${otp}</strong></p>
			<p>Ce code expirera dans ${AUTH_EMAIL_EXPIRATION_MINUTES} minutes. Ce mail peut être ignoré si vous n'en n'êtes pas à l'origine.</p>
			<p>À bientôt 👋</p>
			<p>L'équipe ${COMPANY_NAME}</p>
		`,
			subject: (otp) => `${otp} - Code de connexion - ${COMPANY_NAME} 🔐`,
		},
		"forget-password": {
			htmlBody: (otp) => `
			<p>Une demande de réinitialisation de mot de passe a été faite sur ${COMPANY_NAME}.</p>
			<p>Code de vérification : <strong>${otp}</strong></p>
			<p>Ce code expirera dans ${AUTH_EMAIL_EXPIRATION_MINUTES} minutes. Ce mail peut être ignoré si vous n'en n'êtes pas à l'origine.</p>
			<p>À bientôt 👋</p>
			<p>L'équipe ${COMPANY_NAME}</p>
		`,
			subject: (otp) => `${otp} - Code de réinitialisation de mot de passe - ${COMPANY_NAME} 🔑`,
		},
		"data-export": {
			htmlBody: (otp) => `
						<p>Code de vérification pour exporter vos données : <strong>${otp}</strong></p>
						<p>Ce code expirera dans ${AUTH_EMAIL_EXPIRATION_MINUTES} minutes. Ce mail peut être ignoré si vous n'en n'êtes pas à l'origine.</p>
						<p>À bientôt 👋</p>
						<p>L'équipe ${COMPANY_NAME}</p>
				`,
			subject: (otp) => `${otp} - Code de validation pour export de données - ${COMPANY_NAME}`,
		},
		"delete-account": {
			htmlBody: (otp) => `
						<p>Code de vérification de suppression de compte : <strong>${otp}</strong></p>
						<p>Ce code expirera dans ${AUTH_EMAIL_EXPIRATION_MINUTES} minutes. Ce mail peut être ignoré si vous n'en n'êtes pas à l'origine.</p>
						<p>À bientôt 👋</p>
						<p>L'équipe ${COMPANY_NAME}</p>
				`,
			subject: (otp) => `${otp} - Code de validation pour suppression de compte - ${COMPANY_NAME} 🗑️`,
		},
	},
	en: {
		"email-verification": {
			htmlBody: (otp) => `
			<p>Welcome to ${COMPANY_NAME}!</p>
			<p>Verification code to sign up: <strong>${otp}</strong></p>
			<p>This code will expire in ${AUTH_EMAIL_EXPIRATION_MINUTES} minutes. You can ignore this email if you did not request it.</p>
			<p>See you soon 👋</p>
			<p>The ${COMPANY_NAME} Team</p>
		`,
			subject: (otp) => `${otp} - Email verification code - ${COMPANY_NAME} 🩺`,
		},
		"sign-in": {
			htmlBody: (otp) => `
			<p>Verification code to sign in: <strong>${otp}</strong></p>
			<p>This code will expire in ${AUTH_EMAIL_EXPIRATION_MINUTES} minutes. You can ignore this email if you did not request it.</p>
			<p>See you soon 👋</p>
			<p>The ${COMPANY_NAME} Team</p>
		`,
			subject: (otp) => `${otp} - Sign-in code - ${COMPANY_NAME} 🔐`,
		},
		"forget-password": {
			htmlBody: (otp) => `
			<p>A password reset request was made on ${COMPANY_NAME}.</p>
			<p>Verification code: <strong>${otp}</strong></p>
			<p>This code will expire in ${AUTH_EMAIL_EXPIRATION_MINUTES} minutes. You can ignore this email if you did not request it.</p>
			<p>See you soon 👋</p>
			<p>The ${COMPANY_NAME} Team</p>
		`,
			subject: (otp) => `${otp} - Password reset code - ${COMPANY_NAME} 🔑`,
		},
		"data-export": {
			htmlBody: (otp) => `
						<p>Verification code to export your data: <strong>${otp}</strong></p>
						<p>This code will expire in ${AUTH_EMAIL_EXPIRATION_MINUTES} minutes. You can ignore this email if you did not request it.</p>
						<p>See you soon 👋</p>
						<p>The ${COMPANY_NAME} Team</p>
				`,
			subject: (otp) => `${otp} - Data export verification code - ${COMPANY_NAME}`,
		},
		"delete-account": {
			htmlBody: (otp) => `
						<p>Verification code to delete your account: <strong>${otp}</strong></p>
						<p>This code will expire in ${AUTH_EMAIL_EXPIRATION_MINUTES} minutes. You can ignore this email if you did not request it.</p>
						<p>See you soon 👋</p>
						<p>The ${COMPANY_NAME} Team</p>
				`,
			subject: (otp) => `${otp} - Account deletion verification code - ${COMPANY_NAME} 🗑️`,
		},
	},
};
