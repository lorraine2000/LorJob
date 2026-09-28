import { Prisma } from "@prisma/client";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

import { APIContentfulStatusCode } from "@jobi/enums/api";
import { APIPrismaError } from "@jobi/enums/errors/api-errors";
import { requestLogger, responseLogger } from "./middlewares/logger";
import { log } from "@jobi/utils/log";
import { auth } from "@jobi/utils/auth";

import { corsConfig } from "./config/cors-config";
import { authService } from "./services/auth";
import { userService } from "./services/user";
import { jobApplicationService } from "./services/jobApplication";
import { relanceService } from "./services/relance";
import { cloudinaryService } from "./services/file";

import "./crons";

export const runtime = 'edge'
declare module 'hono' {
  interface ContextVariableMap {
    result: string
  }
}

const app = new Hono().basePath("/api")
  .use("*", requestLogger)
  .use("*", responseLogger)
  .use("/auth/*", cors(corsConfig))
  .onError((error) => {
    log("error", "Error", error.name, "\n", error.message);
    if (error instanceof HTTPException) return error.getResponse();

    if (error instanceof Prisma.PrismaClientValidationError) {
      return Response.json(
        { message: APIPrismaError.PRISMA_VALIDATION_ERROR },
        { status: APIContentfulStatusCode.BAD_REQUEST }
      );
    }

    return Response.json(
      { message: error.message },
      { status: APIContentfulStatusCode.INTERNAL_SERVER_ERROR }
    );
  })
  .get("/", () => new Response("ok"))
  .use(cors(corsConfig))
  .use(logger())
  .route("/user", userService)
  .route("/auth/", authService)
  .route("/jobApplication/", jobApplicationService)
  .route("/relance/", relanceService)
  .route("/cloudinary/", cloudinaryService)
  .on(["POST", "GET"], "/auth/*", (ctx) => auth.handler(ctx.req.raw));

const port = Number(process.env.PORT || 1981);
console.log(`🚀 Server running on port ${port} (auth updated)`);

Bun.serve({
  port,
  fetch: app.fetch,
});

setInterval(() => {}, 1000 * 60 * 60);

app.get("/health", () => new Response("ok", { status: 200 }));

process.on("SIGTERM", () => {
  console.log("🛑 Received SIGTERM, shutting down gracefully...");
  process.exit(0);
});

export type App = typeof app;
export default app;