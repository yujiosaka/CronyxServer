import { basicAuth } from "@eelkevdbos/elysia-basic-auth";
import type { BaseJobStore } from "cronyx";
import { MongodbJobStore, MysqlJobStore, PostgresJobStore, RedisJobStore } from "cronyx";
import Elysia from "elysia";
import cronyx from "elysia-cronyx";
import type { MongoClientOptions } from "mongodb";
import type { Types } from "mongoose";
import type { RedisClientOptions } from "redis";
import { AuroraMysqlConnectionOptions } from "typeorm/driver/aurora-mysql/AuroraMysqlConnectionOptions.js";
import { AuroraPostgresConnectionOptions } from "typeorm/driver/aurora-postgres/AuroraPostgresConnectionOptions.js";
import type { MysqlConnectionOptions } from "typeorm/driver/mysql/MysqlConnectionOptions.js";
import type { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions.js";
import { HealthcheckResponseDTO } from "./dto";
import { CronyxServerError } from "./error";
import Source from "./source";
import { log, parseOptions, parseSource } from "./util";

const app = new Elysia({ name: "cronyx-server" })
  .onAfterHandle(({ request }) => {
    log(`${request.method} ${new URL(request.url).pathname}`);
  })
  .onError(({ request, error }) => {
    log(`${request.method} ${new URL(request.url).pathname} Error ${error.message}`);
  })
  .use((app) => {
    if (!Bun.env.BASIC_AUTH_USERNAME || !Bun.env.BASIC_AUTH_PASSWORD) return app;

    return app.use(
      basicAuth({
        credentials: [{ username: Bun.env.BASIC_AUTH_USERNAME, password: Bun.env.BASIC_AUTH_PASSWORD }],
        realm: "CronyxServer",
      }),
    );
  })
  .use(async () => {
    const source = parseSource(Bun.env.JOB_STORE_SOURCE);
    const url = Bun.env.JOB_STORE_URL;
    const options = parseOptions(Bun.env.JOB_STORE_OPTIONS);
    const timezone = Bun.env.TIMEZONE;

    let jobStore: BaseJobStore<Types.ObjectId | string>;
    switch (source) {
      case Source.MongoDB:
        if (!url) throw new CronyxServerError("URL is required for MongoDB");
        jobStore = await MongodbJobStore.connect(url!, options as MongoClientOptions | undefined);
        break;
      case Source.Redis:
        if (!url && !options) throw new CronyxServerError("Either URL or options is required for Redis");
        jobStore = await RedisJobStore.connect((options || { url }) as RedisClientOptions);
        break;
      case Source.MySQL:
        if (!url && !options) throw new CronyxServerError("Either URL or options is required for MySQL");
        jobStore = await MysqlJobStore.connect((options || { url, type: "mysql" }) as MysqlConnectionOptions);
        break;
      case Source.AuroraMySQL:
        if (!url && !options) throw new CronyxServerError("Either URL or options is required for Aurora MySQL");
        jobStore = await MysqlJobStore.connect((options || { url, type: "aurora-mysql" }) as AuroraMysqlConnectionOptions);
        break;
      case Source.Postgres:
        if (!url && !options) throw new CronyxServerError("Either URL or options is required for Postgres");
        jobStore = await PostgresJobStore.connect((options || { url, type: "postgres" }) as PostgresConnectionOptions);
        break;
      case Source.AuroraPostgres:
        if (!url && !options) throw new CronyxServerError("Either URL or options is required for Aurora Postgres");
        jobStore = await PostgresJobStore.connect(
          (options || { url, type: "aurora-postgres" }) as AuroraPostgresConnectionOptions,
        );
        break;
    }

    return cronyx({ jobStore, timezone });
  })
  .get("/healthcheck", () => ({ ok: true }), { response: HealthcheckResponseDTO })
  .listen(Bun.env.SERVER_PORT || 3000);

log(`CronyxServer is running at ${app.server?.hostname}:${app.server?.port}`);
