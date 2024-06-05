import mongoose from "mongoose";
import { defineConfig } from "cypress";
import Decision from "./schemas/Decision";
import * as downloadFilePlugin from "cypress-downloadfile/lib/addPlugin.js";
const downloadFile = downloadFilePlugin.downloadFile;

export default defineConfig({
  projectId: "99on42",
  retries: 2,
  experimentalInteractiveRunEvents: true,
  e2e: {
    setupNodeEvents(on) {
      on("before:run", async () => {
        const dbUrl = process.env.MONGO_DB_URL ?? "mongodb://localhost:27017/";
        const dbName = process.env.MONGO_DB_NAME ?? "test";
        const username = process.env.MONGO_DB_USER ?? "test-user";
        const password = process.env.MONGO_DB_PASSWORD ?? "test-password";

        await mongoose.connect(dbUrl, {
          auth: {
            username,
            password,
          },
          dbName,
        });
      });

      on("task", {
        downloadFile,

        "db:Decision:drop": async () => {
          return Decision.deleteMany({});
        },

        "db:Decision": async ({
          operation,
          decision,
        }: {
          operation: "create" | "findUnique" | "update";
          decision: Decision;
        }) => {
          try {
            switch (operation) {
              case "create":
                return await Decision.create(decision);
              case "findUnique":
                return await Decision.findOne({
                  episodeId: decision.episodeId,
                  segmentId: decision.segmentId,
                });
              case "update":
                return await Decision.findOneAndUpdate(
                  {
                    episodeId: decision.episodeId,
                    segmentId: decision.segmentId,
                  },
                  {
                    speakers: decision.speakers,
                  },
                  {
                    new: true,
                  },
                ).exec();

              default:
                return null;
            }
          } catch (err) {
            return (err as Error).message;
          }
        },
      });
    },
    baseUrl: "http://localhost:3000",
  },
  viewportHeight: 1080,
  viewportWidth: 1920,
});
