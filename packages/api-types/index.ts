import type { App } from "@jobi/api";
import type { ClientResponse, hc } from "hono/client";
import type { Context as HonoContext } from 'hono';

export type HonoApp = App;
export type HonoClient = ReturnType<typeof hc<App>>;

// biome-ignore lint/suspicious/noExplicitAny: generic type
type HonoRequest = (...args: any[]) => Promise<ClientResponse<any, any>>;

export type GetJsonResponse<T extends HonoRequest> = Awaited<ReturnType<Awaited<ReturnType<T>>["json"]>>;

export type ExtractSuccess<T> = T extends { message: string } ? never : T;
export type GetSuccessfulJsonResponse<T extends HonoRequest> = ExtractSuccess<GetJsonResponse<T>>;

export type UserData = GetSuccessfulJsonResponse<HonoClient["api"]["user"]["$get"]>;
export type PlatformUserData = GetSuccessfulJsonResponse<HonoClient["api"]["user"]["platform"]["session"]["$get"]>;

export type Context = HonoContext & {
  userId?: string;
};
