import client from "../client.ts";
import mock from "../mock.json" with { type: "json" };
import { assertExists, assertEquals, assertNotEquals } from "@std/assert";

const { user } = mock;

Deno.test("Create user", async() => {
  const res = await client.registerUser({
    body: {
      name: user.name,
      email: user.email,
      password: user.password
    }
  });
  assertEquals(res.status, 201);
  assertExists(res.body.id);
  //store the id in localStorage for later usage
  localStorage["userId"] = res.body.id;
});

Deno.test("Create a user with invalid credentials", async() => {
  const res = await client.registerUser({
    body: {
      name: "V",
      email: "vixivixi",
      password: "10v7b",
    }
  });
  assertEquals(res.status, 422);
});

Deno.test("Create a user with email voxi78@voxi.net - supposedly already registered", async () => {
  const res = await client.registerUser({
    body: {
      name: user.name,
      email: user.email,
      password: user.password
    }
  });
  assertEquals(res.status, 409);
});
