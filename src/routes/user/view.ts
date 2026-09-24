import { z } from "zod";
import useAuth from "$/util/auth.ts";
import { defineRoute } from "@daloyjs/core";

export default defineRoute({
  path: "/user",
  method: "GET",
  operationId: "viewUser",
  description: "View user information via a valid jwt token",
  hooks: useAuth(),
  auth: { scheme: "bearerAuth" },
  responses: {
    200: {
      description: "User view",
      body: z.object({
        id: z.string(),
        name: z.string(),
        email: z.email(),
      }),
    },
  },
  handler: ({
    state: { user },
  }) => ({
    status: 200,
    body: {
      id: user!.id,
      name: user!.name,
      email: user!.email,
    },
  }),
});
