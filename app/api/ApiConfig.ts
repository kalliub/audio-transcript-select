import { PrismaClient } from "@prisma/client";
import { singleton } from "~/utils/singleton.server";

export class ApiConfig {
  protected prisma = singleton("prisma", () => new PrismaClient());
}
