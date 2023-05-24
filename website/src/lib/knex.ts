import Knex from "knex";

type Dict = { [key: string]: any };

export const knex = Knex({
  client: "mysql",
  connection: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT ?? "3306"),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
});

export const knexToObject = <T extends Dict>(item: T | undefined): T | undefined => (item ? { ...item } : undefined);

export const knexToObjects = <T extends Dict>(rows: T[]): T[] => rows.map((item) => ({ ...item }));
