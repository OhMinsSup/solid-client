import { createPagesFunctionHandler } from "@remix-run/cloudflare-pages";
import * as build from "@remix-run/dev/server-build";
import { AuthService } from "./services/auth";
import { EnvSchema } from "./services/env";
import { AuthApiService } from "./services/api/auth";
import { UserApiService } from "./services/api/user";
import { ItemApiService } from "./services/api/item";
import { WidgetApiService } from "./services/api/widget";
import { TagApiService } from "./services/api/tag";

const handleRequest = createPagesFunctionHandler({
  build,
  mode: process.env.NODE_ENV,
  getLoadContext: (context) => {
    const env = EnvSchema.parse(context.env);
    return {
      ...context.env,
      services: {
        auth: new AuthService(context.env.auth, env),
      },
      api: {
        auth: new AuthApiService(env),
        user: new UserApiService(env),
        item: new ItemApiService(env),
        widget: new WidgetApiService(env),
        tag: new TagApiService(env),
      },
    };
  },
});

export function onRequest(context) {
  return handleRequest(context);
}
