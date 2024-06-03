import { defineConfig } from "cypress";
import { ApiConfig } from "./app/api/ApiConfig";
import { getEnv } from "./app/config/env.server";
import Decision from "./schemas/Decision";
import * as downloadFilePlugin from "cypress-downloadfile/lib/addPlugin.js";
const downloadFile = downloadFilePlugin.downloadFile;

new ApiConfig().initialize();

export default defineConfig({
  projectId: "99on42",
  retries: 2,
  env: getEnv(),
  e2e: {
    setupNodeEvents(on) {
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
