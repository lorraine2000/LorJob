import type { Context, MiddlewareHandler, Next } from "hono";

import { log } from "@jobi/utils/log";

// Define interfaces for the log objects
type RequestLog = {
	timestamp: string;
	type: "REQUEST";
	path: string;
	method: string;
	query: Record<string, string | string[]>;
	headers: Record<string, string>;
	body?: string;
	ip: string;
};

type ResponseLog = {
	timestamp: string;
	type: "RESPONSE";
	path: string;
	method: string;
	status: number;
	responseTime: number;
	contentType?: string;
};

// Extend Context to include our custom properties
declare module "hono" {
	type ContextVariables = {
		executionStart: number;
	};
}

// Create middleware for request logging
export const requestLogger: MiddlewareHandler = async (ctx: Context, next: Next): Promise<void> => {
	try {
		// Clone the request to avoid consuming the original
		const clonedReq = ctx.req.raw.clone();

		// Get request body if available
		let requestBody: string | undefined;
		if (["POST", "PUT", "PATCH"].includes(ctx.req.method)) {
			try {
				requestBody = await clonedReq.text();
				if (requestBody && requestBody.length > 1000) {
					// Truncate large bodies to avoid flooding logs
					requestBody = `${requestBody.slice(0, 1000)}... (truncated)`;
				}
			} catch (_e) {
				requestBody = "(could not parse body)";
			}
		}

		const requestLog: RequestLog = {
			timestamp: new Date().toISOString(),
			type: "REQUEST",
			path: ctx.req.path,
			method: ctx.req.method,
			query: ctx.req.query(),
			headers: Object.fromEntries(ctx.req.raw.headers.entries()),
			body: requestBody,
			ip:
				ctx.req.header("x-forwarded-for") ??
				(ctx.env && "remoteAddress" in ctx.env ? String(ctx.env.remoteAddress) : "unknown"),
		};

		log("info", "RequestLogger", requestLog);
	} catch (error) {
		log("error", "RequestLogger", error);
	}

	await next();
};

// Create middleware for response logging
export const responseLogger: MiddlewareHandler = async (ctx: Context, next: Next): Promise<void> => {
	// Set execution start time
	ctx.set("executionStart", Date.now());

	const originalJsonMethod = ctx.json;
	let responseBody: unknown;

	// Override the json method to capture the response body
	ctx.json = function (data: unknown, status?: unknown, headers?: Record<string, string | string[]>) {
		responseBody = data;
		// @ts-expect-error - infinite recursion
		return originalJsonMethod.call(this, data, status, headers);
	};

	// Process the request
	await next();

	try {
		const contentType = ctx.res.headers.get("content-type");

		const responseLog: ResponseLog = {
			timestamp: new Date().toISOString(),
			type: "RESPONSE",
			path: ctx.req.path,
			method: ctx.req.method,
			status: ctx.res.status,
			responseTime: Date.now() - ctx.get("executionStart"),
			contentType: ctx.res.headers.get("content-type") ?? undefined,
		};

		if (contentType?.includes("application/json") && responseBody !== undefined) {
			// @ts-expect-error - responseBody is defined
			responseLog.body = responseBody;
		}

		log("info", "ResponseLogger", responseLog);
	} catch (error) {
		log("error", "ResponseLogger", error);
	}
};

// Create logger factory with options
type LoggerOptions = {
	logRequestBody?: boolean;
	logHeaders?: boolean;
	maskSensitiveHeaders?: string[];
};

export const createLogger = (options: LoggerOptions = {}) => {
	const requestLoggerWithOptions: MiddlewareHandler = async (ctx: Context, next: Next): Promise<void> => {
		try {
			// Clone the request to avoid consuming the original
			const clonedReq = ctx.req.raw.clone();

			// Get request body if available and enabled
			let requestBody: string | undefined;
			if (options.logRequestBody && ["POST", "PUT", "PATCH"].includes(ctx.req.method)) {
				try {
					requestBody = await clonedReq.text();
				} catch (_e) {
					requestBody = "(could not parse body)";
				}
			}

			// Process headers
			let headers: Record<string, string> = {};
			if (options.logHeaders) {
				headers = Object.fromEntries(ctx.req.raw.headers.entries());

				// Mask sensitive headers if needed
				if (options.maskSensitiveHeaders && options.maskSensitiveHeaders.length > 0) {
					for (const sensitiveHeader of options.maskSensitiveHeaders) {
						if (headers[sensitiveHeader.toLowerCase()]) {
							headers[sensitiveHeader.toLowerCase()] = "******";
						}
					}
				}
			}

			const requestLog: RequestLog = {
				timestamp: new Date().toISOString(),
				type: "REQUEST",
				path: ctx.req.path,
				method: ctx.req.method,
				query: ctx.req.query(),
				headers: headers,
				body: requestBody,
				ip:
					ctx.req.header("x-forwarded-for") ??
					(ctx.env && "remoteAddress" in ctx.env ? String(ctx.env.remoteAddress) : "unknown"),
			};

			log("info", "RequestLogger", requestLog);
		} catch (error) {
			log("error", "RequestLogger", error);
		}

		await next();
	};

	return { requestLogger: requestLoggerWithOptions, responseLogger };
};
