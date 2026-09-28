import type { MiddlewareHandler } from "hono";

import { APIContentfulStatusCode } from "@jobi/enums/api";
import { APIAuthError } from "@jobi/enums/errors/api-errors";
import { auth } from "@jobi/utils/auth";

export const authMiddleware: MiddlewareHandler = async (ctx, next) => {
  const session = await auth.api.getSession({ headers: ctx.req.raw.headers });

  if (!session) {
    return ctx.json(
      { message: APIAuthError.UNAUTHORIZED },
      APIContentfulStatusCode.UNAUTHORIZED
    );
  }

  ctx.set("result", session.user.id);

  await next();
}
