import { UploadedFile } from "@daloyjs/core";
import { Upload } from "@aws-sdk/lib-storage";
import { S3Client } from "@aws-sdk/client-s3";

/* clouflare account id for r2 storage */
const accountId = Deno.env.get("CF_R2_ID")!;
const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: Deno.env.get("S3_ACCESS_KEY")!,
    secretAccessKey: Deno.env.get("S3_SECRET_KEY")!,
  },
});

export const uploadFile = async (
  id: string,
  file: UploadedFile,
): Promise<string> => {
  const name = `${id}-${file.name}`;
  const upload = new Upload({
    client: s3,
    params: {
      Key: name,
      Body: file.stream(),
      Bucket: Deno.env.get("R2_BUCKET")!,
      ContentType: file.type,
    },
  });
  await upload.done();
  return name;
};
