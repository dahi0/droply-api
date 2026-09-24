import client from "#/test/client.ts";
import mock from "../mock.json" with { type: "json" };
import { assertEquals, assertExists } from "@std/assert";

const { user } = mock;
const token = localStorage["token"] || Deno.args[0];

Deno.test("Upload file", async () => {
  const res = await client.uploadFile({
    body: {
      file: new File(
        ["Hello, world!"],
        "file.txt",
        { type: "text/plain" },
      ),
    },
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
  assertEquals(res.status, 200);
  assertExists(res.body.id);
});

Deno.test("Upload file unauthenticated", async () => {
  const res = await client.uploadFile({
    body: {
      file: new File(
        ["Hello, world!"],
        "file.txt",
        { type: "text/plain" },
      ),
    },
  });
  assertEquals(res.status, 401);
  assertExists(res.body.id);
});
