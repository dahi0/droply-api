import type { Config } from "uql-orm";
import { NodeSqliteQuerierPool } from "uql-orm/sqlite";
import { UFile, User } from "$/models.ts";

const pool = new NodeSqliteQuerierPool("app.db");

export { pool };
export default {
  pool,
  entities: [User, UFile],
} satisfies Config;
