import { Decision } from "@prisma/client";
import { getFakeDecision } from "cypress/fixtures/decision.faker";

describe("First Page", () => {
  beforeEach(() => {
    cy.task("db:Decision:drop");
    cy.visit("/");
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(50);
  });

  context("Rendering and Components", () => {
    it("Renders Page", () => {
      cy.get("h1").contains("Episodes");
    });

    it("Input the episode number", () => {
      cy.get("#episode-number").clear();
      cy.get("#episode-number").type("2");
    });

    it("Downloads all Episodes data", () => {
      const fakeDecision = getFakeDecision();

      cy.task("db:Decision", {
        operation: "create",
        decision: fakeDecision,
      });
      cy.intercept({
        method: "GET",
        pathname: "/episodes/download",
        query: {
          _data: "routes/episodes.download",
        },
      }).as("download-episodes-button");

      cy.get("#download-episodes").click();
      cy.wait("@download-episodes-button");

      cy.readFile<Record<number | string, Decision[]>>(
        "cypress/downloads/all-segments.json",
        "utf8",
      ).then((downloadedJson) => {
        const databaseSegment = downloadedJson[fakeDecision.episodeId][0];
        expect(databaseSegment.episodeId).equal(fakeDecision.episodeId);
        expect(databaseSegment.segmentId).equal(fakeDecision.segmentId);
        expect(databaseSegment.speakers).to.be.members(fakeDecision.speakers);
      });
    });

    it("Shows tooltip on download button", () => {
      cy.get("#download-episodes").trigger("mouseover");
      cy.get(".MuiTooltip-tooltip").should(
        "have.text",
        "Download JSON file with EVERY EPISODE submitted to the database",
      );
    });

    it("Navigates to the selected Episode", () => {
      cy.intercept({
        pathname: "/episode/1/segment/0",
        query: {
          _data: "routes/episode.$episodeId.segment.$segmentId",
        },
      }).as("get-episode-segment");

      cy.get("#goto-episode").click();
      cy.wait("@get-episode-segment");
    });
  });

  context("Errors and blockings", () => {
    it("Blocks to input letters", () => {
      cy.get("#episode-number").should("have.attr", "type", "number");
      cy.get("#episode-number").clear();
      cy.get("#episode-number").type("a");
      cy.get("#episode-number").should("have.value", "");
    });

    it("Disables > Button if episode number is empty", () => {
      cy.get("#episode-number").clear();
      cy.get("#episode-number").should("be.empty");

      cy.get("fieldset[aria-hidden=true]").should(
        "have.css",
        "border-color",
        "rgb(211, 47, 47)",
      );

      cy.get("#goto-episode").should("be.disabled");
    });

    it("Throws error if episode does not exist", () => {
      cy.intercept({
        pathname: "/episode/2/segment/0",
        query: {
          _data: "routes/episode.$episodeId",
        },
      }).as("get-inexistent-episode");

      cy.get("#episode-number").as("episode-input");
      cy.get("@episode-input").clear();
      cy.get("@episode-input").type("2");

      cy.get("#goto-episode").click();
      cy.wait("@get-inexistent-episode").then((interception) => {
        expect(interception.response?.statusCode).equal(500);
        expect(interception.response?.body.message).equal(
          "Episode file not found.",
        );
      });
    });
  });
});
