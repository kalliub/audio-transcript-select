import { defineConfig } from "cypress";
import { Decision } from "@prisma/client";
import { ApiConfig } from "./app/api/ApiConfig";
import { getEnv } from "./app/config/env.server";

export default defineConfig({
  projectId: "99on42",
  env: getEnv(),
  retries: 2,
  e2e: {
    setupNodeEvents(on) {
      on("task", {
        "db:Decision:drop": async () => {
          const prisma = new ApiConfig().getPrisma();
          await prisma.decision.deleteMany();
          return null;
        },

        "db:Decision": async ({
          operation,
          decision,
        }: {
          operation: "create" | "findUnique" | "update";
          decision: Decision;
        }) => {
          const prisma = new ApiConfig().getPrisma();

          try {
            switch (operation) {
              case "create":
                return await prisma.decision.create({ data: decision });
              case "findUnique":
                return await prisma.decision.findUnique({
                  where: {
                    unique_decision_per_episode_segment: {
                      episode_id: decision.episode_id,
                      segment_id: decision.segment_id,
                    },
                  },
                });
              case "update":
                return await prisma.decision.update({
                  where: {
                    unique_decision_per_episode_segment: {
                      episode_id: decision.episode_id,
                      segment_id: decision.segment_id,
                    },
                  },
                  data: {
                    speakers: decision.speakers,
                  },
                });
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
