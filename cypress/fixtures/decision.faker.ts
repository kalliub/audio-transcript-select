import { Decision } from "@prisma/client";
import { faker } from "@faker-js/faker";

export const getFakeDecision = (): Omit<Decision, "id"> => {
  return {
    episode_id: faker.number.int(100),
    segment_id: faker.number.int(100),
    speakers: faker.helpers.arrayElements(["1", "2", "3", "4", "5"], 2),
  };
};
