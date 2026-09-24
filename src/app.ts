import { z } from "zod";
import { pool } from "../uql.config.ts";
import { User } from "$/models.ts";
import {
  App,
  createJwtSigner,
  createJwtVerifier,
  type JwtVerified,
} from "@daloyjs/core";

const key = new TextEncoder().encode(
  Deno.env.get("JWT_KEY")!,
);

declare module "@daloyjs/core" {
  interface AppState {
    user?: Omit<User, "passwordHash">;
    db: typeof pool;
    jwt: {
      sign(payload: Record<string, unknown>): Promise<string>;
      verify(token: string): Promise<JwtVerified>;
    };
  }
}

export default new App({
  docs: true,
  openapi: {
    info: {
      title: "Droply API",
      version: "0.0.1",
    },
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
})
  .decorate("db", pool)
  .decorate("jwt", {
    sign: createJwtSigner({
      key,
      alg: "HS256",
      maxLifetimeSeconds: 60 * 60 * 24 * 7,
    }).sign,
    verify: createJwtVerifier({
      key,
      algorithms: ["HS256"],
      maxLifetimeSeconds: 60 * 60 * 24 * 7,
    }).verify,
  })
  .registerRoutes((await import("$/routes/user/index.ts")).default)
  .registerRoutes((await import("$/routes/file/index.ts")).default);
