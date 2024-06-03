import { faker } from "@faker-js/faker";

export const getFakeDecision = (): Omit<Decision, "id"> => {
  return {
    episodeId: faker.number.int(100),
    segmentId: faker.number.int(100),
    speakers: faker.helpers.arrayElements(["1", "2", "3", "4", "5"], 2),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
  };
};
