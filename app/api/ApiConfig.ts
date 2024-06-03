import Decision from "../../schemas/Decision";
import { singleton } from "../utils/singleton.server";
import * as mongoose from "mongoose";

export class ApiConfig {
  private dbName = process.env.MONGO_DB_NAME ?? "app";
  private dbUrl = process.env.MONGO_DB_URL ?? "";

  constructor() {
    this.dbUrl = this.dbUrl.replace("/app", `/${this.dbName}`);
  }

  private mongoose = singleton("mongoose", async () => {
    const username = process.env.MONGO_DB_USER;
    const password = process.env.MONGO_DB_PASSWORD;

    const db = await mongoose.connect(this.dbUrl, {
      auth: {
        username,
        password,
      },
      dbName: this.dbName,
    });

    db.connection.db.createCollection("decisions");
    await Decision.createIndexes();

    return db;
  });

  /** Triggers database connection and returns it. */
  async initialize() {
    return this.mongoose;
  }
}
