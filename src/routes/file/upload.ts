import { defineRoute } from "@daloyjs/core";
import z from "zod";
import { UFile } from "$/models.ts";
import { nanoid } from "nanoid";
import { uploadFile } from "$/util/upload.ts";
import { fileField, multipartObject } from "@daloyjs/core/multipart";
import useAuth from "$/util/auth.ts";

export default defineRoute({
  path: "/file",
  method: "POST",
  operationId: "uploadFile",
  description: "Upload a file",
  hooks: useAuth(),
  request: {
    body: multipartObject({
      file: fileField({
        maxBytes: 1_000_000,
        accept: ["*/*"],
      }),
    }),
  },
  responses: {
    200: {
      description: "Upload a file",
      body: z.object({
        id: z.string().meta({
          description: "uploaded file id",
        }),
      }),
    },
  },
  handler: async ({
    body: { file },
    state: { db, user },
  }) => {
    const id = nanoid();
    const name = await uploadFile(id, file);
    const fileId = await db.insertOne(UFile, {
      id,
      filename: file.name!,
      size: file.size,
      ownerId: user!.id,
    });
    return {
      status: 200,
      body: { id: fileId!, url: `https://example.com/file/${name}` },
    };
  },
});
