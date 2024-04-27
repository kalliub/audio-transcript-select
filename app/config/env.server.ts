import { z } from "zod";

const schema = z.object({
  MONGO_DB_URL: z.string(),
  ASSETS_URL: z.string(),
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
