import { User } from "$/models.ts";
import { type PreBodyContext, UnauthorizedError } from "@daloyjs/core";

export default function useAuth() {
  return {
    preBody: async ({
      state,
      request,
      state: { db, jwt },
    }: PreBodyContext) => {
      const header = request.headers.get("authorization") ?? "";
      const [scheme, token] = header.split(" ");
      if (scheme?.toLowerCase() !== "bearer" || !token) {
        throw new UnauthorizedError("Missing bearer token");
      }
      try {
        const { payload } = await jwt.verify(token);
        state.user = await db.findOneById(User, payload["id"]!, {
          $select: {
            id: true,
            name: true,
            email: true,
          },
        });
        if (!state.user) throw new UnauthorizedError("unauthenticated");
      } catch {
        throw new UnauthorizedError("invalid or expired token");
      }
    },
  };
}
