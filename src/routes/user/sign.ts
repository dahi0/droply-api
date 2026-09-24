import { z } from "zod";
import { User } from "$/models.ts";
import { passwordVerify } from "@daloyjs/core/hashing";
import { defineRoute, UnauthorizedError } from "@daloyjs/core";

export default defineRoute({
  method: "POST",
  path: "/user/sign",
  operationId: "signUser",
  description: "Sign a valid jwt token for a user",
  request: {
    body: z.object({
      email: z.email(),
      password: z.string().min(8).max(35).regex(/[a-z]/).regex(/[A-Z]/).regex(
        /[0-9]/,
      ),
    }),
  },
  responses: {
    200: {
      description: "Signed successfully",
      body: z.object({
        token: z.string().meta({
          description: "a signed jwt token",
        }),
      }),
    },
  },
  handler: async ({
    state: { db, jwt },
    body: { email, password },
  }) => {
    const user = await db.findOne(User, {
      $where: { email },
    });
    if (!user || !passwordVerify(password, user.passwordHash!)) {
      throw new UnauthorizedError("invalid credentials");
    }
    const token = await jwt.sign({
      id: user.id!,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 3,
    });
    return { status: 200, body: { token } };
  },
});
