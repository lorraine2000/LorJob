import { email } from './../../../../../node_modules/zod/src/v4/core/regexes';
import { APIContentfulStatusCode } from "@jobi/enums/api";
import type { Prisma } from "@prisma/client";
import { prisma } from "@jobi/api-utils/prisma";
import { APIUserError } from "packages/enums/errors/api-errors";

const userSelectFields = {
    id: true,
    email: true,
    firstName: true,
    lastName: true,
    emailVerified: true,
};

type UserData = Prisma.UserGetPayload<{ select: typeof userSelectFields }>;

export async function getUser(
	userId: string,
): Promise<
	| { user: UserData; error?: undefined }
	| { error: { message: string; status: APIContentfulStatusCode.NOT_FOUND }; user?: undefined }
> {
	const data = await prisma.user.findUnique({ where: { id: userId }, select: userSelectFields });
	if (!data) return { error: { message: APIUserError.USER_NOT_FOUND, status: APIContentfulStatusCode.NOT_FOUND } };
	return {
		user: { ...data },
	};
}
export const platformUserSelectFields = {
    id: true,
	email: true,
    image: true,
    preferredLocale: true,
    emailVerified: true,
	firstName: true,
	lastName: true,
	objectif_quotidien: true,
} 
type PlatformUserData = Prisma.UserGetPayload<{ select: typeof platformUserSelectFields }>;

export async function getPlatformUser(
	userId: string,
): Promise<
	| { user: PlatformUserData; error?: undefined }
	| { error: { message: string; status: APIContentfulStatusCode.NOT_FOUND }; user?: undefined }
> {
	const user = await prisma.user.findUnique({ where: { id: userId }, select: platformUserSelectFields });

	if (!user) return { error: { message: APIUserError.USER_NOT_FOUND, status: APIContentfulStatusCode.NOT_FOUND } };
	return { user };
}
