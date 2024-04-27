import { PrismaClient } from "@prisma/client";

export class ApiService {
  protected prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }
}
