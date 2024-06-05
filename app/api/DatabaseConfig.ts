import { singleton } from "~/utils/singleton.server";
import * as mongoose from "mongoose";
import Decision from "schemas/Decision";

export default class {
  private readonly getEnvs = () => {
    return {
      dbUrl: process.env.MONGO_DB_URL,
      dbName: process.env.MONGO_DB_NAME ?? "app",
      username: process.env.MONGO_DB_USER,
      password: process.env.MONGO_DB_PASSWORD,
    };
  };

  private readonly createIndexesAndCollections = async (
    db: typeof import("mongoose"),
  ) => {
    db.connection.db.createCollection("decisions");
    Decision.createIndexes();
  };

  private readonly connectDb = () =>
    singleton("mongoose", async () => {
      const { dbUrl, dbName, username, password } = this.getEnvs();
      const auth = username && password ? { username, password } : undefined;

      if (!dbUrl)
        throw new Error("Missing MONGO_DB_URL in environment variables");

      const db = await mongoose.connect(dbUrl, {
        auth,
        dbName: dbName,
      });

      this.createIndexesAndCollections(db);

      return db;
    });

  public static initialize() {
    return new this().connectDb();
  }
}
