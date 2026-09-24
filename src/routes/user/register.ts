import { z } from "zod";
import { User } from "$/models.ts";
import { passwordHash } from "@daloyjs/core/hashing";
import { ConflictError, defineRoute } from "@daloyjs/core";
import { v7 } from "uuid";

export default defineRoute({
  path: "/user",
  method: "POST",
  operationId: "registerUser",
  description: "Register a new user",
  request: {
    body: z.object({
      email: z.email(),
      name: z.string().min(3).max(20),
      password: z.string().min(8).max(35).regex(/[a-z]/).regex(/[A-Z]/).regex(
        /[0-9]/,
      ),
    }),
  },
  responses: {
    201: {
      description: "Successful registeration",
      body: z.object({
        id: z.uuid(),
      }),
    },
  },
  handler: async ({
    state: { db },
    body: { name, email, password },
  }) => {
    if (await db.exists(User, { $where: { email } })) {
      throw new ConflictError("email already in use.");
    }
    const userId = await db.insertOne(User, {
      name,
      email,
      id: v7(),
      passwordHash: await passwordHash(password),
    });
    return {
      status: 201,
      body: {
        id: userId!,
      },
    };
  },
});
