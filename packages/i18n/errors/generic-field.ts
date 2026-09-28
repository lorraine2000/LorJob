import type { Locales } from "@jobi/constants";
import { capitalize } from "@jobi/utils/string";

export const genericFieldErrorMessages: Record<
	Locales,
	{
		fieldShouldBeAString: (fieldName: string) => string;
	}
> = {
	fr: {
		fieldShouldBeAString: (fieldName) => `${capitalize(fieldName)} doit être une chaîne de caractères.`,
	},
	en: {
		fieldShouldBeAString: (fieldName) => `${capitalize(fieldName)} must be a string.`,
	},
};
