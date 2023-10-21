/**
 * @internal
 */
const Source = {
  MongoDB: "mongodb",
  Redis: "redis",
  MySQL: "mysql",
  AuroraMySQL: "aurora-mysql",
  Postgres: "postgres",
  AuroraPostgres: "aurora-postgres",
} as const;

type Source = (typeof Source)[keyof typeof Source];

export default Source;
