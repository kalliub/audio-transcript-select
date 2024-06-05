import { singleton } from "~/utils/singleton.server";
import * as mongoose from "mongoose";

export default class {
  private readonly getEnvs = () => {
    return {
      dbUrl: process.env.MONGO_DB_URL,
      dbName: process.env.MONGO_DB_NAME ?? "app",
      username: process.env.MONGO_DB_USER,
      password: process.env.MONGO_DB_PASSWORD,
    };
  };

  private readonly connectDb = () =>
    singleton("mongoose", async () => {
      const { dbUrl, dbName, username, password } = this.getEnvs();
      const auth = username && password ? { username, password } : undefined;

      if (!dbUrl)
        throw new Error("Missing MONGO_DB_URL in environment variables");

      console.log("debug\n\n", this.getEnvs());

      const db = await mongoose.connect(dbUrl, {
        auth,
        dbName: dbName,
      });

      return db;
    });

  public static initialize() {
    return new this().connectDb();
  }
}
