import type { Locales } from "@jobi/constants";
import { APIAuthError } from "@jobi/enums/errors/api-errors";
import { useLocaleStore } from "@jobi/hooks/store/settings-store";
import { apiAuthErrorMessages } from "@jobi/i18n/errors/api-auth";
import { betterAuthErrorMessages } from "@jobi/i18n/errors/better-auth";
import { networkErrorMessages } from "@jobi/i18n/errors/network";
import { unknownErrorMessages } from "@jobi/i18n/errors/unknown";
import { log } from "@jobi/utils/log";
import { isInObject } from "./object";


export class ExpectedError extends Error {
    email: any;
}

// Handle errors with expected messages
type Messages = Record<Locales, Record<string, string>>;
export const getKnownError = (message: string, expectedErrors?: Messages | Messages[]) => {
	const locale = useLocaleStore.getState().value;

	if (message === APIAuthError.UNAUTHORIZED) return new ExpectedError(apiAuthErrorMessages[locale].UNAUTHORIZED);

	if (expectedErrors) {
		const messages = Array.isArray(expectedErrors) ? expectedErrors : [expectedErrors];
		for (const expectedMessages of messages) {
			const expected = expectedMessages[locale];
			if (message in expected && expected[message]) {
				return new ExpectedError(expected[message]);
			}
		}
	}

	return new ExpectedError(unknownErrorMessages[locale].unexpectedError(message.slice(0, 400)));
};

export type PossibleBetterAuthError = { status: number; code?: string; message?: string };
export const getBetterAuthErrorMessage = ({ status, code, message }: PossibleBetterAuthError) => {
	const locale = useLocaleStore.getState().value;

	log("warn", "BetterAuthError", { status, code, message });

	if (status === 0) return networkErrorMessages[locale].networkError;
	if (code && isInObject(betterAuthErrorMessages[locale], code)) return betterAuthErrorMessages[locale][code];

	if (message) return unknownErrorMessages[locale].unexpectedError(message);
	return unknownErrorMessages[locale].unknownError;
};

export function getErrorMessage(error: unknown) {
	if (error instanceof Error) return error.message;
	if (typeof error === "string") return error;
	if (typeof error === "object" && error !== null && "message" in error && typeof error.message === "string")
		return error.message;
	return String(error);
}

export const getAPIErrorMessage = (error: unknown, unknownErrorType: "auth" | "generic" = "generic") => {
	const locale = useLocaleStore.getState().value;
	log("warn", "APIError", error);
	if (error instanceof ExpectedError) return error.message;

	if (error && typeof error === "object" && "status" in error && error.status === 0)
		return networkErrorMessages[locale].networkError;

	if (
		(error instanceof TypeError && error.message === "Load failed") ||
		(typeof error === "string" && error === "Load failed")
	)
		return networkErrorMessages[locale].serverDown;

	if (error instanceof Error) return unknownErrorMessages[locale].unexpectedError(error.message);
	if (typeof error === "string") return unknownErrorMessages[locale].unexpectedError(error);

	if (unknownErrorType === "auth") return unknownErrorMessages[locale].unknownAuthError;
	return unknownErrorMessages[locale].unknownError;
};