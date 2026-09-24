import app from "$/app.ts";
import { serve } from "@daloyjs/core/deno";

const ac = new AbortController();

serve(app, {
  signal: ac.signal,
});

Deno.addSignalListener("SIGINT", () => ac.abort());
Deno.addSignalListener("SIGTERM", () => ac.abort());
