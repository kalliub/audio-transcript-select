import { PrismaClient } from "@prisma/client";
import { singleton } from "../utils/singleton.server";

export class ApiConfig {
  private dbName = "app";

  protected prisma = singleton("prisma", () => {
    if (process.env.USE_TEST_DB === "true") {
      this.dbName = "test";
    }
    return new PrismaClient({
      datasources: {
        db: {
          url: process.env.MONGO_DB_URL?.replace("/app", `/${this.dbName}`),
        },
      },
    });
  });

  getPrisma() {
    return this.prisma;
  }
}
