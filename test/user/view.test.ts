import mock from "../mock.json" with { type: "json" };
import client from "../client.ts";
import { assertEquals } from "@std/assert";

const { user } = mock;

const token = localStorage["token"] || Deno.args[0];

Deno.test("View user", async() => {
  const res = await client.viewUser({
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  assertEquals(res.status, 200);
  assertEquals(res.body.name, user.name);
});

Deno.test("View user with no header", async() => {
  const res = await client.viewUser({});
  assertEquals(res.status, 401);
});
