import { emailOTPClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { honoBaseUrl } from "../config";

export const authClient = createAuthClient({
	baseURL: honoBaseUrl,
	plugins: [emailOTPClient()],
});
