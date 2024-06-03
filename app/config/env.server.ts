import { z } from "zod";

const schema = z.object({
  MONGO_DB_URL: z
    .string()
    .regex(/^mongodb(\+srv)?:\/\/.*$/, "Should start with `mongodb+srv://`"),
  MONGO_DB_USER: z.string().optional(),
  MONGO_DB_PASSWORD: z.string().optional(),
  MONGO_DB_NAME: z.string().optional().default("app"),
  EPISODES_FILES_PATH: z
    .string()
    .regex(
      /^\/.*[^/]$/,
      "Should start with a slash, but not end with a slash. Format example: `/app/data`",
    )
    .optional()
    .default("/app/data"),
  USE_TEST_DB: z
    .string()
    .regex(/^(true|false)$/)
    .optional()
    .default("false"),
});

type ENV = z.infer<typeof schema>;

declare global {
  // eslint-disable-next-line no-var, vars-on-top
  var ENV: ENV;
  interface Window {
    ENV: ENV;
  }
}

export const getEnv = () => schema.parse(process.env);

/**
 * All the Env variables that will be available to application's client-side.
 * @example
 * ["APP_NAME"]
 */
export const publicEnvVars: string[] = [];
