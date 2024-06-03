import { Decision } from "@prisma/client";
import { getFakeDecision } from "cypress/fixtures/decision.faker";

describe("API Integration Tests", () => {
  beforeEach(() => {
    cy.task("db:Decision:drop");
  });

  context("Download Routes", () => {
    it("GET /episodes/download", () => {
      const fakeDecision = getFakeDecision();

      cy.task("db:Decision", {
        operation: "create",
        decision: fakeDecision,
      });

      cy.downloadFile(
        "http://localhost:3000/episodes/download",
        "cypress/downloads",
        "all-segments.json",
      ).then(() => {
        cy.readFile<Record<string, Omit<Decision, "id">[]>>(
          "cypress/downloads/all-segments.json",
        ).then((downloadedJson) => {
          const databaseSegment = downloadedJson[fakeDecision.episodeId][0];
          expect(databaseSegment.episodeId).equal(fakeDecision.episodeId);
          expect(databaseSegment.segmentId).equal(fakeDecision.segmentId);
          expect(databaseSegment.speakers).to.be.members(fakeDecision.speakers);
        });
      });
    });

    it("GET /episode/:episodeId/download", () => {
      const fakeDecision = getFakeDecision();

      cy.task("db:Decision", {
        operation: "create",
        decision: fakeDecision,
      });

      const filename = `episode-${fakeDecision.episodeId}-segments.json`;

      cy.downloadFile(
        `http://localhost:3000/episode/${fakeDecision.episodeId}/download`,
        "cypress/downloads",
        filename,
      ).then(() => {
        cy.readFile<Omit<Decision, "id">[]>(
          "cypress/downloads/" + filename,
        ).then((downloadedJson) => {
          const databaseSegment = downloadedJson[0];
          expect(databaseSegment.episodeId).equal(fakeDecision.episodeId);
          expect(databaseSegment.segmentId).equal(fakeDecision.segmentId);
          expect(databaseSegment.speakers).to.be.members(fakeDecision.speakers);
        });
      });
    });
  });
  context("Episode assets", () => {});
  context("/episode/:episodeId/segment/:segmentId", () => {});
  context("/episode/:episodeId/check", () => {});
});
