export function isInObject<T extends object>(obj: T, key: string | number | symbol): key is keyof T {
	return key in obj;
}

export function objectKeys<T extends object>(obj: T): (keyof T)[] {
	return Object.keys(obj) as (keyof T)[];
}

export function objectEntries<T extends object>(obj: T): [keyof T, T[keyof T]][] {
	return Object.entries(obj) as [keyof T, T[keyof T]][];
}

// biome-ignore lint/suspicious/noExplicitAny: allow any for generic utility
export function stripUndefined<T extends Record<string, any>>(
	obj: T,
): { [K in keyof T as T[K] extends undefined ? never : K]: T[K] } {
	// biome-ignore lint/suspicious/noExplicitAny: allow any for generic utility
	return Object.fromEntries(Object.entries(obj).filter(([, value]) => value !== undefined)) as any;
}

export function isNotNull<T>(value: T | null): value is T {
	return value !== null;
}

export const isNotNullObject = (value: unknown): value is Record<string, unknown> => {
	return typeof value === "object" && value !== null;
};
