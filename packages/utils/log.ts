type LogLevel = "info" | "warn" | "error";
export function log(type: LogLevel, scope: string, ...data: unknown[]) {
	if (process.env.NODE_ENV === "development") {
		const prefix = `[${scope}]`;
		console[type](prefix, ...data);
		return;
	}
}
