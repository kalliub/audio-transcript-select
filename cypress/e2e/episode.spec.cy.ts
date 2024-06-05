import { getFakeDecision } from "cypress/fixtures/decision.faker";
import { cleanSpeakersString } from "~/utils/formatters";

describe("Episode Page", () => {
  const getEpisodes = () => {
    return cy.fixture<Segment[]>(`episodeData`).as("episodes");
  };

  beforeEach(() => {
    cy.task("db:Decision:drop");
    cy.visit("/episode/1/segment/0");
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(50);
  });

  after(() => {
    cy.task("db:Decision:drop");
  });

  context("Rendering and Components", () => {
    it("Renders page", () => {
      getEpisodes().then((episodeData) => {
        cy.get("h1").should("have.text", "Episode 1");
        cy.get("h3").contains(
          new RegExp(String.raw`# ${episodeData[0].id} of \d+ segments`),
        );
        cy.get("audio").should("exist");
        cy.get("#segment-timestamp").should(
          "have.text",
          `Timestamp: ${episodeData[0].start} ~ ${episodeData[0].end}`,
        );
        cy.get("#speakers-input").should("exist");
        cy.get("#segment-text").should("have.text", episodeData[0].text);
      });
    });

    it("Allows typing on Speakers input", () => {
      cy.get("#speakers-input");
      cy.get("#speakers-input").clear();
      cy.get("#speakers-input").type("1,2,3");
      cy.get("#speakers-input").should("have.value", "1,2,3");
    });

    it("Automatically plays the audio track for more than 1 second", () => {
      cy.get("audio").then(($audio) => {
        const audio = $audio.get(0);
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(1500).then(() => {
          expect(audio.currentTime).to.be.greaterThan(1);
        });
      });
    });
  });

  context("Forms and Navigation", () => {
    it("Submit speakers", () => {
      cy.intercept({
        method: "POST",
        pathname: "/episode/1/segment/0",
        query: {
          _data: "routes/episode.$episodeId.segment.$segmentId",
        },
      }).as("submit-speakers");

      cy.intercept({
        method: "GET",
        pathname: "/episode/1/segment/1",
        query: {
          _data: "routes/episode.$episodeId.segment.$segmentId",
        },
      }).as("next-episode-redirect");

      const fakeSpeakers = getFakeDecision().speakers;

      cy.get("#speakers-input").as("speakers-input");
      cy.get("@speakers-input").clear();
      cy.get("@speakers-input").type(fakeSpeakers.join(","));

      cy.get("#submit-speakers").click();

      cy.wait("@submit-speakers").its("response.statusCode").should("eq", 204);
      cy.wait("@next-episode-redirect");
    });

    it("Navigates to `Check Episode` page", () => {
      cy.get("button#check-episode").as("check-episode-button");
      cy.get("@check-episode-button").should("be.visible");
      cy.get("@check-episode-button").should("have.text", "Check Episode");
      cy.get("@check-episode-button").click();
      cy.url().should("contain", "/episode/1/check");
    });
  });

  context("Database or JSON data load", () => {
    it("Shows red X when decision is not on the database", () => {
      cy.get("#database-check")
        .children()
        .should("have.class", "uil-times-circle");

      cy.get("#database-check").realHover();
      cy.get(".MuiTooltip-tooltip").should(
        "have.text",
        "This segment IS NOT on the database!",
      );
    });

    it("Shows green check when decision is on the database", () => {
      cy.task("db:Decision", {
        operation: "create",
        decision: {
          ...getFakeDecision(),
          episodeId: 1,
          segmentId: 0,
        },
      });

      cy.reload();

      cy.get("#database-check")
        .children()
        .should("have.class", "uil-check-circle");

      cy.get("#database-check").realHover();
      cy.get(".MuiTooltip-tooltip").should(
        "have.text",
        "This segment is on the database!",
      );
    });

    it("Input has the same speakers from the JSON if it doesn't exist on the database", () => {
      getEpisodes().then(([episode]) => {
        cy.get("#speakers-input").should(
          "have.value",
          cleanSpeakersString(episode.speakers),
        );
      });
    });

    it("Input has the same speakers from the database if it exists", () => {
      const fakeDecisionSpeakers = getFakeDecision().speakers;
      cy.task("db:Decision", {
        operation: "create",
        decision: {
          speakers: fakeDecisionSpeakers,
          episodeId: 1,
          segmentId: 0,
        },
      });

      cy.reload();

      cy.get("#speakers-input").should(
        "have.value",
        fakeDecisionSpeakers.join(","),
      );
    });
  });
});
