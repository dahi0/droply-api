import client from "../client.ts";
import mock from "../mock.json" with { type: "json" };
import { assertExists, assertEquals, assertNotEquals } from "@std/assert";

const { user } = mock;

Deno.test("Sign a user", async() => {
  const res = await client.signUser({
    body: {
      email: user.email,
      password: user.password,
    }
  });
  assertEquals(res.status, 200);
  assertExists(res.body.token);
  //store token for later usage.
  localStorage["token"] = res.body.token;
});

Deno.test("Sign a user with invalid data", async() => {
  const res = await client.signUser({
    body: {
      email: "vix18",
      password: "vxxx1"
    }
  });
  assertEquals(res.status, 422);
});

Deno.test("Sign a user with invalid email", async() => {
  const res = await client.signUser({
    body: {
      email: "vixo9@gmail.com",
      password: "Vixinix89"
    }
  });
  assertEquals(res.status, 401);
});

Deno.test("Sign a user with invalid password", async() => {
  const res = await client.signUser({
    body: {
      email: user.email,
      password: "Voxi1237",
    }
  });
  assertEquals(res.status, 200);
});

